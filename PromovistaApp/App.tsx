import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from '@navigation/AppNavigator'; // Folosind path alias
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@store/auth/AuthContext'; // Importă AuthProvider

// Aici ai putea încărca fonturi custom dacă le ai
// import { useFonts } from 'expo-font';
// import * as SplashScreen from 'expo-splash-screen';

export default function App() {
  // Exemplu de încărcare fonturi (decomentează și adaugă fișierele de font în src/assets/fonts)
  // const [fontsLoaded] = useFonts({
  //   'Inter-Regular': require('./src/assets/fonts/Inter-Regular.ttf'),
  //   'Inter-Bold': require('./src/assets/fonts/Inter-Bold.ttf'),
  // });

  // React.useEffect(() => {
  //   async function prepare() {
  //     try {
  //       // Păstrează splash screen-ul vizibil până când fonturile sunt încărcate sau alte task-uri de inițializare sunt gata
  //       await SplashScreen.preventAutoHideAsync();
  //     } catch (e) {
  //       console.warn(e);
  //     }
  //   }
  //   prepare();
  // }, []);

  // if (!fontsLoaded) {
  //   // Poți returna null sau un view de încărcare customizat
  //   // Asigură-te că ascunzi splash screen-ul după ce fonturile sunt încărcate
  //   // SplashScreen.hideAsync();
  //   return null;
  // }

  // // Ascunde splash screen-ul odată ce totul e gata
  // SplashScreen.hideAsync();


  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
