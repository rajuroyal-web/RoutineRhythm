const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const DailyData = require('./models/DailyData');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// API routes
app.get('/api/data/:date', async (req, res) => {
  try {
    const data = await DailyData.findOne({ date: req.params.date });
    res.json(data || {});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/data/:date', async (req, res) => {
  try {
    let data = await DailyData.findOne({ date: req.params.date });
    if (data) {
      data = await DailyData.findOneAndUpdate({ date: req.params.date }, req.body, { new: true });
    } else {
      data = new DailyData({ date: req.params.date, ...req.body });
      await data.save();
    }
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
