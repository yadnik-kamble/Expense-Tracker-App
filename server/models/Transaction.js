import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true }, // e.g., "Netflix", "Client Payment"
  date: { type: Date, required: true },
  category: { type: String, required: true }, // e.g., "Entertainment", "Salary"
  amount: { type: Number, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true }, // To separate Revenue vs Expense
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Transaction', TransactionSchema);