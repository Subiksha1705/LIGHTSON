import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Investment = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>This is Investment page</Text>
    </View>
  );
};

export default Investment;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F7FAFC' },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});
