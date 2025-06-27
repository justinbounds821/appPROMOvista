import 'react-native-url-polyfill/auto'; // Necesar pentru Supabase pe React Native
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Aceste valori ar trebui stocate în variabile de mediu și nu hardcodate
// Pentru dezvoltare, le poți obține din dashboard-ul proiectului tău Supabase
// Supabase URL-ul specific proiectului tău
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL_PLACEHOLDER';
// Supabase Anon (public) Key specific proiectului tău
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY_PLACEHOLDER';

if (supabaseUrl === 'YOUR_SUPABASE_URL_PLACEHOLDER' || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY_PLACEHOLDER') {
  console.warn(
    'Supabase URL sau Anon Key nu sunt configurate. ' +
    'Te rugăm să creezi un fișier .env la rădăcina proiectului PromovistaApp și să adaugi:\n' +
    'EXPO_PUBLIC_SUPABASE_URL=url-ul-tau-supabase\n' +
    'EXPO_PUBLIC_SUPABASE_ANON_KEY=cheia-ta-anon-supabase\n' +
    'Și apoi rulează `npx expo start --clear` sau reconstruiește aplicația.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage, // Specifică AsyncStorage pentru React Native
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Important pentru React Native, gestionează manual redirect-urile
  },
});

// Verificare rapidă a clientului (opțional)
// console.log('Supabase client initialized:', supabase ? 'Success' : 'Failure');

/**
 * Documentație relevantă pentru configurarea Supabase cu Expo/React Native:
 * - Variabile de mediu în Expo: https://docs.expo.dev/guides/environment-variables/
 * - Supabase JS Client cu React Native: https://supabase.com/docs/guides/getting-started/tutorials/with-react-native
 * Asigură-te că ai configurat URL Redirects în setările de autentificare Supabase
 * pentru deep linking, deși pentru OTP SMS s-ar putea să nu fie la fel de critic ca la OAuth.
 */
