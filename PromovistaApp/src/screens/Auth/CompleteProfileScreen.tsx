import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView } from 'react-native';
import Button from '@components/common/Button';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@navigation/AppNavigator';
// import { useAuth } from '@store/auth/AuthContext'; // Vom folosi user.id pentru a salva datele
// import { supabase } from '@services/supabase/supabaseClient'; // Pentru a salva datele în DB

type CompleteProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CompleteProfile'>;

interface Props {
  navigation: CompleteProfileScreenNavigationProp;
}

const CompleteProfileScreen: React.FC<Props> = ({ navigation }) => {
  // const { user } = useAuth(); // Pentru a asocia profilul cu user.id
  const [companyName, setCompanyName] = useState('');
  const [cui, setCui] = useState('');
  const [address, setAddress] = useState('');
  const [iban, setIban] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSaveProfile = async () => {
    if (!companyName.trim() || !cui.trim() || !address.trim() || !iban.trim()) {
      Alert.alert('Eroare', 'Toate câmpurile sunt obligatorii.');
      return;
    }
    // Validare IBAN (simplă, poate fi îmbunătățită)
    if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]{10,30}$/.test(iban.toUpperCase())) {
        Alert.alert('Eroare', 'Format IBAN invalid.');
        return;
    }
    // Validare CUI (simplă, poate fi îmbunătățită)
    if (!/^(RO)?[0-9]{2,10}$/.test(cui.toUpperCase())) {
        Alert.alert('Eroare', 'Format CUI invalid.');
        return;
    }


    setLoading(true);
    // TODO: Logica de salvare a datelor în tabela 'profiles' (sau similar) din Supabase
    // Asociază datele cu user.id
    // Exemplu:
    // const userId = user?.id;
    // if (!userId) {
    //   Alert.alert('Eroare', 'Utilizator neidentificat.');
    //   setLoading(false);
    //   return;
    // }
    // const { error } = await supabase.from('store_profiles').insert({
    //   user_id: userId,
    //   company_name: companyName,
    //   cui: cui,
    //   address: address,
    //   iban: iban,
    //   // alte câmpuri relevante, ex: role auto-assign 'Shop'
    //   role: 'Shop' // Sau gestionează rolul în alt mod
    // });

    // if (error) {
    //   Alert.alert('Eroare la salvare', error.message);
    // } else {
    //   Alert.alert('Succes', 'Profilul a fost salvat!');
    //   // Navighează către MainHome după salvarea profilului
    //   // Acest lucru va fi gestionat de AuthContext care va detecta că profilul e complet
    //   // și va schimba starea, ducând la navigarea către MainAppStack
    //   // Sau putem naviga explicit dacă AuthContext nu face asta automat:
    //   // navigation.replace('MainHome'); // Asigură-te că MainHome e definit în RootStackParamList
    // }

    // Simulare salvare
    setTimeout(() => {
      Alert.alert('Profil Salavat (Mock)', `Companie: ${companyName}, CUI: ${cui}, IBAN: ${iban}`);
      // Aici, AuthContext ar trebui să preia controlul și să navigheze userul către MainAppStack
      // Deoarece nu avem încă logica de verificare profil în AuthContext, vom lăsa așa momentan.
      // Utilizatorul va trebui să închidă și să redeschidă aplicația sau să se re-logheze
      // pentru ca AppNavigator să îl ducă la MainHome (presupunând că sesiunea persistă).
      // Acest lucru va fi îmbunătățit.
      // Pentru a forța navigarea acum (deși AuthState nu s-a schimbat fundamental):
      // navigation.getParent()?.navigate('MainHome'); // Încearcă să navigheze la stack-ul părinte
      // Sau, dacă CompleteProfile este în același stack cu MainHome (nu e cazul acum)
      // navigation.replace('MainHome');
      // Cel mai corect ar fi ca AuthProvider să aibă o stare "profileComplete"
    }, 1000);


    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Completează Profilul Magazinului</Text>
      <Text style={styles.subtitle}>Aceste informații sunt necesare pentru a continua.</Text>

      <TextInput
        style={styles.input}
        placeholder="Numele Companiei (SRL/PFA)"
        value={companyName}
        onChangeText={setCompanyName}
        editable={!loading}
      />
      <TextInput
        style={styles.input}
        placeholder="CUI / CIF"
        value={cui}
        onChangeText={setCui}
        editable={!loading}
        autoCapitalize="characters"
      />
      <TextInput
        style={styles.input}
        placeholder="Adresa Punctului de Lucru"
        value={address}
        onChangeText={setAddress}
        editable={!loading}
      />
      <TextInput
        style={styles.input}
        placeholder="IBAN (Cont Bancar în RON)"
        value={iban}
        onChangeText={setIban}
        editable={!loading}
        autoCapitalize="characters"
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
      ) : (
        <Button
          title="Salvează și Continuă"
          onPress={handleSaveProfile}
          buttonStyle={styles.saveButton}
          disabled={loading}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
    textAlign: 'center',
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
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  saveButton: {
    width: '100%',
    marginTop: 10,
  },
  loader: {
    marginTop: 20,
  }
});

export default CompleteProfileScreen;
