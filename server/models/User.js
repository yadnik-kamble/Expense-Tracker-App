import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // New Fields
  role: { type: String, default: 'Viewer' }, // e.g., Admin, Editor, Viewer
  bio: { type: String, default: '' },
  avatarUrl: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', UserSchema);