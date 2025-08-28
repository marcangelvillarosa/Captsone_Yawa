// styles.js
import { StyleSheet, Platform, StatusBar } from 'react-native';
import { Dimensions } from 'react-native';
  
const { width } = Dimensions.get('window');

export default StyleSheet.create({

  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },

////// Login //////

  loginbody: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#2F5249'
  },

  div1: {
    height: '60%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  div2: {
    height: '40%',
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: '4%',
    borderTopRightRadius: '4%',
  },
  
  Header: {
    width: '100%',
    height: '20%',
    paddingLeft: 15,
    display: 'flex',  
    justifyContent: 'center',
  },
  content1_text1: {
       fontSize: width * 0.04,
       fontWeight: 'bold',
  },
  content1_text2: {
    fontSize: width * 0.03,
    fontWeight: 'thin'
  },


  input1: {
    width: '100%',
    height: '15%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },

  email: {
    width: '93%',
    height: '95%',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingLeft: 15,
    borderWidth:  1,
    borderColor: 'gray'
  },

  input2: {
    width: '100%',
    height: '15%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },

  password: {
    width: '93%',
    height: '95%',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingLeft: 15,
    borderWidth:  1,
    borderColor: 'gray'
  },

  
  login: {
    width: '100%',
    height: '15%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginbutton: {
    width: '93%',
    height: '85%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#437057',
    borderRadius: 8,
    color: 'white',
  },
  logintext: {
    color: 'white',
  },

  or: {
    width: '100%',
    height: '12%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },

  line: {
    width: '41%',
    height: '1%',
    backgroundColor: 'gray',
    marginLeft: 10,
    marginRight: 10
  },

  Signup: {
    width: '100%',
    height: '15%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  signupbutton: {
    width: '93%',
    height: '85%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    color: '#437057',
  },

  signuptext: {
    color: '#437057',
  },

////// Signup //////

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },

  createacc: {
    width: '100%',
    paddingLeft: 15,
    marginBottom: 10,
  },

  createacctext: {
    fontSize: width * 0.05,
    fontWeight: '400',
    paddingLeft: 15,
    color: '#437057',
  },

  signupform: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },

  fullname: {
    width: '85%',
    marginBottom: 5,
  },
  fullnameinput: {
    width: '100%',
    height: 50,
    paddingLeft: 15,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    backgroundColor: 'white',
  },

  signupemail: {
    width: '85%',
    marginBottom: 5,
  },
  emailinput: {
    width: '100%',
    height: 50,
    paddingLeft: 15,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    backgroundColor: 'white',
  },

  singuppassword: {
    width: '85%',
    marginBottom: 5,
  },
  passwordinput: {
    width: '100%',
    height: 50,
    paddingLeft: 15,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    backgroundColor: 'white',
  },

  confirmpassword: {
    width: '85%',
    marginBottom: 5,
  },
  confirmpasswordinput: {
    width: '100%',
    height: 50,
    paddingLeft: 15,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    backgroundColor: 'white',
  },

  errorText: {
    color: 'red',
    fontSize: 13,
    width: '85%',
    marginBottom: 5,
    textAlign: 'left',
  },

  submit: {
    width: '85%',
    height: 50,
    backgroundColor: '#437057',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginTop: 10,
  },

  submittext: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  haveacc: {
    width: '85%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'gray',
  },
  haveacctext: {
    fontSize: 16,
    color: '#437057',
  },

  or2: {
    width: '100%',
    height: '7%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  line2: {
    width: '38%',
    height: '1%',
    backgroundColor: 'gray',
    marginLeft: 10,
    marginRight: 10
  },

  signupheader:{
    width: '100%',
    height: '9%',
    backgroundColor: '#437057',
    position: 'absolute',
    top: 0,
    display: 'flex',
    justifyContent: 'center',
    paddingLeft: 25,
  },
  signupheadertext:{
    fontSize: 23,
    fontWeight: 'bold',
    color: 'white'
  },

  terms:{
    width:'90%',
    height: '20%',
    padding: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  termstext:{
    fontSize: 14,
    fontWeight: '300',
    textAlign: 'left'
  },

////// Driver Signup //////

driversignupheader: {
  width: '85%',
  height: '100%',
  display: 'flex',
  flexDirection: 'row',
},
driversignupheaderdiv1: {
  height: '100%',
  width: '65%',
  display: 'flex',
  justifyContent: 'flex-end',
  paddingBottom: 15,
},
driversignupheaderdiv2: {
  height: '100%',
  width: '35%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
},
driversignupheaderdtext1: {
  fontSize: 22,
  fontWeight: '700',
  color: '#437057'
},
driversignupheaderdtext2: {
  fontSize: 15,
  fontWeight: '300',
  color: 'gray',
},
driversignupheaderimage: {
  width: '60%',
  height: '60%',
},

imagePickerButton: {
  borderWidth: 1,
  borderColor: 'gray',
  padding: 10,
  borderRadius: 5,
  marginTop: 10,
  marginBottom: 5,
  alignItems: 'center',
  width: 170,
},

imagePickerText: {
  color: 'gray',
  fontWeight: 'bold',
},

picker: {
  height: 50,
  marginVertical: 10,
  borderWidth: 1,
  borderColor: 'gray',
  borderRadius: 5,
  paddingHorizontal: 10,
},

driverfullnameinput: {
  width: '85%',
  height: 50,
  paddingLeft: 15,
  borderWidth: 1,
  borderColor: 'gray',
  borderRadius: 8,
  backgroundColor: 'white',
  marginBottom: 5,
},

emailInputContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  width: '85%',
  borderColor: 'gray',
  borderWidth: 1,
  borderRadius: 8,
  paddingHorizontal: 12,
  marginBottom: 5,
  height: 50,
},

usernameInput: {
  flex: 1,
},

emailSuffix: {
  color: '#ccc',
  marginLeft: 5,
},

driverpassword: {
  width: '85%',
  height: 50,
  paddingLeft: 15,
  borderWidth: 1,
  borderColor: 'gray',
  borderRadius: 8,
  backgroundColor: 'white',
  marginBottom: 5,
},
viewimage: {
  width: 170,           
  height: 170,        
  borderRadius: 15,   
  borderWidth: 1,
  borderColor: '#ccc', 
  overflow: 'hidden',   
  alignSelf: 'center',  
  marginTop: 10,
  marginBottom: 5   
},

profileImage: {
  width: '100%',
  height: '100%',
  resizeMode: 'cover',
},

///// Driver Interface /////

 driverbody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: 'pink'
  },



});
