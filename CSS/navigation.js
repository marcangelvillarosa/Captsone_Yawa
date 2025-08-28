// styles.js
import { StyleSheet, Platform, StatusBar } from 'react-native';
import { Dimensions } from 'react-native';
  
const { width } = Dimensions.get('window');

export default StyleSheet.create({

  navbar: 
  {
    width: "100%",
    height: "8%",
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: "row",
  },
  nav: 
  {
    width: "13%",
    height: "100%",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  qr: 
  {
    width: "18%",
    height: "100%",
    display: 'flex',
  },
    qrlogo: 
  {
    width: "100%",
    height: "60%",
    display: 'flex',
    position: "relative",
  },
    qrtext: 
  {
    width: "100%",
    height: "40%",
    display: 'flex',
    alignItems: 'center',
  },
    scanqr: 
  {
    
  },
      qrcircle: 
  {
    width: "100%",
    height: 70,
    backgroundColor: "white",
    position: "absolute",
    borderRadius: "100%",
    bottom: 1,
    border: "solid",
    borderColor: "#2F5249",
    borderWidth: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },


  


});
