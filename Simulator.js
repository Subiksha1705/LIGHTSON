import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Simulator = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stocks Simulator</Text>
      <Text style={styles.content}>
        This is the Stocks Simulator screen. Add functionality here for simulating stock trends.
      </Text>
    </View>
  );
};

export default Simulator;

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
