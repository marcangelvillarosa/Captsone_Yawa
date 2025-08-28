import React, { useEffect, useRef, useState } from "react";
import { 
  View, 
  PermissionsAndroid, 
  Platform, 
  TouchableOpacity, 
  Modal, 
  FlatList, 
  Text 
} from "react-native";
import { WebView } from "react-native-webview";
import Geolocation from "react-native-geolocation-service";
import io from "socket.io-client";
import styles from '../CSS/driverinterface'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import Navigation from "../Components/Navigation";


// ⚠️ Change IP if testing on a real device
const socket = io("http://10.0.2.2:21108");

export default function TrafficReports() {


  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.body}>
        
        </View>
    </SafeAreaView>
  );
}
