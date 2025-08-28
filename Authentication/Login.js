import React, { useState } from 'react';
import { View, Text, StatusBar, StyleSheet, TextInput, Alert, Button, Image, TouchableOpacity } from 'react-native';
import styles from '../CSS/style'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from "../Authentication/AuthContext";


import axios from 'axios';

const Login = ({ navigation }) => {   

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useAuth();

  const baseURL = 'http://10.0.2.2:21108/api/v1/login';


//   const handleLogin = async () => {
//   try {
//     const response = await axios.post(baseURL, {
//       email,
//       password,
//     });

//     const data = response.data;

//     if (data && data.success && data.user) {
//       Alert.alert('Login Successful', `Welcome ${data.user.FName}`);
//       navigation.navigate('Home'); 
//     } else {
//       Alert.alert('Login Failed', data.message || 'Invalid credentials');
//     }

//   } catch (error) {
//     console.error("Login error:", error);
//     Alert.alert('Error', 'Something went wrong. Please try again.');
//   }
// };

 const handleLogin = async () => {
    try {
      const response = await axios.post(baseURL, { email, password });
      const data = response.data;

      if (data && data.success && data.user) {
        Alert.alert('Login Successful', `Welcome ${data.user.FName}`);

        // Get role from backend OR fallback to email domain
        let role = data.user.role || (email.endsWith("@driver.com") ? "driver" : "passenger");
        setUser({ email, role, name: data.user.FName });

      if (role === "driver") {
        navigation.replace("DriverInterface", { user: data.user });
      } else {
        navigation.replace("PassengerInterface", { user: data.user });
      }

      } else {
        Alert.alert('Login Failed', data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error("Login error:", error.message);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };



  return (
     <>     
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.loginbody}>
        
        
        <View style={styles.div1}>
            <Text style={{ fontSize: 30, marginBottom: 10, fontWeight: 'bold', color: 'white' }}>TrackSakyan</Text>
            <Image source={require('../assets/logo.png')} style={{ width: 250, height: 250 }}/>
        </View>

      

        <View style={styles.div2}>
            <View style={styles.Header}>
                <Text style={styles.content1_text1}>Sign up or Log in</Text>
                <Text style={styles.content1_text2}>Select your preferred method to continue</Text>
            </View>

             <View style={styles.input1}>
                <TextInput style={styles.email} placeholder='Email' value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none"></TextInput>
             </View>

            <View style={styles.input2}>
                <TextInput style={styles.password} placeholder='Password' value={password} onChangeText={setPassword} secureTextEntry></TextInput>
             </View>

            <View style={styles.login}>
              <TouchableOpacity
                style={styles.loginbutton}
                onPress={handleLogin}
              >
                <Text style={styles.logintext}>Login</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.or}>
              <View style={styles.line}></View>
                    <Text>or</Text>
              <View style={styles.line}></View>
            </View>

            <View style={styles.Signup}>
              <TouchableOpacity
                style={styles.signupbutton}
                onPress={() => navigation.navigate('Signup')}
              >
                <Text style={styles.signuptext}>Sign up</Text>
              </TouchableOpacity>
            </View>

        </View>

      </View>
    </SafeAreaView>
    </>
  );
};

export default Login;
