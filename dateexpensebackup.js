import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

const API_URL = "https://1fc4-2409-40f4-3010-44db-483-9915-3dd2-2826.ngrok-free.app"; // Replace with your actual ngrok URL

const formatDate = (dateString) => {
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
};

const TransactionsPage = ({ route }) => {
  const { selectedDate } = route.params;
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("All");
  const [modalVisible, setModalVisible] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    name: "",
    amount: "",
    type: "",
    subType: "",
    method: "",
    date: selectedDate,
  });

  useEffect(() => {
    fetchTransactions();
  }, [selectedDate]);

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${API_URL}/transactions`);
      const data = await response.json();
      const filteredData = data.filter((transaction) => transaction.date === selectedDate);
      setTransactions(filteredData);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const addTransaction = async () => {
    if (!newTransaction.name || !newTransaction.amount || !newTransaction.type || !newTransaction.method) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTransaction),
      });

      const result = await response.json();
      if (response.ok) {
        setTransactions([...transactions, result.transaction]);
        setNewTransaction({ name: "", amount: "", type: "", subType: "", method: "", date: selectedDate });
        setModalVisible(false);
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const deleteTransaction = async (id) => {
    Alert.alert("Delete Transaction", "Are you sure you want to delete this transaction?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: async () => {
          try {
            const response = await fetch(`${API_URL}/transactions/${id}`, { method: "DELETE" });
            if (response.ok) {
              setTransactions(transactions.filter((transaction) => transaction._id !== id));
            }
          } catch (error) {
            console.error("Error deleting transaction:", error);
          }
        },
      },
    ]);
  };

  const filteredTransactions = transactions.filter((transaction) => filter === "All" || transaction.type === filter);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Transactions <Text style={styles.dateText}> - {formatDate(selectedDate)}</Text>
      </Text>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {["All", "Income", "Investment", "Expense"].map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.filterButton, filter === type && styles.activeFilter]}
            onPress={() => setFilter(type)}
          >
            <Text style={styles.whiteText}>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Transaction List */}
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <Text style={styles.transactionName}>{item.name}</Text>
            <Text style={styles.transactionDetails}>{item.method} - {formatDate(item.date)}</Text>
            <View style={styles.transactionActions}>
              <Text
                style={
                  item.type === "Income"
                    ? styles.transactionAmountPositive
                    : item.type === "Expense"
                    ? styles.transactionAmountNegative
                    : styles.transactionAmountInvestment
                }
              >
                {item.type === "Expense" ? `-₹${item.amount}` : `₹${item.amount}`}
              </Text>
              <TouchableOpacity onPress={() => deleteTransaction(item._id)}>
                <Text style={styles.deleteButton}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Add Transaction Button */}
      <TouchableOpacity style={styles.addTransactionButton} onPress={() => setModalVisible(true)}>
        <AntDesign name="plus" size={24} color="white" />
      </TouchableOpacity>

      {/* Add Transaction Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Add Transaction</Text>

            <TextInput style={styles.input} placeholder="Transaction Name" value={newTransaction.name} onChangeText={(text) => setNewTransaction({ ...newTransaction, name: text })} />
            <TextInput style={styles.input} placeholder="Amount" keyboardType="numeric" value={newTransaction.amount} onChangeText={(text) => setNewTransaction({ ...newTransaction, amount: text })} />

            {/* Payment Method Dropdown */}
            <Picker selectedValue={newTransaction.method} onValueChange={(itemValue) => setNewTransaction({ ...newTransaction, method: itemValue })}>
              <Picker.Item label="Select Payment Method" value="" />
              <Picker.Item label="Cash" value="Cash" />
              <Picker.Item label="Credit Card" value="Credit Card" />
              <Picker.Item label="Debit Card" value="Debit Card" />
              <Picker.Item label="UPI" value="UPI" />
            </Picker>

            {/* Transaction Type Dropdown */}
            <Picker selectedValue={newTransaction.type} onValueChange={(itemValue) => setNewTransaction({ ...newTransaction, type: itemValue, subType: "" })}>
              <Picker.Item label="Select Type" value="" />
              <Picker.Item label="Income" value="Income" />
              <Picker.Item label="Investment" value="Investment" />
              <Picker.Item label="Expense" value="Expense" />
            </Picker>

            {/* SubType Dropdown */}
            {newTransaction.type === "Income" && (
              <Picker selectedValue={newTransaction.subType} onValueChange={(itemValue) => setNewTransaction({ ...newTransaction, subType: itemValue })}>
                <Picker.Item label="Active" value="Active" />
                <Picker.Item label="Passive" value="Passive" />
              </Picker>
            )}

            {newTransaction.type === "Expense" && (
              <Picker selectedValue={newTransaction.subType} onValueChange={(itemValue) => setNewTransaction({ ...newTransaction, subType: itemValue })}>
                <Picker.Item label="Discretionary" value="Discretionary" />
                <Picker.Item label="Essential" value="Essential" />
                <Picker.Item label="Mandatory" value="Mandatory" />
              </Picker>
            )}

            {/* Buttons */}
            <TouchableOpacity style={styles.addButton} onPress={addTransaction}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "normal",
    color: "#666",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: "#888",
  },
  activeFilter: {
    backgroundColor: "#007AFF",
  },
  whiteText: {
    color: "white",
    fontWeight: "bold",
  },
  transactionItem: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  transactionName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  transactionDetails: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  transactionActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  transactionAmountPositive: {
    color: "green",
    fontSize: 18,
    fontWeight: "bold",
  },
  transactionAmountNegative: {
    color: "red",
    fontSize: 18,
    fontWeight: "bold",
  },
  transactionAmountInvestment: {
    color: "#007AFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  deleteButton: {
    color: "red",
    fontSize: 16,
    fontWeight: "bold",
  },
  addTransactionButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#007AFF",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  modalHeader: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#007AFF",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TransactionsPage;
