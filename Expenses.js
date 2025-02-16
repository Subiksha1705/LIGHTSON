import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";

const styles = {
  container: { flex: 1, backgroundColor: "#f4f4f4" },
  header: { fontSize: 24, fontWeight: "bold", margin: 20, textAlign: "center" },
  tabsContainer: { flexDirection: "row", justifyContent: "space-around", margin: 10 },
  tab: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20 },
  activeTab: { backgroundColor: "#007bff" },
  tabText: { color: "#000", fontSize: 16 },
  activeTabText: { color: "#fff" },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardDate: { fontSize: 12, color: "#aaa" },
  cardName: { fontSize: 16, fontWeight: "bold" },
  cardRight: { alignItems: "flex-end" },
  cardAmount: { fontSize: 16, color: "#007bff", marginBottom: 5 },
  emptyText: { textAlign: "center", marginTop: 20, fontSize: 16, color: "#aaa" },
  addButton: {
    position: "absolute",
    bottom: 80,
    right: 20,
    backgroundColor: "#007bff",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 10, marginBottom: 15 },
  typeButtonContainer: { flexDirection: "row", justifyContent: "space-around", marginBottom: 20 },
  typeButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20 },
  typeButtonText: { color: "#000", fontSize: 16 },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  label: { fontSize: 14, marginBottom: 5, color: "#333" },
  modalActions: { flexDirection: "row", justifyContent: "space-between" },
  modalCancel: { backgroundColor: "#eaeaea", padding: 10, borderRadius: 10, flex: 1, marginRight: 10 },
  modalCancelText: { textAlign: "center", color: "#000" },
  modalAdd: { backgroundColor: "#007bff", padding: 10, borderRadius: 10, flex: 1 },
  modalAddText: { textAlign: "center", color: "#fff" },
};

const typeColors = {
  Mandatory: "#3357FF", // Red-orange
  Discretionary: "#3357FF", // Green
  Essential: "#3357FF", // Blue
};

export default function ExpenseTracker() {
  const [transactions, setTransactions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [filter, setFilter] = useState("all");
  const [newTransaction, setNewTransaction] = useState({ name: "", amount: "", type: "Essential" });
  const [isCustomExpense, setIsCustomExpense] = useState(false);
  const [customExpenseName, setCustomExpenseName] = useState("");

  const today = new Date().toLocaleDateString();

  const expenseTypeOptions = {
    Mandatory: ["Rent", "Utilities", "Insurance"],
    Discretionary: ["Entertainment", "Dining", "Shopping"],
    Essential: ["Groceries", "Transport", "Healthcare"],
  };

  const addTransaction = () => {
    const expenseName = isCustomExpense ? customExpenseName : newTransaction.name;
    if (!expenseName || !newTransaction.amount || !newTransaction.type) {
      alert("Please fill all fields");
      return;
    }
    setTransactions([
      ...transactions,
      { ...newTransaction, name: expenseName, id: Date.now() },
    ]);
    setNewTransaction({ name: "", amount: "", type: "Essential" });
    setCustomExpenseName("");
    setIsCustomExpense(false);
    setModalVisible(false);
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter((transaction) => transaction.id !== id));
  };

  const filteredTransactions =
    filter === "all"
      ? transactions
      : transactions.filter((transaction) => transaction.type === filter);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Expense Tracker</Text>
      <View style={styles.tabsContainer}>
        {["all", "Mandatory", "Discretionary", "Essential"].map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.tab, filter === type && styles.activeTab]}
            onPress={() => setFilter(type)}
          >
            <Text style={[styles.tabText, filter === type && styles.activeTabText]}>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.cardDate}>{today}</Text>
              <Text style={styles.cardName}>{item.name}</Text>
            </View>
            <View style={styles.cardRight}>
              <Text style={styles.cardAmount}>${item.amount}</Text>
              <TouchableOpacity onPress={() => deleteTransaction(item.id)}>
                <Ionicons name="trash" size={20} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No transactions found</Text>}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={40} color="#fff" />
      </TouchableOpacity>
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Transaction</Text>
            <Text style={styles.label}>Select Expense Type:</Text>
            <View style={styles.typeButtonContainer}>
              {["Mandatory", "Discretionary", "Essential"].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    { backgroundColor: newTransaction.type === type ? typeColors[type] : "#eaeaea" },
                  ]}
                  onPress={() => {
                    setNewTransaction({ ...newTransaction, type, name: "" });
                    setIsCustomExpense(false);
                  }}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      { color: newTransaction.type === type ? "#fff" : "#000" },
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.label}>Select Item:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={newTransaction.name}
                onValueChange={(itemValue) => {
                  setIsCustomExpense(itemValue === "Others");
                  setNewTransaction({ ...newTransaction, name: itemValue });
                }}
              >
                <Picker.Item label="Select" value="" />
                {expenseTypeOptions[newTransaction.type]?.map((option) => (
                  <Picker.Item key={option} label={option} value={option} />
                ))}
                <Picker.Item label="Others" value="Others" />
              </Picker>
            </View>
            {isCustomExpense && (
              <TextInput
                style={styles.input}
                placeholder="Custom expense name"
                value={customExpenseName}
                onChangeText={setCustomExpenseName}
              />
            )}
            <Text style={styles.label}>Amount:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter amount"
              keyboardType="numeric"
              value={newTransaction.amount}
              onChangeText={(text) =>
                setNewTransaction({ ...newTransaction, amount: text })
              }
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalAdd} onPress={addTransaction}>
                <Text style={styles.modalAddText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
