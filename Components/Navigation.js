// components/Navbar.js
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import styles from '../CSS/navigation'; 
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../Authentication/AuthContext";



export default function Navbar() {

    const navigation = useNavigation();
    const { user } = useAuth();



   

  return (
    <View style={styles.navbar}>
      
      <TouchableOpacity style={styles.nav} onPress={() => navigation.navigate("PassengerInterface")}>
        <Image source={require('../assets/map.png')} style={{ width: "50%", height: "40%" }}/>
      </TouchableOpacity>

      <TouchableOpacity style={styles.nav} onPress={() => navigation.navigate("TrafficReports", { email: user?.email, role: user?.role })}>
        <Image source={require('../assets/post.png')} style={{ width: "50%", height: "40%" }}/>
      </TouchableOpacity>

      <View style={styles.qr}>
        
        <TouchableOpacity style={styles.qrlogo}>
            <View style={styles.qrcircle}>
                 <Image source={require('../assets/qr.png')} style={{ width: "50%", height: "50%" }}/>
            </View>
        </TouchableOpacity>
        <View style={styles.qrtext}>
            <Text style={styles.scanqr}>Scan QR</Text>
        </View>

      </View>

      <TouchableOpacity style={styles.nav}>
        <Image source={require('../assets/qr.png')} style={{ width: "50%", height: "40%" }}/>
      </TouchableOpacity>

      <TouchableOpacity style={styles.nav}>
        <Image source={require('../assets/user.png')} style={{ width: "50%", height: "40%" }}/>
      </TouchableOpacity>
      
    
    </View>
  );
}
