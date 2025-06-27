import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import Button from '@components/common/Button'; // Folosind path alias
import { supabase } from '@services/supabase/supabaseClient'; // Importă clientul Supabase
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@navigation/AppNavigator'; // Asigură-te că ai exportat asta

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (phoneNumber.trim() === '' || !/^\d{10}$/.test(phoneNumber.trim())) {
      Alert.alert('Eroare', 'Te rugăm să introduci un număr de telefon valid (10 cifre).');
      return;
    }

    setLoading(true);
    try {
      // Adaugă prefixul de țară dacă nu este deja prezent. Presupunem România (+40)
      // Supabase necesită formatul E.164 pentru numerele de telefon.
      // Pentru România, dacă utilizatorul introduce "07xxxxxxxx", îl transformăm în "+407xxxxxxxx".
      const formattedPhoneNumber = phoneNumber.startsWith('0') ? `+40${phoneNumber.substring(1)}` : phoneNumber;

      if (!formattedPhoneNumber.startsWith('+40')) {
        Alert.alert('Eroare', 'Numărul de telefon trebuie să fie în format local (07xx...) sau internațional (+407xx...).');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signInWithOtp({
        phone: formattedPhoneNumber,
      });

      if (error) {
        console.error('Supabase OTP error:', error);
        Alert.alert('Eroare la trimitere OTP', error.message || 'A apărut o problemă. Încearcă din nou.');
      } else {
        // Nu toate metodele signInWithOtp returnează date direct în `data` la acest pas.
        // Succesul aici înseamnă că OTP-ul a fost trimis.
        console.log('OTP trimis cu succes către:', formattedPhoneNumber, data);
        Alert.alert('Succes', 'Codul OTP a fost trimis pe numărul tău de telefon.');
        navigation.navigate('OtpScreen', { phone: formattedPhoneNumber }); // Navighează la ecranul OTP
      }
    } catch (err: any) {
      console.error('Unexpected error during OTP sign in:', err);
      Alert.alert('Eroare neașteptată', err.message || 'A apărut o problemă tehnică.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bun venit la Promovista!</Text>
      <Text style={styles.subtitle}>Introdu numărul de telefon pentru a continua</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 0722123456"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        maxLength={10} // Utilizatorii români vor introduce probabil 10 cifre
        editable={!loading}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
      ) : (
        <Button
          title="Trimite cod OTP"
          onPress={handleLogin}
          buttonStyle={styles.loginButton}
          disabled={loading}
        />
      )}
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    color: '#666',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  loginButton: {
    width: '100%',
  },
  loader: {
    marginTop: 20,
  }
});

export default LoginScreen;
