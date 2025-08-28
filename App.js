// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './Authentication/Login';
import Signup from './Authentication/Signup';
import PassengerInterface from './Pages/PassengerInterface';
import DriverSignup from './Authentication/DriverSignup';
import DriverInterface from './Pages/DriverInterface';
import TrafficReport from './Pages/TrafficReports';
import { AuthProvider } from "./Authentication/AuthContext";
import Navbar from "./Components/Navigation";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <AuthProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login}  options={{ headerShown: false }}/>
        <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }}/>
        <Stack.Screen name="PassengerInterface" component={PassengerInterface} options={{ headerShown: false }}/>
        <Stack.Screen name="DriverSignup" component={DriverSignup} options={{ headerShown: false }}/>
        <Stack.Screen name="DriverInterface" component={DriverInterface} options={{ headerShown: false }}/>
       <Stack.Screen name="TrafficReports" component={TrafficReport} options={{ headerShown: false }}/>
      </Stack.Navigator>

      <Navbar />
    </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
