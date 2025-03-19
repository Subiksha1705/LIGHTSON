require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB Atlas
mongoose.connect("mongodb+srv://subikshapc:dVje83Q4uKgXM6RS@ligths.tncb6.mongodb.net/?retryWrites=true&w=majority&appName=Ligths")
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Transaction Schema
const TransactionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, required: true, enum: ["Income", "Investment", "Expense"] },
  subType: { type: String, required: function() { return this.type === "Expense"; } }, // Required for Expenses
  method: { type: String, required: true },
  date: { type: String, required: true },
});

const Transaction = mongoose.model("Transaction", TransactionSchema);

// ✅ API Route to Get All Transactions
app.get("/transactions", async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ API Route to Add Transaction
app.post("/transactions", async (req, res) => {
  try {
    const { name, amount, type, subType, method, date } = req.body;

    if (!name || !amount || !type || !method || !date) {
      return res.status(400).json({ error: "All fields are required." });
    }

    if (type === "Expense" && !subType) {
      return res.status(400).json({ error: "SubType is required for Expenses." });
    }

    const newTransaction = new Transaction({ name, amount, type, subType, method, date });
    await newTransaction.save();
    res.status(201).json({ message: "Transaction Added Successfully", transaction: newTransaction });
  } catch (err) {
    console.error("Error adding transaction:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ API Route to Delete Transaction
app.delete("/transactions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTransaction = await Transaction.findByIdAndDelete(id);

    if (!deletedTransaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.json({ message: "Transaction Deleted Successfully", transaction: deletedTransaction });
  } catch (err) {
    console.error("Error deleting transaction:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
