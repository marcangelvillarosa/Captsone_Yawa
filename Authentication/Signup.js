import React, { useState } from 'react';
import axios from 'axios';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import styles from '../CSS/style';
import { SafeAreaView } from 'react-native-safe-area-context';


const Signup = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');

  const baseURL = 'http://10.0.2.2:21108/api/v1/signup'; 

  const handlePasswordChange = (text) => {
    setPassword(text);
    if (text.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
    } else {
      setPasswordError('');
    }

    // Re-check confirm password
    if (confirmPassword && text !== confirmPassword) {
      setConfirmError('Passwords do not match.');
    } else {
      setConfirmError('');
    }
  };

  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
    if (text !== password) {
      setConfirmError('Passwords do not match.');
    } else {
      setConfirmError('');
    }
  };

  const handleSignUp = async () => {
    if (!passwordError && !confirmError && fullName && email && password && confirmPassword) {
      try {
        const response = await axios.post(baseURL, {
          FName: fullName,
          Email: email,
          Password: password,
        });

        if (response.data.success) {
          Alert.alert('Success', 'Account created successfully!');
          navigation.navigate('Login');
        } else {
          Alert.alert('Failed', response.data.message || 'Signup failed.');
        }
      } catch (error) {
        console.error('Signup Error:', error);
        Alert.alert('Error', 'Something went wrong. Try again.');
      }
    } else {
      if (!fullName) Alert.alert('Missing Field', 'Full name is required.');
      if (!email) Alert.alert('Missing Field', 'Email is required.');
      if (!password) setPasswordError('Password is required.');
      if (!confirmPassword) setConfirmError('Please confirm your password.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.signupheader}>
          <Text style={styles.signupheadertext}>TrackSakyan</Text>
        </View>

        <View style={styles.createacc}>
          <Text style={styles.createacctext}>Create Account</Text>
        </View>

        <View style={styles.signupform}>
          <View style={styles.fullname}>
            <TextInput
              placeholder="Full Name"
              style={styles.fullnameinput}
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <View style={styles.signupemail}>
            <TextInput
              placeholder="Email"
              style={styles.emailinput}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.singuppassword}>
            <TextInput
              placeholder="Password"
              style={styles.passwordinput}
              secureTextEntry
              value={password}
              onChangeText={handlePasswordChange}
            />
          </View>

          {passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}

          <View style={styles.confirmpassword}>
            <TextInput
              placeholder="Confirm Password"
              style={styles.confirmpasswordinput}
              secureTextEntry
              value={confirmPassword}
              onChangeText={handleConfirmPasswordChange}
            />
          </View>

          {confirmError ? (
            <Text style={styles.errorText}>{confirmError}</Text>
          ) : null}
        </View>

        <TouchableOpacity style={styles.submit} onPress={handleSignUp}>
          <Text style={styles.submittext}>Sign up</Text>
        </TouchableOpacity>

        <View style={styles.or2}>
          <View style={styles.line2}></View>
          <Text>or</Text>
          <View style={styles.line2}></View>
        </View>

        <TouchableOpacity
          style={styles.haveacc}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.haveacctext}>I have an account</Text>
        </TouchableOpacity>

        <View style={styles.terms}>
          <Text style={styles.termstext}>
           By proceeding, I agree that TrackSakay can collect, use and disclose the information provided by me in accordance with the <Text style={{color: '#437057', textDecorationLine: 'underline', fontWeight: 'bold'}}>Privacy Notice</Text> and I fully comply with <Text style={{color: '#437057', textDecorationLine: 'underline', fontWeight: 'bold'}}>Terms & Conditions</Text> which I have read and understand.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.haveacc}
          onPress={() => navigation.navigate('DriverSignup')}
        >
          <Text style={styles.haveacctext}>Register as a driver</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

export default Signup;
