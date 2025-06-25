import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

const API_URL = process.env.REACT_APP_API_URL;

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
      const userInfo = await AsyncStorage.getItem("userInfo");
      console.log("📦 Retrieved userInfo:", userInfo);
  
      if (!userInfo) {
        alert("User not logged in. Please log in again.");
        return;
      }
  
      const parsedInfo = JSON.parse(userInfo);
      const username = parsedInfo?.user?.username || parsedInfo?.user?.userName;

  
      if (!username) {
        alert("Username not found. Please log in again.");
        return;
      }
  
      console.log("✅ Username:", username);
  
      const response = await fetch(`${API_URL}/transactions/${username}`);
      const data = await response.json();
  
      console.log("Fetched Transactions Data:", data);
  
      if (!response.ok) {
        alert(data.error || "Error fetching transactions.");
        return;
      }
  
      if (data.transactions && Array.isArray(data.transactions)) {
        const filteredData = data.transactions.filter(
          (transaction) => transaction.date === selectedDate
        );
        setTransactions(filteredData);
      } else {
        console.error("❌ Invalid data format received:", data);
        setTransactions([]);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };
  
  // Add Transaction
const addTransaction = async () => {
  if (
    !newTransaction.name ||
    !newTransaction.amount ||
    !newTransaction.type ||
    !newTransaction.method
  ) {
    alert("Please fill out all fields.");
    return;
  }

  try {
    const userInfo = await AsyncStorage.getItem("userInfo");
    if (!userInfo) {
      alert("User not logged in. Please log in again.");
      return;
    }
    const parsedInfo = JSON.parse(userInfo);
    const username = parsedInfo?.user?.username || parsedInfo?.user?.userName;

    const response = await fetch(`${API_URL}/transactions/${username}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTransaction),
    });

    const result = await response.json();

    // Debugging: Check response from API
    console.log("Add Transaction Response:", result);

    if (response.ok) {
      // Refresh transactions after adding
      fetchTransactions();
      setNewTransaction({
        name: "",
        amount: "",
        type: "",
        subType: "",
        method: "",
        date: selectedDate,
      });
      setModalVisible(false);
    } else {
      alert(result.error || "Error adding transaction.");
    }
  } catch (error) {
    console.error("Error adding transaction:", error);
    alert("Error adding transaction. Please try again.");
  }
};


  // Delete Transaction
  const deleteTransaction = async (id) => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const userInfo = await AsyncStorage.getItem("userInfo");
              if (!userInfo) {
                alert("User not logged in. Please log in again.");
                return;
              }
  
              const parsedInfo = JSON.parse(userInfo);
              const username = parsedInfo?.user?.username || parsedInfo?.user?.userName;

  
              if (!username) {
                alert("Username not found. Please log in again.");
                return;
              }
  
              const url = `${API_URL}/transactions/${username}/${id}`;
              console.log(`🔗 DELETE URL: ${url}`);
  
              const response = await fetch(url, {
                method: "DELETE",
              });
  
              const result = await response.json();
              console.log("📝 Delete response:", result);
  
              if (response.ok && result.success) {
                setTransactions(transactions.filter((transaction) => transaction._id !== id));
                alert("Transaction deleted successfully.");
              } else {
                alert(result.error || "Error deleting transaction.");
              }
            } catch (error) {
              console.error("❌ Error deleting transaction:", error);
              alert("An error occurred while deleting the transaction.");
            }
          },
        },
      ]
    );
  };
  
  
  // Filter Transactions
  const filteredTransactions = transactions.filter(
    (transaction) => filter === "All" || transaction.type === filter
  );

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
        keyExtractor={(item, index) => (item && item._id ? item._id : index.toString())}
        renderItem={({ item }) => (
          item ? (
            <View style={styles.transactionItem}>
              <Text style={styles.transactionName}>{item.name}</Text>
              <Text style={styles.transactionDetails}>
                {item.method} - {formatDate(item.date)}
              </Text>
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
          ) : null
        )}
      />

      {/* Add Transaction Button */}
      <TouchableOpacity
        style={styles.addTransactionButton}
        onPress={() => setModalVisible(true)}
      >
        <AntDesign name="plus" size={24} color="white" />
      </TouchableOpacity>

      {/* Add Transaction Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Add Transaction</Text>

            <TextInput
              style={styles.input}
              placeholder="Transaction Name"
              value={newTransaction.name}
              onChangeText={(text) => setNewTransaction({ ...newTransaction, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Amount"
              keyboardType="numeric"
              value={newTransaction.amount}
              onChangeText={(text) =>
                setNewTransaction({ ...newTransaction, amount: text })
              }
            />

            {/* Payment Method Dropdown */}
            <Picker
              selectedValue={newTransaction.method}
              onValueChange={(itemValue) =>
                setNewTransaction({ ...newTransaction, method: itemValue })
              }
            >
              <Picker.Item label="Select Payment Method" value="" />
              <Picker.Item label="Cash" value="Cash" />
              <Picker.Item label="Credit Card" value="Credit Card" />
              <Picker.Item label="Debit Card" value="Debit Card" />
              <Picker.Item label="UPI" value="UPI" />
            </Picker>

            {/* Transaction Type Dropdown */}
            <Picker
              selectedValue={newTransaction.type}
              onValueChange={(itemValue) =>
                setNewTransaction({
                  ...newTransaction,
                  type: itemValue,
                  subType: "",
                })
              }
            >
              <Picker.Item label="Select Type" value="" />
              <Picker.Item label="Income" value="Income" />
              <Picker.Item label="Investment" value="Investment" />
              <Picker.Item label="Expense" value="Expense" />
            </Picker>

            {/* SubType Dropdown */}
            {newTransaction.type === "Income" && (
              <Picker
                selectedValue={newTransaction.subType}
                onValueChange={(itemValue) =>
                  setNewTransaction({ ...newTransaction, subType: itemValue })
                }
              >
                <Picker.Item label="Active" value="Active" />
                <Picker.Item label="Passive" value="Passive" />
              </Picker>
            )}

            {newTransaction.type === "Expense" && (
              <Picker
                selectedValue={newTransaction.subType}
                onValueChange={(itemValue) =>
                  setNewTransaction({ ...newTransaction, subType: itemValue })
                }
              >
                <Picker.Item label="Discretionary" value="Discretionary" />
                <Picker.Item label="Essential" value="Essential" />
                <Picker.Item label="Mandatory" value="Mandatory" />
              </Picker>
            )}

            {/* Buttons */}
            <TouchableOpacity style={styles.addButton} onPress={addTransaction}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  header: { fontSize: 22, fontWeight: "bold", margin: 10 },
  dateText: { fontSize: 18, color: "#555" },
  filterContainer: { flexDirection: "row", justifyContent: "space-around", margin: 10 },
  filterButton: { padding: 10, backgroundColor: "#6c757d", borderRadius: 8 },
  activeFilter: { backgroundColor: "#4caf50" },
  whiteText: { color: "white", fontWeight: "bold" },
  transactionItem: { backgroundColor: "white", padding: 15, marginVertical: 5, borderRadius: 8 },
  transactionName: { fontSize: 16, fontWeight: "bold" },
  transactionDetails: { fontSize: 12, color: "#6c757d" },
  transactionActions: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  transactionAmountPositive: { color: "green", fontWeight: "bold" },
  transactionAmountNegative: { color: "red", fontWeight: "bold" },
  transactionAmountInvestment: { color: "blue", fontWeight: "bold" },
  deleteButton: { color: "red", fontWeight: "bold" },
  addTransactionButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 50,
    elevation: 5,
  },
  modalContainer: { flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "white", padding: 20, borderRadius: 10, margin: 20 },
  modalHeader: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginVertical: 5, borderRadius: 8 },
  addButton: { backgroundColor: "#28a745", padding: 12, borderRadius: 8, marginTop: 10 },
  addButtonText: { color: "white", textAlign: "center", fontWeight: "bold" },
  cancelButton: { backgroundColor: "#dc3545", padding: 12, borderRadius: 8, marginTop: 10 },
  cancelButtonText: { color: "white", textAlign: "center", fontWeight: "bold" },
});

export default TransactionsPage;
