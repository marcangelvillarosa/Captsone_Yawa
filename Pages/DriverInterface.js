import React, { useEffect, useRef, useState } from "react";
import { View, PermissionsAndroid, Platform, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import Geolocation from "react-native-geolocation-service";
import io from "socket.io-client";

// ⚠️ Change IP if testing on real phone
const socket = io("http://10.0.2.2:21108");

export default function DriverInterface({ route }) {
  const { user } = route.params;   // 👈 get the `user` object
  const email = user?.Email || user?.email;
  const role = user?.role || "driver";
  const webViewRef = useRef(null);
  const [watchId, setWatchId] = useState(null);

  useEffect(() => {
    const requestPermission = async () => {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log("❌ Location permission denied");
          return;
        }
      }

      // Start watching GPS
      const id = Geolocation.watchPosition(
        (pos) => {
          const coords = pos.coords;

          // Send location to backend
          socket.emit("updateLocation", {
            email: email || "driver@example.com",
            role: role || "driver",
            latitude: coords.latitude,
            longitude: coords.longitude,
          });

          // Update self marker in WebView
          if (webViewRef.current) {
            webViewRef.current.postMessage(
              JSON.stringify({
                type: "self",
                latitude: coords.latitude,
                longitude: coords.longitude,
              })
            );
          }
        },
        (err) => console.log("GPS error:", err),
        { enableHighAccuracy: true, distanceFilter: 0, interval:1000, fastestInterval: 1000 }
      );

      setWatchId(id);
    };

    requestPermission();
    return () => {
      if (watchId !== null) Geolocation.clearWatch(watchId);
    };
  }, []);

  // Listen for other users from backend
  useEffect(() => {
    socket.on("locations", (data) => {
      console.log("📡 Received users:", data);

      if (webViewRef.current) {
        webViewRef.current.postMessage(
          JSON.stringify({
            type: "others",
            users: data,
          })
        );
      }
    });

    return () => {
      socket.off("locations");
    };
  }, []);

  // WebView HTML
  const leafletHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css"/>
        <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
        <script src="https://unpkg.com/leaflet.heat/dist/leaflet-heat.js"></script>
        <style>
          #map { height: 100vh; width: 100vw; margin:0; padding:0; }
          body { margin:0; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var map = L.map('map').setView([0,0], 2);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);

          var selfMarker = null;
          var otherMarkers = {};
          var heatLayer;

            document.addEventListener("message", function(event) {
              var data = JSON.parse(event.data);

              if (data.type === "heatmap") {
                if (heatLayer) {
                  map.removeLayer(heatLayer);
                }
                heatLayer = L.heatLayer(data.points, { radius: 25 }).addTo(map);
              }
            });

          document.addEventListener("message", function(event) {
            var data = JSON.parse(event.data);

            // Update self marker
            if (data.type === "self") {
              var lat = data.latitude, lon = data.longitude;
              if (!selfMarker) {
                selfMarker = L.marker([lat, lon], {icon: L.icon({
                  iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
                  iconSize: [32, 32]
                })}).addTo(map);
                selfMarker.bindPopup("📍 You are here").openPopup();
                map.setView([lat, lon], 15);
              } else {
                selfMarker.setLatLng([lat, lon]);
                map.setView([lat, lon]);
              }
            }

            // Update other users
            if (data.type === "others") {
              var users = data.users;
              users.forEach(u => {
                var id = u.email;
                if (!otherMarkers[id]) {
                  otherMarkers[id] = L.marker([u.latitude, u.longitude], {icon: L.icon({
                    iconUrl: u.role === "driver" 
                      ? "https://cdn-icons-png.flaticon.com/512/743/743922.png"
                      : "https://cdn-icons-png.flaticon.com/512/1077/1077012.png",
                    iconSize: [32, 32]
                  })}).addTo(map);
                  otherMarkers[id].bindPopup(u.role + ": " + u.email);
                } else {
                  otherMarkers[id].setLatLng([u.latitude, u.longitude]);
                }
              });
            }
          });
        </script>
      </body>
    </html>
  `;


  const [heatmapData, setHeatmapData] = useState([]);
  
  // Fetch heatmap points from Flask
  useEffect(() => {
    const fetchHeatmap = async () => {
      try {
        const res = await fetch("http://10.0.2.2:5000/heatmap"); // ✅ GET instead of POST
        const data = await res.json(); // parse JSON safely
        if (data.heatmap) {
          setHeatmapData(data.heatmap);
        } else {
          console.error("❌ Heatmap data missing:", data);
        }
      } catch (err) {
        console.error("❌ Error fetching heatmap:", err);
      }
    };
  
    fetchHeatmap();
  }, []);
  
  
const [webViewReady, setWebViewReady] = useState(false);
  
  // Send heatmap points to WebView
  useEffect(() => {
    if (webViewReady && webViewRef.current && heatmapData.length > 0) {
      webViewRef.current.postMessage(
        JSON.stringify({
          type: "heatmap",
          points: heatmapData
        })
      );
    }
  }, [heatmapData, webViewReady]);
  
  const sendHeatmap = (data) => {
    if (webViewRef.current) {
      webViewRef.current.postMessage(JSON.stringify({ type: "heatmap", points: data }));
    } else {
      setTimeout(() => sendHeatmap(data), 500); // retry after 0.5s
    }
  };

  return (
    <View style={styles.container}>
      <WebView ref={webViewRef} originWhitelist={["*"]} source={{ html: leafletHTML }} style={{ flex: 1 }} onLoadEnd={() => setWebViewReady(true)}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
