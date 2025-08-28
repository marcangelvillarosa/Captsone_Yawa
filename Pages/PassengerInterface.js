// import React, { useEffect, useRef, useState } from "react";
// import { 
//   View, 
//   PermissionsAndroid, 
//   Platform, 
//   TouchableOpacity, 
//   Modal, 
//   FlatList, 
//   Text 
// } from "react-native";
// import { WebView } from "react-native-webview";
// import Geolocation from "react-native-geolocation-service";
// import io from "socket.io-client";
// import styles from '../CSS/driverinterface'; 
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Navigation from "../Components/Navigation";
// import { useAuth } from "../Authentication/AuthContext";

// // ⚠️ Change IP if testing on a real device
// const socket = io("http://10.0.2.2:21108");

// export default function PassengerInterface({ route }) {
//   const { user } = useAuth();
//   const email = user?.email;
//   const role = user?.role;

//   const webViewRef = useRef(null);
//   const [watchId, setWatchId] = useState(null);


//   // Dropdown states
//   const [showRouteModal, setShowRouteModal] = useState(false);
//   const [selectedRoute, setSelectedRoute] = useState(null); // ✅ renamed from route

//   useEffect(() => {
//     const requestPermission = async () => {
//       if (Platform.OS === "android") {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
//         );
//         if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
//           console.log("❌ Location permission denied");
//           return;
//         }
//       }

//       // Start watching GPS
//       const id = Geolocation.watchPosition(
//         (pos) => {
//           const coords = pos.coords;

//           // Send passenger’s location to backend
//           socket.emit("updateLocation", {
//             email: email || "unknown@example.com",
//             role: role || "passenger",
//             latitude: coords.latitude,
//             longitude: coords.longitude,
//           });

//           // Update passenger marker in WebView
//           if (webViewRef.current) {
//             webViewRef.current.postMessage(
//               JSON.stringify({
//                 type: "self",
//                 latitude: coords.latitude,
//                 longitude: coords.longitude,
//               })
//             );
//           }
//         },
//         (err) => console.log("GPS error:", err),
//         { enableHighAccuracy: true, distanceFilter: 0, interval: 1000, fastestInterval: 1000 }
//       );

//       setWatchId(id);
//     };

//     requestPermission();
//     return () => {
//       if (watchId !== null) Geolocation.clearWatch(watchId);
//     };
//   }, []);

//   // Listen for other users (drivers)
//   useEffect(() => {
//     socket.on("locations", (data) => {
//       console.log("📡 Received users:", data);

//       if (webViewRef.current) {
//         webViewRef.current.postMessage(
//           JSON.stringify({
//             type: "others",
//             users: data,
//           })
//         );
//       }
//     });

//     return () => {
//       socket.off("locations");
//     };
//   }, []);

//   // WebView HTML (Leaflet map)
//   const leafletHTML = `
//     <!DOCTYPE html>
//     <html>
//       <head>
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css"/>
//         <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
//         <style>
//           #map { height: 100vh; width: 100vw; margin:0; padding:0; }
//           body { margin:0; }
//         </style>
//       </head>
//       <body>
//         <div id="map"></div>
//         <script>
//           var map = L.map('map').setView([0,0], 2);
//           L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//             attribution: '© OpenStreetMap contributors'
//           }).addTo(map);

//           var selfMarker = null;
//           var otherMarkers = {};

//           document.addEventListener("message", function(event) {
//             var data = JSON.parse(event.data);

//             // Show passenger’s own location
//             if (data.type === "self") {
//               var lat = data.latitude, lon = data.longitude;
//               if (!selfMarker) {
//                 selfMarker = L.marker([lat, lon], {icon: L.icon({
//                   iconUrl: "https://cdn-icons-png.flaticon.com/512/1077/1077012.png",
//                   iconSize: [32, 32]
//                 })}).addTo(map);
//                 selfMarker.bindPopup("🙋 Passenger").openPopup();
//                 map.setView([lat, lon], 15);
//               } else {
//                 selfMarker.setLatLng([lat, lon]);
//                 map.setView([lat, lon]);
//               }
//             }

//             // Show drivers only
//             if (data.type === "others") {
//               var users = data.users;
//               users.forEach(u => {
//                 if (u.role === "driver") {  
//                   var id = u.email;
//                   if (!otherMarkers[id]) {
//                     otherMarkers[id] = L.marker([u.latitude, u.longitude], {icon: L.icon({
//                       iconUrl: "https://cdn-icons-png.flaticon.com/512/743/743922.png",
//                       iconSize: [32, 32]
//                     })}).addTo(map);
//                     otherMarkers[id].bindPopup("🚖 Driver: " + u.email);
//                   } else {
//                     otherMarkers[id].setLatLng([u.latitude, u.longitude]);
//                   }
//                 }
//               });
//             }
//           });
//         </script>
//       </body>
//     </html>
//   `;

//   const routeOptions = [
//     'Route 1','Route 2','Route 2a','Route 3','Route 4','Route 5','Route 5a','Route 5b','Route 6',
//     'Route 7','Route 8','Route 10','Route 10b','Route 11','Route 12','Route 13','Route 14',
//     'Toril','Talomo','Bangkal','Ulas','Matina','Matina Aplaya','Mintal','Tugbok','Pichon','Bangkerohan',
//     'Buhangin','Cabantian','Panacan','Sasa','Lanang','Bunawan','Tibungco','Calinan','Catalunan Grande',
//     'Catalunan Pequeño','Baliok','Ma-a','Ecoland','Obrero','Acacia','Alambre','Bago Aplaya','Baracatan',
//     'Binugao','Camp Catitipan','Catitipan','Communal','El Rio Vista','Elinita Heights','Emily Homes',
//     'Guianga','Inawayan','Indangan','Jade Valley','Juliville Subd','Landmark iii','Lasang','Magtuod',
//     'Mandug','Marahan','Marilog','Mulig','Panabo','Puan','Rosalina 3','Sirib','Tagakpan','Tamugan',
//     'Tigatto','Wa-an'
//   ];

//   return (
//     <SafeAreaView style={styles.container}>
     
//       <View style={styles.body}>

//         {/* Header with Route Picker */}
//         <View style={styles.header}>

//            <Text>Welcome, {user?.name} ({user?.email})</Text>

//            <TouchableOpacity
//             onPress={() => setShowRouteModal(true)}
//             style={styles.selectroute}
//           >
//             <Text style={{ color: selectedRoute ? '#000' : '#aaa' }}>
//               {selectedRoute ? selectedRoute : 'Select Route'}
//             </Text>
//           </TouchableOpacity>

//           {/* Modal Dropdown */}
//           <Modal
//             transparent
//             animationType="fade"
//             visible={showRouteModal}
//             onRequestClose={() => setShowRouteModal(false)}
//           >
//             <TouchableOpacity
//               style={{ flex: 1, justifyContent: 'center', backgroundColor: '#00000088' }}
//               activeOpacity={1}
//               onPressOut={() => setShowRouteModal(false)}
//             >
//               <View style={{
//                 margin: 20,
//                 backgroundColor: '#fff',
//                 borderRadius: 10,
//                 padding: 10,
//                 maxHeight: '70%',
//               }}>

//                 <FlatList
//                   data={routeOptions}
//                   keyExtractor={(item) => item}
//                   renderItem={({ item }) => (
//                     <TouchableOpacity
//                       onPress={() => {
//                         setSelectedRoute(item);
//                         setShowRouteModal(false);
//                       }}
//                       style={{
//                         padding: 12,
//                         borderBottomColor: '#ccc',
//                         borderBottomWidth: 1,
//                       }}
//                     >
//                       <Text>{item}</Text>
//                     </TouchableOpacity>
//                   )}
//                 />
//               </View>
//             </TouchableOpacity>
//           </Modal>

//         </View>

//         <WebView 
//           ref={webViewRef} 
//           originWhitelist={["*"]} 
//           source={{ html: leafletHTML }} 
//           style={styles.map}
//         />


//       </View>


//     </SafeAreaView>
//   );
// }


import React, { useEffect, useRef, useState } from "react";
import { 
  View, 
  PermissionsAndroid, 
  Platform, 
  TouchableOpacity, 
  Modal, 
  FlatList, 
  Text,
  Image 
} from "react-native";
import { WebView } from "react-native-webview";
import Geolocation from "react-native-geolocation-service";
import io from "socket.io-client";
import styles from '../CSS/driverinterface'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import Navigation from "../Components/Navigation";
import { useAuth } from "../Authentication/AuthContext";

// ⚠️ Change IP if testing on a real device
const socket = io("http://10.0.2.2:21108");

export default function PassengerInterface({ route }) {
  const { user } = useAuth();
  const email = user?.email;
  const role = user?.role;

  const webViewRef = useRef(null);
  const [watchId, setWatchId] = useState(null);

const [onlineDrivers, setOnlineDrivers] = useState([]);
const [driverCache, setDriverCache] = useState({});


  // Dropdown states
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [showRouteButton, setShowRouteButton] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null); // ✅ renamed from route

  // 👇 New state for driver info
  const [driverInfo, setDriverInfo] = useState(null);

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

          // Send passenger’s location to backend
          socket.emit("updateLocation", {
            email: email || "unknown@example.com",
            role: role || "passenger",
            latitude: coords.latitude,
            longitude: coords.longitude,
          });

          // Update passenger marker in WebView
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
        { enableHighAccuracy: true, distanceFilter: 0, interval: 1000, fastestInterval: 1000 }
      );

      setWatchId(id);
    };

    requestPermission();
    return () => {
      if (watchId !== null) Geolocation.clearWatch(watchId);
    };
  }, []);


 // Listen for other users (drivers) and fetch their route from API
useEffect(() => {
  socket.on("locations", async (data) => {
    console.log("📡 Received users:", data);

    const updatedDrivers = await Promise.all(
      data.map(async (driver) => {
        if (driver.role !== "driver") return null;

        // If we already cached this driver's info, merge it
        if (driverCache[driver.email]) {
          return { ...driver, ...driverCache[driver.email] };
        }

        // Otherwise, fetch from API
        try {
          const res = await fetch(
            `http://10.0.2.2:21108/api/v1/driverinfo/${encodeURIComponent(driver.email)}`
          );
          const json = await res.json();

          if (json.success) {
            const driverInfo = json.driver;

            // save to cache
            setDriverCache((prev) => ({
              ...prev,
              [driver.email]: driverInfo,
            }));

            return { ...driver, ...driverInfo };
          }
        } catch (err) {
          console.error("❌ Error fetching driver info:", err);
        }

        return driver; // fallback
      })
    );

    setOnlineDrivers(updatedDrivers.filter(Boolean));
  });

  return () => {
    socket.off("locations");
  };
}, [driverCache]);

// Send filtered drivers to WebView
useEffect(() => {
  if (!webViewRef.current) return;

  const filtered = onlineDrivers.filter((driver) => {
    if (!selectedRoute) return true; // if no filter, show all
    return driver.Route === selectedRoute;
  });

  webViewRef.current.postMessage(
    JSON.stringify({
      type: "others",
      users: filtered,
    })
  );
}, [onlineDrivers, selectedRoute]);



  // 📩 Listen to messages from WebView (when marker clicked)
const handleMessage = async (event) => {
  try {
    const data = JSON.parse(event.nativeEvent.data);
    if (data.type === "driverInfo") {
      const { email, latitude, longitude } = data.driver;

      // show modal with just email + coords first
      setDriverInfo({ email, latitude, longitude, loading: true });

      try {
        const res = await fetch(
          `http://10.0.2.2:21108/api/v1/driverinfo/${encodeURIComponent(email)}`
        );

        if (!res.ok) {
          throw new Error(`API Error: ${res.status}`);
        }

        const json = await res.json();

        if (json.success) {
          setDriverInfo({
            ...json.driver,  // FName, LastName, Route, ImageUrl, Email
            email,           // keep socket email
            latitude,
            longitude,
            loading: false,
          });
        } else {
          setDriverInfo({ email, latitude, longitude, loading: false });
        }
      } catch (err) {
        console.error("❌ API fetch error:", err);
        setDriverInfo({ email, latitude, longitude, loading: false });
      }
    }
  } catch (e) {
    console.error("❌ Message parse error:", e);
  }
};

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

// useEffect(() => {
//   if (!selectedRoute || !webViewRef.current) return;

//   const fetchRoute = async () => {
//     try {
//       const res = await fetch(
//         `http://10.0.2.2:21108/api/v1/routes/${encodeURIComponent(selectedRoute)}`
//       );
//       const json = await res.json();

//       if (json.success) {
//         // ✅ ensure correct format: [[lat, lng], [lat, lng]]
//         const coords = json.route.coordinates.map((c) => 
//           Array.isArray(c) ? c : [c.latitude, c.longitude]
//         );

//         console.log("📡 Sending coords to map:", coords);

//         webViewRef.current.postMessage(
//           JSON.stringify({ type: "route", coords })
//         );
//       } else {
//         console.error("❌ Route not found:", json.message);
//       }
//     } catch (err) {
//       console.error("❌ Error fetching route:", err);
//     }
//   };

//   fetchRoute();
// }, [selectedRoute]);

// Replace the useEffect that shows the route automatically with this function

const handleViewRoute = async () => {
  if (!selectedRoute || !webViewRef.current) return;

  clearRouteFromMap();

  try {
    const res = await fetch(
      `http://10.0.2.2:21108/api/v1/routes/${encodeURIComponent(selectedRoute)}`
    );
    const json = await res.json();

    if (json.success) {
      const coords = json.route.coordinates.map((c) => 
        Array.isArray(c) ? c : [c.latitude, c.longitude]
      );

      console.log("📡 Sending coords to map:", coords);

      webViewRef.current.postMessage(
        JSON.stringify({ type: "route", coords })
      );
    } else {
      console.error("❌ Route not found:", json.message);
    }
  } catch (err) {
    console.error("❌ Error fetching route:", err);
  }
  
  // Hide the button after viewing the route
  setShowRouteButton(false);
};

// Add this function with your other functions
const clearRouteFromMap = () => {
  if (webViewRef.current) {
    webViewRef.current.postMessage(
      JSON.stringify({ type: "clear_route" })
    );
  }
};


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

          .leaflet-bottom.leaflet-right {
            margin-bottom: 8%;   
          }

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
          var userIsMovingMap = false;
          var idleTimeout = null;
          var currentRoute = null;
          var accessToken = "pk.eyJ1IjoibWFyY2FuaWEiLCJhIjoiY21lbDNyZXpjMGRuOTJpb285YmY2aDlscCJ9.udUoHaHGJ_-XDF7uVJB5Zg";

       // ✅ Base layer
          var baseLayer = L.tileLayer(
            "https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=" + accessToken,
            {
              tileSize: 512,
              zoomOffset: -1,
              attribution: "© Mapbox © OpenStreetMap",
            }
          ).addTo(map);

          // ✅ Traffic overlay (don't add yet!)
          var trafficLayer = L.tileLayer(
            "https://api.mapbox.com/styles/v1/mapbox/traffic-day-v2/tiles/{z}/{x}/{y}?access_token=" + accessToken,
            {
              tileSize: 512,
              zoomOffset: -1,
              opacity: 0.8
            }
          );

          // ✅ Add a control to toggle
          L.control.layers(
            { "Streets": baseLayer },         // base maps
            { "Traffic": trafficLayer },      // overlays
            { position: "bottomright" }       
          ).addTo(map);

          // Put legend in bottomright (same corner as layer control)
          var trafficLegend = L.control({ position: "bottomright" });

          trafficLegend.onAdd = function () {
            var div = L.DomUtil.create("div", "traffic-legend");
            div.innerHTML =
              '<div style="font-size:13px; line-height:20px;">' +
                '<div><span style="background:#2DC937;width:15px;height:15px;display:inline-block;margin-right:6px;border-radius:50%;"></span> Low</div>' +
                '<div><span style="background:#E7B416;width:15px;height:15px;display:inline-block;margin-right:6px;border-radius:50%;"></span> Medium</div>' +
                '<div><span style="background:#CC3232;width:15px;height:15px;display:inline-block;margin-right:6px;border-radius:50%;"></span> High</div>' +
              '</div>';

            div.style.background = "white";
            div.style.padding = "8px 8px";
            div.style.borderRadius = "5px";
            div.style.boxShadow = "0 0 8px rgba(0,0,0,0.3)";
            div.style.marginBottom = "10px";   // ✅ Push legend above layer toggle
            return div;
          };

          // ✅ Show legend only when traffic overlay is enabled
          map.on("overlayadd", function (eventLayer) {
            if (eventLayer.name === "Traffic") {
              trafficLegend.addTo(map);
            }
          });

          map.on("overlayremove", function (eventLayer) {
            if (eventLayer.name === "Traffic") {
              map.removeControl(trafficLegend);
            }
          });


          map.on("movestart", function() {
            userIsMovingMap = true;
            if (idleTimeout) clearTimeout(idleTimeout);
          });

          // After movement ends, start a timer to re-enable auto-centering
          map.on("moveend", function() {
            idleTimeout = setTimeout(() => {
              userIsMovingMap = false;
            }, 5000); // ⏱️ 5 seconds idle before re-centering allowed
          });

          // ✅ unified listener
          document.addEventListener("message", function(event) {
            var data = JSON.parse(event.data);

            if (data.type === "heatmap") {
              if (heatLayer) {
                map.removeLayer(heatLayer);
              }
              heatLayer = L.heatLayer(data.points, { radius: 25 }).addTo(map);
            }

            if (data.type === "clear_route") {
              if (currentRoute) {
                map.removeLayer(currentRoute);
                currentRoute = null;
              }
              return; // Exit early after clearing
            }

            if (data.type === "route") {
              if (currentRoute) {
                map.removeLayer(currentRoute);
              }

              // currentRoute = L.polyline(data.coords, { color: "blue", weight: 4 }).addTo(map);
              // map.fitBounds(currentRoute.getBounds());

              if (data.coords && data.coords.length > 0) {
                currentRoute = L.polyline(data.coords, { color: "blue", weight: 4 }).addTo(map);
                map.fitBounds(currentRoute.getBounds());
              }
            }

            // Show passenger’s own location
            if (data.type === "self") {
              var lat = data.latitude, lon = data.longitude;
              if (!selfMarker) {
                selfMarker = L.marker([lat, lon], {icon: L.icon({
                  iconUrl: "https://cdn-icons-png.flaticon.com/512/1077/1077012.png",
                  iconSize: [32, 32]
                })}).addTo(map);
                selfMarker.bindPopup("🙋 Passenger").openPopup();
                map.setView([lat, lon], 15);
              } else {
                selfMarker.setLatLng([lat, lon]);
                if (!userIsMovingMap) {
                  map.setView([lat, lon]);
                }
              }
            }

            // Show drivers only
            if (data.type === "others") {
              var users = data.users;
              var currentIds = users.map(u => u.email);

              // Remove markers that are no longer in filtered list
              for (var id in otherMarkers) {
                if (!currentIds.includes(id)) {
                  map.removeLayer(otherMarkers[id]);
                  delete otherMarkers[id];
                }
              }

              // Add/update filtered drivers
              users.forEach(u => {
                if (u.role === "driver") {
                  var id = u.email;
                  if (!otherMarkers[id]) {
                    otherMarkers[id] = L.marker([u.latitude, u.longitude], {icon: L.icon({
                      iconUrl: "https://cdn-icons-png.flaticon.com/512/743/743922.png",
                      iconSize: [32, 32]
                    })}).addTo(map);

                    otherMarkers[id].on("click", function() {
                      window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: "driverInfo",
                        driver: u
                      }));
                    });

                    otherMarkers[id].bindPopup("🚖 Driver: " + u.email);
                  } else {
                    otherMarkers[id].setLatLng([u.latitude, u.longitude]);
                  }
                }
              });
            }
          });
        </script>
      </body>
    </html>
  `;


  // WebView HTML (Leaflet map)
  // const leafletHTML = `
  //   <!DOCTYPE html>
  //   <html>
  //     <head>
  //       <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //       <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css"/>
  //       <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
  //       <script src="https://unpkg.com/leaflet.heat/dist/leaflet-heat.js"></script>
  //       <style>
  //         #map { height: 100vh; width: 100vw; margin:0; padding:0; }
  //         body { margin:0; }
  //       </style>
  //     </head>
  //     <body>
  //       <div id="map"></div>
  //       <script>
  //         var map = L.map('map').setView([0,0], 2);

  //         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //           attribution: '© OpenStreetMap contributors'
  //         }).addTo(map);

  //         var selfMarker = null;
  //         var otherMarkers = {};
  //         var heatLayer;
  //         var userIsMovingMap = false;
  //         var idleTimeout = null;
  //         var currentRoute = null;


  //         map.on("movestart", function() {
  //           userIsMovingMap = true;
  //           if (idleTimeout) clearTimeout(idleTimeout);
  //         });

  //         // After movement ends, start a timer to re-enable auto-centering
  //         map.on("moveend", function() {
  //           idleTimeout = setTimeout(() => {
  //             userIsMovingMap = false;
  //           }, 5000); // ⏱️ 5 seconds idle before re-centering allowed
  //         });

  //           document.addEventListener("message", function(event) {
  //             var data = JSON.parse(event.data);

  //             if (data.type === "heatmap") {
  //               if (heatLayer) {
  //                 map.removeLayer(heatLayer);
  //               }
  //               heatLayer = L.heatLayer(data.points, { radius: 25 }).addTo(map);
  //             }

  //              if (data.type === "route") {
  //               if (currentRoute) {
  //                 map.removeLayer(currentRoute);
  //               }
  //               currentRoute = L.polyline(data.coords, { color: "blue", weight: 4 }).addTo(map);
  //               map.fitBounds(currentRoute.getBounds()); // auto-zoom to route
  //             }
                
  //           });

  //         document.addEventListener("message", function(event) {
  //           var data = JSON.parse(event.data);

  //           // Show passenger’s own location
  //           if (data.type === "self") {
  //             var lat = data.latitude, lon = data.longitude;
  //             if (!selfMarker) {
  //               selfMarker = L.marker([lat, lon], {icon: L.icon({
  //                 iconUrl: "https://cdn-icons-png.flaticon.com/512/1077/1077012.png",
  //                 iconSize: [32, 32]
  //               })}).addTo(map);
  //               selfMarker.bindPopup("🙋 Passenger").openPopup();
  //               map.setView([lat, lon], 15);
  //             } else {
  //               selfMarker.setLatLng([lat, lon]);
  //               if (!userIsMovingMap) {
  //               map.setView([lat, lon]);
  //             }
  //             }


  //           }

  //           // Show drivers only
  //      if (data.type === "others") {
  //         var users = data.users;
  //         var currentIds = users.map(u => u.email);

  //         // Remove markers that are no longer in filtered list
  //         for (var id in otherMarkers) {
  //           if (!currentIds.includes(id)) {
  //             map.removeLayer(otherMarkers[id]);
  //             delete otherMarkers[id];
  //           }
  //         }

  //         // Add/update filtered drivers
  //         users.forEach(u => {
  //           if (u.role === "driver") {
  //             var id = u.email;
  //             if (!otherMarkers[id]) {
  //               otherMarkers[id] = L.marker([u.latitude, u.longitude], {icon: L.icon({
  //                 iconUrl: "https://cdn-icons-png.flaticon.com/512/743/743922.png",
  //                 iconSize: [32, 32]
  //               })}).addTo(map);

  //               otherMarkers[id].on("click", function() {
  //                 window.ReactNativeWebView.postMessage(JSON.stringify({
  //                   type: "driverInfo",
  //                   driver: u
  //                 }));
  //               });

  //               otherMarkers[id].bindPopup("🚖 Driver: " + u.email);
  //             } else {
  //               otherMarkers[id].setLatLng([u.latitude, u.longitude]);
  //             }
  //           }
  //         });
  //       }

  //         });
  //       </script>
  //     </body>
  //   </html>
  // `;

  const routeOptions = [
    'Route 1','Route 2','Route 2a','Route 3','Route 4','Route 5','Route 5a','Route 5b','Route 6',
    'Route 7','Route 8','Route 10','Route 10b','Route 11','Route 12','Route 13','Route 14',
    'Toril','Talomo','Bangkal','Ulas','Matina','Matina Aplaya','Mintal','Tugbok','Pichon','Bangkerohan',
    'Buhangin','Cabantian','Panacan','Sasa','Lanang','Bunawan','Tibungco','Calinan','Catalunan Grande',
    'Catalunan Pequeño','Baliok','Ma-a','Ecoland','Obrero','Acacia','Alambre','Bago Aplaya','Baracatan',
    'Binugao','Camp Catitipan','Catitipan','Communal','El Rio Vista','Elinita Heights','Emily Homes',
    'Guianga','Inawayan','Indangan','Jade Valley','Juliville Subd','Landmark iii','Lasang','Magtuod',
    'Mandug','Marahan','Marilog','Mulig','Panabo','Puan','Rosalina 3','Sirib','Tagakpan','Tamugan',
    'Tigatto','Wa-an'
  ];

  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.body}>

        {/* Header with Route Picker */}
        <View style={styles.header}>
          <Text>Welcome, {user?.name} ({user?.email})</Text>

          <TouchableOpacity
            onPress={() => setShowRouteModal(true)}
            style={styles.selectroute}
          >
            <Text style={{ color: selectedRoute ? '#000' : '#aaa' }}>
              {selectedRoute ? selectedRoute : 'Select Route'}
            </Text>
          </TouchableOpacity>
       
          {/* Modal Dropdown */}
          <Modal
            transparent
            animationType="fade"
            visible={showRouteModal}
            onRequestClose={() => setShowRouteModal(false)}
          >
            <TouchableOpacity
              style={{ flex: 1, justifyContent: 'center', backgroundColor: '#00000088' }}
              activeOpacity={1}
              onPressOut={() => setShowRouteModal(false)}
            >
              <View style={{
                margin: 20,
                backgroundColor: '#fff',
                borderRadius: 10,
                padding: 10,
                maxHeight: '70%',
              }}>
                <FlatList
                  data={routeOptions}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        clearRouteFromMap();
                        setSelectedRoute(item);
                        setShowRouteModal(false);
                        setShowRouteButton(true);
                      }}
                      style={{
                        padding: 12,
                        borderBottomColor: '#ccc',
                        borderBottomWidth: 1,
                      }}
                    >
                      <Text>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </TouchableOpacity>
          </Modal>

          <View style={styles.viewbutton}>
            {showRouteButton && (
              <TouchableOpacity
                onPress={handleViewRoute}
                style={styles.viewRouteButton}
              >
                <Text style={styles.viewRouteText}>View Route</Text>
              </TouchableOpacity>
            )}
        </View>
        </View>


        

        {/* Map */}
        <WebView 
          ref={webViewRef} 
          originWhitelist={["*"]} 
          source={{ html: leafletHTML }} 
          style={styles.map}
          onMessage={handleMessage}
          onLoadEnd={() => setWebViewReady(true)}
        />

        {/* Driver Info Modal */}
      <Modal
        transparent
        animationType="slide"
        visible={!!driverInfo}
        onRequestClose={() => setDriverInfo(null)}
      >
      <View style={{
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center"
      }}>
      <View style={{
        width: "85%",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20
      }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        🚖 Driver Information
      </Text>

      {/* Always show email (from socket.io) */}
      <Text>Email: {driverInfo?.email}</Text>

      {/* Show loading while fetching */}
      {driverInfo?.loading && <Text>Loading profile...</Text>}

      {/* Profile details (from DB API) */}
      {!driverInfo?.loading && (
        <>
          {driverInfo?.ImageUrl && (
            <Image
              source={{ uri: driverInfo.ImageUrl }}
              style={{ width: 80, height: 80, borderRadius: 40, marginVertical: 10 }}
            />
          )}
          {driverInfo?.FName && (
            <Text>Name: {driverInfo.FName} {driverInfo.LastName}</Text>
          )}
          {driverInfo?.Route && <Text>Route: {driverInfo.Route}</Text>}
        </>
      )}

      <TouchableOpacity 
        onPress={() => setDriverInfo(null)} 
        style={{ marginTop: 15, alignSelf: "flex-end" }}
      >
        <Text style={{ color: "red" }}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

      </View>
    </SafeAreaView>
  );
}

