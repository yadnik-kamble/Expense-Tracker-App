import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import FinancialRecord from '../models/FinancialRecord.js';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
const router = express.Router();

// --- USER PROFILE ROUTES ---

// GET User Profile (Read)
router.get('/profile', verifyToken, async (req, res) => {
  try {
    // Return user info but exclude the password
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE User Profile (Update)
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { bio, role, avatarUrl } = req.body;
    
    // Update only the fields provided
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { bio, role, avatarUrl },
      { new: true } // Return the updated document
    ).select('-password');

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/transactions', verifyToken, async (req, res) => {
  try {
    const { description, date, category, amount, type } = req.body;
    const newTransaction = new Transaction({
      userId: req.user.id,
      description,
      date, // Ensure frontend sends a proper date object or ISO string
      category,
      amount,
      type // 'income' or 'expense'
    });
    const saved = await newTransaction.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET Transactions (Sorted by newest first)
router.get('/transactions', verifyToken, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ: Get all records for the logged-in user
router.get('/records', verifyToken, async (req, res) => {
  try {
    const records = await FinancialRecord.find({ userId: req.user.id });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE: Edit a specific record
router.put('/records/:id', verifyToken, async (req, res) => {
  try {
    // Ensure the user owns the record they are trying to edit
    const record = await FinancialRecord.findOne({ _id: req.params.id, userId: req.user.id });
    
    if (!record) return res.status(404).json({ message: "Record not found or unauthorized" });

    const { date, revenue, expenses } = req.body;
    record.date = date || record.date;
    record.revenue = revenue || record.revenue;
    record.expenses = expenses || record.expenses;

    const updatedRecord = await record.save();
    res.json(updatedRecord);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: Remove a record
router.delete('/records/:id', verifyToken, async (req, res) => {
  try {
    const result = await FinancialRecord.deleteOne({ _id: req.params.id, userId: req.user.id });
    
    if (result.deletedCount === 0) return res.status(404).json({ message: "Record not found" });
    
    res.json({ message: "Record deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// DELETE Transaction
router.delete('/transactions/:id', verifyToken, async (req, res) => {
  try {
    const deleted = await Transaction.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ message: "Transaction deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// EDIT Transaction (Update)
router.put('/transactions/:id', verifyToken, async (req, res) => {
  try {
    const updated = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true } // Return the updated document
    );
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
export default router;