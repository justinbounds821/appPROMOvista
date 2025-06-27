import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator, StyleSheet } from 'react-native'; // Pentru SplashScreen

import LoginScreen from '@screens/Auth/LoginScreen';
import OtpScreen from '@screens/Auth/OtpScreen';
import HomeScreen from '@screens/Main/HomeScreen';
import CompleteProfileScreen from '@screens/Auth/CompleteProfileScreen'; // Importă CompleteProfileScreen

import { useAuth } from '@store/auth/AuthContext'; // Importă hook-ul useAuth

// Definirea tipurilor pentru ecranele din navigator
export type RootStackParamList = {
  Login: undefined;
  OtpScreen: { phone: string };
  MainHome: undefined;
  CompleteProfile: undefined; // Adăugat pentru ecranul de completare profil
  // Adaugă alte ecrane aici pe măsură ce le creezi
};

const Stack = createStackNavigator<RootStackParamList>();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="OtpScreen" component={OtpScreen} />
    <Stack.Screen name="CompleteProfile" component={CompleteProfileScreen} />
  </Stack.Navigator>
);

const MainAppStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="MainHome"
      component={HomeScreen}
      options={{ title: 'Promovista Acasă' }}
    />
    {/* TODO: CompleteProfileScreen ar putea fi accesibil și din MainAppStack pentru editare ulterioară. */}
    {/* <Stack.Screen name="CompleteProfile" component={CompleteProfileScreen} options={{ title: 'Editează Profil' }} /> */}
  </Stack.Navigator>
);

// Un simplu SplashScreen
const LoadingSplashScreen: React.FC = () => (
  <View style={styles.splashContainer}>
    <ActivityIndicator size="large" color="#007bff" />
  </View>
);

const AppNavigator: React.FC = () => {
  const { session, loading } = useAuth();

  if (loading) {
    // Afișează un ecran de încărcare cât timp se verifică starea sesiunii
    return <LoadingSplashScreen />;
  }

  return (
    <NavigationContainer>
      {session && session.user ? <MainAppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5', // Sau culoarea de fundal a aplicației
  },
});

export default AppNavigator;
