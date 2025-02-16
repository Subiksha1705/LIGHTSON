import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FireNumber = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fire Number</Text>
      <Text style={styles.content}>
        This is the Fire Number screen. Customize this page with the content you need.
      </Text>
    </View>
  );
};

export default FireNumber;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  content: {
    fontSize: 16,
    color: '#4A4A4A',
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
