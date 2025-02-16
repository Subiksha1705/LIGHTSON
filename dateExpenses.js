import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

const API_URL = "http://localhost:5000/transactions";

const TransactionsPage = ({ route }) => {
  const { selectedDate } = route.params;
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("All");
  const [modalVisible, setModalVisible] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    name: "",
    amount: "",
    type: "Income",
    method: "",
    date: selectedDate,
  });

  useEffect(() => {
    fetchTransactions();
  }, [selectedDate]);

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${API_URL}/${selectedDate}`);
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const addTransaction = async () => {
    if (!newTransaction.name || !newTransaction.amount || !newTransaction.method) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTransaction),
      });

      if (response.ok) {
        const savedTransaction = await response.json();
        setTransactions([...transactions, savedTransaction]);
        setNewTransaction({ name: "", amount: "", type: "Income", method: "", date: selectedDate });
        setModalVisible(false);
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      setTransactions(transactions.filter((transaction) => transaction._id !== id));
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const filteredTransactions = transactions.filter(
    (transaction) => filter === "All" || transaction.type === filter
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transactions</Text>
      <Text style={styles.date}>{selectedDate}</Text>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {["All", "Income", "Investment", "Expense"].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.filterButton,
              { backgroundColor: filter === type ? "#007BFF" : "#E0E0E0" },
            ]}
            onPress={() => setFilter(type)}
          >
            <Text style={styles.filterText}>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Transaction List */}
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <View>
              <Text style={styles.transactionName}>{item.name}</Text>
              <Text style={styles.transactionDetails}>{item.method} • {item.date}</Text>
            </View>
            <View style={styles.rightContainer}>
              <Text
                style={[
                  styles.transactionAmount,
                  { color: item.type === "Expense" ? "red" : "green" },
                ]}
              >
                {item.type === "Expense" ? `-₹${item.amount}` : `+₹${item.amount}`}
              </Text>
              <TouchableOpacity onPress={() => deleteTransaction(item._id)}>
                <AntDesign name="delete" size={20} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Add Transaction Button */}
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <AntDesign name="plus" size={28} color="white" />
      </TouchableOpacity>

      {/* Add Transaction Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add Transaction</Text>
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
              onChangeText={(text) => setNewTransaction({ ...newTransaction, amount: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Payment Method"
              value={newTransaction.method}
              onChangeText={(text) => setNewTransaction({ ...newTransaction, method: text })}
            />

            {/* Transaction Type Buttons */}
            <View style={styles.typeContainer}>
              {["Income", "Investment", "Expense"].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    { backgroundColor: newTransaction.type === type ? "#007BFF" : "#E0E0E0" },
                  ]}
                  onPress={() => setNewTransaction({ ...newTransaction, type })}
                >
                  <Text style={styles.typeText}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.confirmButton} onPress={addTransaction}>
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F8F9FA" },
  title: { fontSize: 22, fontWeight: "bold", color: "#007BFF" },
  date: { fontSize: 16, color: "#6C757D", marginBottom: 10 },
  filterContainer: { flexDirection: "row", justifyContent: "space-around", marginBottom: 10 },
  filterButton: { padding: 10, borderRadius: 20 },
  filterText: { fontSize: 16 },
  transactionItem: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#FFF", padding: 15, borderRadius: 8, marginBottom: 8 },
  transactionName: { fontSize: 18, fontWeight: "bold" },
  transactionDetails: { fontSize: 14, color: "#6C757D" },
  transactionAmount: { fontSize: 16 },
  addButton: { position: "absolute", bottom: 30, right: 20, backgroundColor: "#007BFF", padding: 15, borderRadius: 50 },
  modalBackground: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContainer: { backgroundColor: "#FFF", padding: 20, borderRadius: 10, width: "90%" },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#CCC", borderRadius: 5, padding: 10, marginBottom: 10 },
  typeContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  typeButton: { padding: 10, borderRadius: 20 },
  typeText: { fontSize: 16 },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
});

export default TransactionsPage;
