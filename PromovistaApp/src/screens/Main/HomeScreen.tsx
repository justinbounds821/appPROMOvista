import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '@components/common/Button'; // Folosind path alias

// Mock navigation prop type
type HomeScreenNavigationProp = {
  navigate: (screen: string) => void;
};

const HomeScreen: React.FC<{ navigation?: HomeScreenNavigationProp }> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ecran Principal (Home)</Text>
      <Text style={styles.content}>Aici va fi afișat conținutul principal al aplicației, cum ar fi campaniile disponibile.</Text>
      {/* Exemplu de buton care ar putea naviga undeva */}
      <Button
        title="Vezi Profil (Placeholder)"
        onPress={() => navigation?.navigate('Profile')}
        buttonStyle={styles.actionButton}
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
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  content: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#555',
  },
  actionButton: {
    marginTop: 10,
    backgroundColor: '#28a745', // O altă culoare pentru diferențiere
  }
});

export default HomeScreen;
