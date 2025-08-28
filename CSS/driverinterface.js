// styles.js
import { StyleSheet, Platform, StatusBar } from 'react-native';
import { Dimensions } from 'react-native';
  
const { width } = Dimensions.get('window');

export default StyleSheet.create({

 container: {
    flex: 1,
    position: 'relative',
  },

  body: 
  {
    width: "100%",
    height: "100%",
    position: "relative",
    backgroundColor: 'red',
  },

  map: 
  {
    flex: 1,
    position: 'relative',
  },

  header: 
  {
    width: "100%",
    height: "17%",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    zIndex: 1,
  },
  
  viewbutton:
  {
    width: "100%",
    height: "40%",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    top: 0,
    zIndex: 1,
  },

  selectroute:
  {
    width: "70%",
    height: "35%",
    borderRadius: 10,
    backgroundColor: "white",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: "solid",
    borderWidth: 1,
    borderColor: "gray",
  },

  navbar: 
  {
    width: "100%",
    height: "8%",
    backgroundColor: 'green',
    position: 'absolute',
    bottom: 0
  },

  viewRouteButton: {
  backgroundColor: '#007AFF',
  padding: 10,
  borderRadius: 5,
},
viewRouteText: {
  color: 'white',
  fontWeight: 'bold',
},

});
