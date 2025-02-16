const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // If using environment variables

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/transactionsDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Transaction Schema
const transactionSchema = new mongoose.Schema({
  name: String,
  amount: Number,
  type: String, // Expense or Income
  method: String, // Payment method (Cash, Card, UPI, etc.)
  date: String,   // Format: YYYY-MM-DD
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// Create a new transaction
app.post('/transactions', async (req, res) => {
  try {
    const newTransaction = new Transaction(req.body);
    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    console.error('Error saving transaction:', error);
    res.status(500).json({ error: 'Failed to save transaction' });
  }
});

// Get transactions by date
app.get('/transactions/:date', async (req, res) => {
  try {
    const transactions = await Transaction.find({ date: req.params.date });
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Delete a transaction
app.delete('/transactions/:id', async (req, res) => {
  try {
    const deletedTransaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!deletedTransaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
