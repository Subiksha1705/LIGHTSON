import React, { useState, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const API_URL = "https://bb50-2409-40f4-301f-ffe3-7d02-6711-ac9c-fb39.ngrok-free.app";

export default function ExpenseTracker() {
  const [transactions, setTransactions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [filter, setFilter] = useState("all");
  const [newTransaction, setNewTransaction] = useState({
    name: "",
    amount: "",
    type: "Income",
    subType: "Active",
    method: "Cash",
    date: "",
  });
  const [isCustomExpense, setIsCustomExpense] = useState(false);
  const [customExpenseName, setCustomExpenseName] = useState("");

  const expenseTypeOptions = {
    Active: ["Investments", "Business", "Freelancing", "Stock Trading", "Side Hustle"],
    Passive: ["Rent Income", "Dividends", "Royalties", "Interest Income", "Affiliate Marketing"],
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${API_URL}/transactions/${username}`);
      if (!response.ok) throw new Error("Failed to fetch transactions");
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error(error);
      alert("Error fetching transactions");
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const addTransaction = async () => {
    const expenseName = isCustomExpense ? customExpenseName : newTransaction.name;

    if (!expenseName || !newTransaction.amount || !newTransaction.method || !newTransaction.date) {
      alert("Please fill all fields");
      return;
    }

    const transactionData = {
      name: expenseName,
      amount: parseFloat(newTransaction.amount),
      type: "Income",
      subType: newTransaction.subType,
      method: newTransaction.method,
      date: newTransaction.date,
    };

    try {
      const response = await fetch(`${API_URL}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) throw new Error("Failed to add transaction");

      const savedTransaction = await response.json();
      setTransactions([...transactions, savedTransaction.transaction]);
      alert("Transaction added successfully");
    } catch (error) {
      console.error(error);
      alert("Error adding transaction");
    }

    setNewTransaction({ name: "", amount: "", type: "Income", subType: "Active", method: "Cash", date: "" });
    setCustomExpenseName("");
    setIsCustomExpense(false);
    setModalVisible(false);
  };

  const deleteTransaction = async (id) => {
    try {
      const response = await fetch(`${API_URL}/transactions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete transaction");

      setTransactions(transactions.filter((transaction) => transaction._id !== id));
      alert("Transaction deleted successfully");
    } catch (error) {
      console.error(error);
      alert("Error deleting transaction");
    }
  };

  const filteredTransactions =
    filter === "all"
      ? transactions
      : transactions.filter((transaction) => transaction.subType === filter);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Income Tracker</Text>

      {/* Filter Tabs */}
      <View style={styles.tabsContainer}>
        {["all", "Active", "Passive"].map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.tab, filter === type && styles.activeTab]}
            onPress={() => setFilter(type)}
          >
            <Text style={[styles.tabText, filter === type && styles.activeTabText]}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Transactions List */}
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.cardDate}>{item.date}</Text>
              <Text style={styles.cardName}>{item.name}</Text>
            </View>
            <View style={styles.cardRight}>
              <Text style={styles.cardAmount}>₹{item.amount}</Text>
              <TouchableOpacity onPress={() => deleteTransaction(item._id)}>
                <Ionicons name="trash" size={20} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No transactions found</Text>}
      />

      {/* Add Transaction Button */}
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={40} color="#fff" />
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Income</Text>

            {/* SubType Selection */}
            <Text style={styles.label}>Select SubType:</Text>
            <View style={styles.typeButtonContainer}>
              {["Active", "Passive"].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[styles.typeButton, newTransaction.subType === type && styles.activeTypeButton]}
                  onPress={() => setNewTransaction({ ...newTransaction, subType: type, name: "" })}
                >
                  <Text style={[styles.typeButtonText, newTransaction.subType === type && styles.activeTypeButtonText]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Item Selection */}
            <Text style={styles.label}>Select Item:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={newTransaction.name}
                onValueChange={(itemValue) => {
                  setIsCustomExpense(itemValue === "Others");
                  setNewTransaction({ ...newTransaction, name: itemValue });
                }}
              >
                <Picker.Item label="Select an item" value="" />
                {expenseTypeOptions[newTransaction.subType]?.map((item) => (
                  <Picker.Item key={item} label={item} value={item} />
                ))}
                <Picker.Item label="Others" value="Others" />
              </Picker>
            </View>

            {/* Custom Expense Input */}
            {isCustomExpense && (
              <TextInput
                style={styles.input}
                placeholder="Enter custom income name"
                value={customExpenseName}
                onChangeText={setCustomExpenseName}
              />
            )}

            {/* Amount and Date */}
            <Text style={styles.label}>Amount:</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Enter amount"
              value={newTransaction.amount}
              onChangeText={(text) => setNewTransaction({ ...newTransaction, amount: text })}
            />

            <Text style={styles.label}>Date (DD/MM/YYYY):</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter date (DD/MM/YYYY)"
              value={newTransaction.date}
              onChangeText={(text) => setNewTransaction({ ...newTransaction, date: text })}
            />

            {/* Add Transaction Button */}
            <TouchableOpacity style={styles.modalAdd} onPress={addTransaction}>
              <Text style={styles.modalAddText}>Add Transaction</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1e293b",
    marginBottom: 20,
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: "#e2e8f0",
  },
  activeTab: {
    backgroundColor: "#2563eb",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },
  activeTabText: {
    color: "#fff",
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  cardDate: {
    fontSize: 12,
    color: "#64748b",
  },
  cardName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
  },
  cardRight: {
    alignItems: "flex-end",
  },
  cardAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#16a34a",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#64748b",
    marginTop: 20,
  },
  addButton: {
    position: "absolute",
    bottom: 80,
    right: 20,
    backgroundColor: "#2563eb",
    width: 65,
    height: 65,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#1e293b",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 8,
    color: "#475569",
  },
  typeButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 5,
    backgroundColor: "#e2e8f0",
    alignItems: "center",
  },
  activeTypeButton: {
    backgroundColor: "#2563eb",
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1e293b",
  },
  activeTypeButtonText: {
    color: "#fff",
  },
  pickerContainer: {
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 10,
    color: "#1e293b",
  },
  modalAdd: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: "center",
    marginTop: 10,
  },
  modalAddText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});
