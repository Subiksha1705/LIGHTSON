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
import AsyncStorage from "@react-native-async-storage/async-storage";


const API_URL = process.env.REACT_APP_API_URL;

export default function ExpenseTracker() {
  const [transactions, setTransactions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [filter, setFilter] = useState("all");
  const [newTransaction, setNewTransaction] = useState({
    name: "",
    amount: "",
    type: "Expense",
    subType: "Essential",
    method: "Cash",
    date: "",
  });
  const [isCustomExpense, setIsCustomExpense] = useState(false);
  const [customExpenseName, setCustomExpenseName] = useState("");

  const expenseTypeOptions = {
    Mandatory: ["EMI - Education", "EMI - Personal", "EMI - Property", "EMI - Vehicle", "Fees & Charges - Consultation", "Insurance - Fire", "Insurance - Health", "Insurance - Life (Term / Pension / Moneyback)", "Insurance - Property", "Insurance - Travel", "Insurance - Vehicle", "Loan Repayment", "PPF/VPF - Retirement fund", "Tax - Income", "Tax - utilities"],
    Discretionary: ["Charitable donations", "Fun / Entertainment", "Food Dining", "Gifts", "Home Décor", "Luxury clothing / Jewelery", "Sports items", "Subscriptions / dues", "Tours & travel", "Vehicle Purchase"],
    Essential: ["Child care", "Clothing", "Education", "Emergency Fund", "Fuel - Cooking", "Fuel - Vehicles", "Groceries", "Home care", "Medical Care", "Miscellaneous", "Personal grooming", "Pet care", "Rents / Mortgage", "Transportation", "Utilities - Electricity", "Utilities - Gas", "Utilities - Phone(s)", "Utilities - TV / Internet", "Utilities - Water", "Utilities Maintenance cost", "Vehicle Maintenance cost"]
  };

  // ✅ Fetch Transactions from MongoDB
  const fetchTransactions = async () => {
    try {
      const userInfo = await AsyncStorage.getItem("userInfo");
        //console.log("📦 Retrieved userInfo:", userInfo);
    
        if (!userInfo) {
          alert("User not logged in. Please log in again.");
          return;
        }
    
        const parsedInfo = JSON.parse(userInfo);
        const username = parsedInfo?.user?.username || parsedInfo?.user?.userName;

  
      const response = await fetch(`${API_URL}/transactions/${username}`);
      if (!response.ok) throw new Error("Failed to fetch transactions");
  
      const data = await response.json();
      const incomeTransactions = data.transactions.filter(
        (transaction) => transaction.type === "Expense"
      );
      setTransactions(incomeTransactions); 
    } catch (error) {
      console.error(error);
      alert("Error fetching transactions");
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // ✅ Add Transaction to MongoDB
  const addTransaction = async () => {
    try {
      const userInfo = await AsyncStorage.getItem("userInfo");
      //console.log("📦 Retrieved userInfo:", userInfo);
  
      if (!userInfo) {
        alert("User not logged in. Please log in again.");
        return;
      }
  
      const parsedInfo = JSON.parse(userInfo);
      const username = parsedInfo?.user?.username || parsedInfo?.user?.userName;

  
      const expenseName = isCustomExpense ? customExpenseName : newTransaction.name;
  
      if (!expenseName || !newTransaction.amount || !newTransaction.method || !newTransaction.date) {
        alert("Please fill all fields");
        return;
      }
  
      const transactionData = {
        name: expenseName,
        amount: parseFloat(newTransaction.amount),
        type: "Expense", // Keeping it as Expense since you only need Expenses here
        subType: newTransaction.subType,
        method: newTransaction.method,
        date: newTransaction.date,
      };
  
      const response = await fetch(`${API_URL}/transactions/${username}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transactionData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add transaction");
      }
  
      const savedTransaction = await response.json();
      setTransactions([...transactions, savedTransaction.transaction]); // ✅ Update UI
      alert("Transaction added successfully");
  
      // Reset state after adding
      setNewTransaction({ name: "", amount: "", type: "Expense", subType: "Essential", method: "Cash", date: "" });
      setCustomExpenseName("");
      setIsCustomExpense(false);
      setModalVisible(false);
    } catch (error) {
      console.error(error);
      alert("Error adding transaction");
    }
  };
  

  // ✅ Delete Transaction from MongoDB
  const deleteTransaction = async (id) => {
    try {
      const userInfo = await AsyncStorage.getItem("userInfo");
     // console.log("📦 Retrieved userInfo:", userInfo);
  
      if (!userInfo) {
        alert("User not logged in. Please log in again.");
        return;
      }
  
      const parsedInfo = JSON.parse(userInfo);
      const username = parsedInfo?.user?.username || parsedInfo?.user?.userName; // ✅ Correct key
  
      const response = await fetch(`${API_URL}/transactions/${username}/${id}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete transaction");
      }
  
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
      <Text style={styles.header}>Expense Tracker</Text>

      {/* Filter Tabs */}
      <View style={styles.tabsContainer}>
        {["all", "Mandatory", "Discretionary", "Essential"].map((type) => (
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
        keyExtractor={(item) => (item?._id ? item._id.toString() : Math.random().toString())}

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
            <Text style={styles.modalTitle}>Add Transaction</Text>

            {/* Expense Type Selection */}
            <Text style={styles.label}>Select Expense Type:</Text>
            <View style={styles.typeButtonContainer}>
              {["Mandatory", "Discretionary", "Essential"].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[styles.typeButton, newTransaction.subType === type && styles.activeTypeButton]}
                  onPress={() => {
                    setNewTransaction({ ...newTransaction, subType: type, name: "" });
                    setIsCustomExpense(false);
                  }}
                >
                  <Text style={[styles.typeButtonText, newTransaction.subType === type && styles.activeTypeButtonText]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Expense Dropdown */}
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
                placeholder="Enter custom expense name"
                value={customExpenseName}
                onChangeText={setCustomExpenseName}
              />
            )}

            <TextInput
              style={styles.input}
              placeholder="Amount"
              keyboardType="numeric"
              value={newTransaction.amount}
              onChangeText={(text) => setNewTransaction({ ...newTransaction, amount: text })}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Date (DD/MM/YYYY)"
              keyboardType="numeric"
              value={newTransaction.date}
              onChangeText={(text) => setNewTransaction({ ...newTransaction, date: text })}
            />

            {/* Modal Actions */}
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
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  modalCancel: {
    backgroundColor: "#e2e8f0",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
  },
  modalAdd: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  modalAddText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});
