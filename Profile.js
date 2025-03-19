import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const ProfilePage = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <Image 
          source={{ uri: 'https://www.example.com/profile-picture.jpg' }} // Replace with a real image URL
          style={styles.profileImage}
        />
        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.bio}>Software Developer | Tech Enthusiast | Traveller</Text>
      </View>

      <View style={styles.contactInfo}>
        <Text style={styles.contactTitle}>Contact Information</Text>
        <Text style={styles.contactText}>Email: johndoe@example.com</Text>
        <Text style={styles.contactText}>Phone: (123) 456-7890</Text>
        <Text style={styles.contactText}>Location: New York, USA</Text>
      </View>

      {/* Button to redirect to Premium */}
      <TouchableOpacity style={styles.premiumButton} onPress={() => navigation.navigate('Premium')}>
        <Text style={styles.premiumButtonText}>Go Premium</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  bio: {
    fontSize: 16,
    color: '#777',
  },
  contactInfo: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  contactText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  premiumButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  premiumButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProfilePage;