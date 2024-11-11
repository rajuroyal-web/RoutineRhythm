const express = require('express');
const router = express.Router();
const DailyData = require('../models/DailyData');

// Get data for a specific date
router.get('/data/:date', async (req, res) => {
  try {
    const data = await DailyData.findOne({ date: req.params.date });
    res.json(data || {});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Save or update data for a specific date
router.post('/data/:date', async (req, res) => {
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

// Get global note
router.get('/note', async (req, res) => {
  try {
    const note = await DailyData.findOne({ date: 'global' });
    res.json(note ? note.notes : '');
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Save or update global note
router.post('/note', async (req, res) => {
  try {
    let note = await DailyData.findOne({ date: 'global' });
    if (note) {
      note = await DailyData.findOneAndUpdate({ date: 'global' }, { notes: req.body.note }, { new: true });
    } else {
      note = new DailyData({ date: 'global', notes: req.body.note });
      await note.save();
    }
    res.json(note.notes);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;