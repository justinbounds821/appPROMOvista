import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import Button from '@components/common/Button';
import { supabase } from '@services/supabase/supabaseClient';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@navigation/AppNavigator';

type OtpScreenNavigationProp = StackNavigationProp<RootStackParamList, 'OtpScreen'>;
type OtpScreenRouteProp = RouteProp<RootStackParamList, 'OtpScreen'>;

interface Props {
  navigation: OtpScreenNavigationProp;
  route: OtpScreenRouteProp;
}

const OtpScreen: React.FC<Props> = ({ navigation, route }) => {
  const { phone } = route.params; // Numărul de telefon trimis de la LoginScreen
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(30); // 30 secunde pentru retrimitere

  const otpInputRef = useRef<TextInput>(null);

  useEffect(() => {
    otpInputRef.current?.focus();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendDisabled && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setResendDisabled(false);
      setCountdown(30); // Reset countdown
    }
    return () => clearTimeout(timer);
  }, [resendDisabled, countdown]);

  const handleVerifyOtp = async () => {
    if (otp.trim().length !== 6) {
      Alert.alert('Eroare', 'Codul OTP trebuie să conțină 6 cifre.');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: phone,
        token: otp.trim(),
        type: 'sms', // Sau 'phone_change' dacă este cazul, dar 'sms' e pentru login
      });

      if (error) {
        console.error('Supabase OTP verification error:', error);
        Alert.alert('Eroare la verificare OTP', error.message || 'Cod invalid sau expirat. Încearcă din nou.');
      } else if (data.session) {
        console.log('OTP Verification successful, session:', data.session);
        Alert.alert('Succes', 'Autentificare reușită!');

        // TODO: Verifică dacă utilizatorul are deja un profil complet în baza de date.
        // Aceasta este o simulare. Într-o aplicație reală, ai interoga tabela de profiluri.
        const isFirstLoginOrProfileIncomplete = true; // Simulare

        if (isFirstLoginOrProfileIncomplete) {
          // Navighează la ecranul de completare a profilului DUPĂ ce starea de autentificare s-a actualizat.
          // Listener-ul onAuthStateChange din AuthContext va actualiza starea.
          // AppNavigator va comuta la AuthStack dacă nu este deja acolo (deși ar trebui să fie).
          // Apoi, navigăm în cadrul AuthStack.
          // Este important ca `CompleteProfileScreen` să fie în același navigator (AuthStack).
          navigation.replace('CompleteProfile');
        } else {
          // Dacă profilul este complet, AuthContext ar trebui să gestioneze navigarea către MainAppStack
          // prin actualizarea stării globale. Nu ar trebui să navigăm explicit aici către MainHome
          // decât dacă AuthContext nu gestionează acest aspect (ceea ce ar trebui să facă).
          // Forțarea navigării aici poate duce la conflicte cu logica din AppNavigator.
          // navigation.replace('MainHome'); // Evităm momentan, lăsăm AuthContext să decidă.
          console.log("Profil existent detectat (simulat), AuthContext ar trebui să navigheze la MainHome.");
        }
      } else {
        // Cazul în care nu există sesiune dar nici eroare - mai puțin probabil cu OTP SMS
        Alert.alert('Eroare', 'Nu s-a putut stabili sesiunea. Contactează suportul.');
      }
    } catch (err: any) {
      console.error('Unexpected error during OTP verification:', err);
      Alert.alert('Eroare neașteptată', err.message || 'A apărut o problemă tehnică la verificarea OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setResendDisabled(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({ phone }); // Retrimite OTP
      if (error) {
        Alert.alert('Eroare', 'Nu s-a putut retrimite codul OTP.');
      } else {
        Alert.alert('Succes', 'Un nou cod OTP a fost trimis.');
        setCountdown(30); // Reset countdown
      }
    } catch (err) {
      Alert.alert('Eroare', 'A apărut o problemă la retrimiterea codului.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verifică-ți Telefonul</Text>
      <Text style={styles.subtitle}>Am trimis un cod OTP la numărul {phone}. Introdu codul mai jos.</Text>
      <TextInput
        ref={otpInputRef}
        style={styles.input}
        placeholder="_ _ _ _ _ _"
        keyboardType="number-pad"
        value={otp}
        onChangeText={setOtp}
        maxLength={6}
        textAlign="center"
        editable={!loading}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
      ) : (
        <Button
          title="Verifică Codul"
          onPress={handleVerifyOtp}
          buttonStyle={styles.verifyButton}
          disabled={loading || otp.length !== 6}
        />
      )}
      <Button
        title={resendDisabled ? `Retrimite (${countdown}s)` : "Retrimite Codul"}
        onPress={handleResendOtp}
        disabled={resendDisabled || loading}
        buttonStyle={styles.resendButton}
        textStyle={resendDisabled ? styles.disabledResendText : styles.resendText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  input: {
    width: '80%',
    maxWidth: 300,
    height: 60,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
    fontSize: 24,
    letterSpacing: 8, // Spațiere pentru a simula căsuțe separate
  },
  verifyButton: {
    width: '80%',
    maxWidth: 300,
    marginBottom: 15,
  },
  resendButton: {
    width: '80%',
    maxWidth: 300,
    backgroundColor: 'transparent',
    elevation: 0, // Elimină shadow pe Android pentru butoane transparente
    shadowOpacity: 0, // Elimină shadow pe iOS
  },
  resendText: {
    color: '#007bff',
    fontWeight: 'normal',
  },
  disabledResendText: {
    color: '#aaaaaa',
    fontWeight: 'normal',
  },
  loader: {
    marginTop: 20,
    marginBottom: 20,
  }
});

export default OtpScreen;
