import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';

const PremiumSubscription = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Go Premium</Text>
        <Text style={styles.headerSubtitle}>Unlock exclusive features and take your experience to the next level!</Text>
      </View>

      <Image
        source={{ uri: 'https://www.example.com/premium-banner.jpg' }} // Replace with a real image URL
        style={styles.bannerImage}
      />

      <View style={styles.featuresContainer}>
        <Text style={styles.featuresTitle}>Premium Features</Text>
        <View style={styles.featureItem}>
          <Text style={styles.featureBullet}>•</Text>
          <Text style={styles.featureText}>Ad-free experience</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureBullet}>•</Text>
          <Text style={styles.featureText}>Access to exclusive content</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureBullet}>•</Text>
          <Text style={styles.featureText}>Priority customer support</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureBullet}>•</Text>
          <Text style={styles.featureText}>Advanced analytics and insights</Text>
        </View>
      </View>

      <View style={styles.pricingContainer}>
        <Text style={styles.pricingTitle}>Choose Your Plan</Text>
        <View style={styles.plan}>
          <Text style={styles.planName}>Monthly Plan</Text>
          <Text style={styles.planPrice}>$9.99/month</Text>
        </View>
        <View style={styles.plan}>
          <Text style={styles.planName}>Yearly Plan</Text>
          <Text style={styles.planPrice}>$99.99/year</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.subscribeButton} onPress={() => navigation.navigate('Payment')}>
        <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  bannerImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  featuresContainer: {
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
  featuresTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureBullet: {
    fontSize: 18,
    color: '#007AFF',
    marginRight: 10,
  },
  featureText: {
    fontSize: 16,
    color: '#555',
  },
  pricingContainer: {
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
  pricingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  plan: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  planName: {
    fontSize: 16,
    color: '#555',
  },
  planPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  subscribeButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PremiumSubscription;