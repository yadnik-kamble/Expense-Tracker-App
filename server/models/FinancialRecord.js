import mongoose from 'mongoose';

const FinancialRecordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // E.g., "Mon", "2023-10-27"
  revenue: { type: Number, required: true },
  expenses: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('FinancialRecord', FinancialRecordSchema);