import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const IncomeTracker = () => {
  const [incomes, setIncomes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [filter, setFilter] = useState("all");
  const [newIncome, setNewIncome] = useState({ name: "", amount: "", type: "Active" });
  const [isCustomIncome, setIsCustomIncome] = useState(false);
  const [customIncomeName, setCustomIncomeName] = useState("");

  const today = new Date().toLocaleDateString();
  const incomeTypeOptions = {
    Active: ["Salary", "Freelancing", "Business"],
    Passive: ["Investments", "Rental Income", "Royalties"],
  };

  const addIncome = () => {
    const incomeName = isCustomIncome ? customIncomeName : newIncome.name;
    if (!incomeName || !newIncome.amount || !newIncome.type) {
      alert("Please fill all fields");
      return;
    }
    setIncomes([...incomes, { ...newIncome, name: incomeName, id: Date.now() }]);
    resetForm();
  };

  const resetForm = () => {
    setNewIncome({ name: "", amount: "", type: "Active" });
    setCustomIncomeName("");
    setIsCustomIncome(false);
    setModalVisible(false);
  };

  const deleteIncome = (id) => setIncomes(incomes.filter((income) => income.id !== id));
  const filteredIncomes = filter === "all" ? incomes : incomes.filter((income) => income.type === filter);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Income Tracker</Text>
      <View style={styles.tabsContainer}>
        {["all", "Active", "Passive"].map((type) => (
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
        data={filteredIncomes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.cardDate}>{today}</Text>
              <Text style={styles.cardName}>{item.name}</Text>
            </View>
            <View style={styles.cardRight}>
              <Text style={styles.cardAmount}>${item.amount}</Text>
              <TouchableOpacity onPress={() => deleteIncome(item.id)}>
                <Ionicons name="trash" size={20} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No incomes found</Text>}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={40} color="#fff" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Income</Text>
            <Text style={styles.label}>Select Income Type:</Text>
            <View style={styles.typeButtonContainer}>
              {["Active", "Passive"].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[styles.typeButton, newIncome.type === type && styles.activeTypeButton]}
                  onPress={() => {
                    setNewIncome({ ...newIncome, type, name: "" });
                    setIsCustomIncome(false);
                  }}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      newIncome.type === type && styles.activeTypeButtonText,
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
                selectedValue={newIncome.name}
                onValueChange={(itemValue) => {
                  setIsCustomIncome(itemValue === "Others");
                  setNewIncome({ ...newIncome, name: itemValue });
                }}
              >
                <Picker.Item label="Select an item" value="" />
                {incomeTypeOptions[newIncome.type]?.map((item) => (
                  <Picker.Item key={item} label={item} value={item} />
                ))}
                <Picker.Item label="Others" value="Others" />
              </Picker>
            </View>
            {isCustomIncome && (
              <TextInput
                style={styles.input}
                placeholder="Enter custom income name"
                value={customIncomeName}
                onChangeText={setCustomIncomeName}
              />
            )}
            <TextInput
              style={styles.input}
              placeholder="Amount"
              keyboardType="numeric"
              value={newIncome.amount}
              onChangeText={(text) => setNewIncome({ ...newIncome, amount: text })}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancel} onPress={resetForm}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalAdd} onPress={addIncome}>
                <Text style={styles.modalAddText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8f9fa" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-between", // Adds space between tabs
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    marginHorizontal: 5, // Adds horizontal spacing between each tab
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "#e0e0e0",
  },
  
  activeTab: { backgroundColor: "#007bff" },
  tabText: { fontSize: 16 },
  activeTabText: { color: "#fff" },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  cardDate: { fontSize: 12, color: "#6c757d" },
  cardName: { fontSize: 18 },
  cardRight: { alignItems: "flex-end" },
  cardAmount: { fontSize: 18, fontWeight: "bold" },
  emptyText: { textAlign: "center", marginTop: 20, color: "#6c757d" },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#007bff",
    borderRadius: 50,
    padding: 15,
  },
  modalContainer: { flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "#fff", margin: 20, padding: 20, borderRadius: 5 },
  modalTitle: { fontSize: 20, marginBottom: 10 },
  label: { fontSize: 16, marginBottom: 5 },
  input: { borderWidth: 1, borderColor: "#ced4da", padding: 10, borderRadius: 5, marginBottom: 10 },
  modalActions: { flexDirection: "row", justifyContent: "space-between" },
  modalCancel: { padding: 10 },
  modalCancelText: { color: "#6c757d" },
  modalAdd: { padding: 10, backgroundColor: "#007bff", borderRadius: 5 },
  modalAddText: { color: "#fff" },
  typeButtonContainer: { flexDirection: "row", marginBottom: 10 },
  typeButton: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "#e9ecef",
  },
  activeTypeButton: { backgroundColor: "#007bff" },
  typeButtonText: { fontSize: 16 },
  activeTypeButtonText: { color: "#fff" },
  pickerContainer: { borderWidth: 1, borderColor: "#ced4da", borderRadius: 5 },
});

export default IncomeTracker;
