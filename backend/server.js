const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = process.env.JWT_SECRET || 'CHANGE_THIS_SECRET_IN_PROD';

// --- 1. Database Connection ---
mongoose.connect('mongodb://127.0.0.1:27017/mindcare_db')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ DB Error:', err));

// --- 2. User Model ---
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});
const User = mongoose.model('User', UserSchema);

// Helper to return safe user object
function safeUser(user) {
  return { id: user._id, name: user.name, email: user.email };
}

// --- 3. Routes ---

// Signup: create user with hashed password
app.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ status: 'error', error: 'Missing fields' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ status: 'error', error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ status: 'ok', user: safeUser(user), token });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// Login: verify credentials and return token
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ status: 'error', error: 'Missing email or password' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ status: 'error', error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ status: 'error', error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ status: 'ok', user: safeUser(user), token });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// Protected route example: get current user
app.get('/me', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ status: 'error', error: 'No token' });

  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.id);
    if (!user) return res.status(404).json({ status: 'error', error: 'User not found' });
    res.json({ status: 'ok', user: safeUser(user) });
  } catch (err) {
    res.status(401).json({ status: 'error', error: 'Invalid token' });
  }
});

app.listen(3000, () => console.log('🚀 Server running on port 3000'));