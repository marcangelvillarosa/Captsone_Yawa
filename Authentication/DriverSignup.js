import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  Alert, Image, Modal, FlatList
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import styles from '../CSS/style';
import placeholder from '../assets/imageplaceholder.jpg'
import { SafeAreaView } from 'react-native-safe-area-context';

const DriverSignup = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [route, setRoute] = useState('');
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [image, setImage] = useState(null);
  const email = `${username}@driver.com`;

  const handlePasswordChange = (text) => {
  setPassword(text);
  if (text.length < 8) {
    setPasswordError('Password must be at least 8 characters.');
  } else {
    setPasswordError('');
  }

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


const routeOptions = [
  // Route numbers
  'Route 1',
  'Route 2',
  'Route 2a',
  'Route 3',
  'Route 4',
  'Route 5',
  'Route 5a',
  'Route 5b',
  'Route 6',
  'Route 7',
  'Route 8',
  'Route 10',
  'Route 10b',
  'Route 11',
  'Route 12',
  'Route 13',
  'Route 14',

  // Major district routes
  'Toril',
  'Talomo',
  'Bangkal',
  'Ulas',
  'Matina',
  'Matina Aplaya',
  'Mintal',
  'Tugbok',
  'Pichon',
  'Bangkerohan',
  'Buhangin',
  'Cabantian',
  'Panacan',
  'Sasa',
  'Lanang',
  'Bunawan',
  'Tibungco',
  'Calinan',
  'Catalunan Grande',
  'Catalunan Pequeño',
  'Baliok',
  'Ma-a',
  'Ecoland',
  'Obrero',

  // Additional locations / barangays / sitios
  'Acacia',
  'Alambre',
  'Bago Aplaya',
  'Baracatan',
  'Binugao',
  'Camp Catitipan',
  'Catitipan',
  'Communal',
  'El Rio Vista',
  'Elinita Heights',
  'Emily Homes',
  'Guianga',
  'Inawayan',
  'Indangan',
  'Jade Valley',
  'Juliville Subd',
  'Landmark iii',
  'Lasang',
  'Magtuod',
  'Mandug',
  'Marahan',
  'Marilog',
  'Mulig',
  'Panabo',
  'Puan',
  'Rosalina 3',
  'Sirib',
  'Tagakpan',
  'Tamugan',
  'Tigatto',
  'Wa-an'
];


  const pickImage = async () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
      includeBase64: false,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
        Alert.alert('Error', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        setImage(response.assets[0]); // ✅ same as expo but from react-native-image-picker
      }
    });
  };

  const handleSubmit = async () => {
    
    if (!firstName || !lastName || !route || !image || !username || !password || !confirmPassword) {
    Alert.alert('Error', 'All fields including confirm password and photo are required');
    return;
    }

    if (passwordError || confirmError) {
    Alert.alert('Error', 'Please fix the password issues before submitting.');
    return;
    }

    const email = `${username}@driver.com`;

    const formData = new FormData();
    formData.append('FirstName', firstName);
    formData.append('LastName', lastName);
    formData.append('Route', route);
    formData.append('Email', email);
    formData.append('Password', password);
    formData.append('DriverImage', {
      uri: image.uri,
      name: 'photo.jpg',
      type: 'image/jpeg',
    });

    try {
      const res = await axios.post('http://10.0.2.2:21108/api/v1/driversignup', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        Alert.alert('Success', res.data.message);
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', res.data.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'Failed to upload. Try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
    <ScrollView contentContainerStyle={styles.scrollContent}>
    
    <View style={{width: '100%', height: '15%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}> 
        
        <View style={styles.driversignupheader}>
            <View style={styles.driversignupheaderdiv1}>
                <Text style={styles.driversignupheaderdtext1}>New driver registration</Text>
                <Text style={styles.driversignupheaderdtext2}>Tell us about yourself bro.</Text>
            </View>
            <View style={styles.driversignupheaderdiv2}>
                <Image source={require('../assets/person.png')} style={styles.driversignupheaderimage}/>
            </View>
        </View>

    </View>

    <View style={{width: '100%', height: '85%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}> 

        <TextInput
          placeholder="First Name"
          style={styles.driverfullnameinput}
          value={firstName}
          onChangeText={setFirstName}
        />

        <TextInput
          placeholder="Last Name"
          style={styles.driverfullnameinput}
          value={lastName}
          onChangeText={setLastName}
        />

        <TouchableOpacity
          onPress={() => setShowRouteModal(true)}
          style={[styles.driverfullnameinput, { justifyContent: 'center' }]}
        >
          <Text style={{ color: route ? '#000' : '#aaa' }}>
            {route ? route : 'Select Route'}
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
            }}>
              <FlatList
                data={routeOptions}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setRoute(item);
                      setShowRouteModal(false);
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

        {/* Custom Username + Email field */}
        <View style={styles.emailInputContainer}>
          <TextInput
            placeholder="Username"
            style={styles.usernameInput}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            placeholderTextColor="#aaa"
          />
          <Text style={styles.emailSuffix}>@driver.com</Text>
        </View>

        <TextInput
        placeholder="Password"
        style={styles.driverpassword}
        value={password}
        onChangeText={handlePasswordChange}
        secureTextEntry={true}
        />
        {passwordError ? (
        <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}

        <TextInput
        placeholder="Confirm Password"
        style={styles.driverpassword}
        value={confirmPassword}
        onChangeText={handleConfirmPasswordChange}
        secureTextEntry={true}
        />
        {confirmError ? (
        <Text style={styles.errorText}>{confirmError}</Text>
        ) : null}

        <View style={styles.viewimage}>
            <Image
                source={image ? { uri: image.uri } : placeholder}
                style={styles.profileImage}
            />
        </View>


        <TouchableOpacity onPress={pickImage} style={styles.imagePickerButton}>
            <Text style={styles.imagePickerText}>
            {image ? 'Change Photo' : 'Upload Photo'}
            </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.submit} onPress={handleSubmit}>
          <Text style={styles.submittext}>Submit</Text>
        </TouchableOpacity>

    </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default DriverSignup;
