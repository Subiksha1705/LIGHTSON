import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const DateExpensesPage = ({ route }) => {
  const { selectedDate } = route.params;  // The date passed from the calendar page (in yyyy/dd/mm format)
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Convert selectedDate (yyyy/dd/mm) to dd/mm/yyyy format
    const [year, day, month] = selectedDate.split('/');
    const formattedDate = `${day}/${month}/${year}`; // Format it as dd/mm/yyyy

    // Fetch the transactions for the formatted date
    const fetchTransactions = async () => {
      try {
        // Fetch from backend using the formatted date
        const response = await fetch(`http:// 192.168.56.1/transactions/${formattedDate}`);

        const data = await response.json();
        
        // Check if the data is an array (successful response)
        if (Array.isArray(data)) {
          setTransactions(data); // Set the fetched transactions to state
        } else {
          console.error('Invalid data format:', data);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
  }, [selectedDate]); // Re-fetch when selectedDate changes

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Transactions for {selectedDate}</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <Text>Name: {item.name}</Text>
            <Text>Amount: {item.amount}</Text>
            <Text>Type: {item.type}</Text>
            <Text>Method: {item.method}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  transactionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});

export default DateExpensesPage;
