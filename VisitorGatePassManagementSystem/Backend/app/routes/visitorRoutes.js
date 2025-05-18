const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Visitor = require('../models/Visitor');

// GET /api/visitors
router.get('/', async (req, res) => {
  try {
    const visitors = await Visitor.find();
    res.json(visitors);
  } catch (err) {
    console.error('Error fetching visitors:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/visitors/checkin
router.post("/checkIn", async (req, res) => {
  const { name, email, contactNumber, purpose } = req.body;

  if (!name || !email || !contactNumber || !purpose) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const visitor = new Visitor(req.body);
    await visitor.save();
    res.status(201).json(visitor);
  } catch (error) {
    res.status(500).json({ error: "Error saving visitor data" });
  }
});

router.get('/search', async (req, res) => {
  try {
    const visitorId = req.query.q;
    if (!mongoose.Types.ObjectId.isValid(visitorId)) {
      return res.status(400).json({ error: 'Invalid visitor ID' });
    }

    const visitor = await Visitor.findById(visitorId);

    if (!visitor) {
      return res.status(404).json({ error: 'Visitor not found' });
    }

    res.json(visitor);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/checkout', async (req, res) => {
  console.log('Checkout request body:', req.body); // 🔍 DEBUG LOG

  const { visitorId } = req.body;
  if (!visitorId) return res.status(400).json({ message: 'Visitor ID required' });

  try {
    const visitor = await Visitor.findById(visitorId);
    if (!visitor) return res.status(404).json({ message: 'Visitor not found' });

    if (visitor.checkOutTime)
      return res.status(400).json({ message: 'Visitor already checked out' });

    visitor.checkOutTime = new Date();
    visitor.status = 'checked-out';
    await visitor.save();

    return res.json({ message: 'Checked out successfully', visitor });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/:id', async (req, res) => {
  console.log('DELETE request received for ID:', req.params.id); 

  try {
    const result = await Visitor.findByIdAndDelete(req.params.id);
    if (!result) {
      console.log('No visitor found for ID:', req.params.id);
      return res.status(404).json({ message: 'Visitor not found' });
    }
    console.log('Visitor deleted:', result);
    res.json({ message: 'Visitor deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
