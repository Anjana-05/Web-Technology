const Visitor = require('../models/Visitor');
const GateEntry = require('../models/GateEntry');
const GateEntry = require('../models/GateEntry');
const Visitor = require('../models/Visitor');

// Check in visitor
exports.checkInVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.create(req.body);
    await GateEntry.create({ visitor: visitor._id });
    
    res.status(201).json({
      status: 'success',
      data: visitor
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};


exports.checkOutVisitor = async (req, res) => {
  try {
    const visitorId = req.params.id;
    const { checkOutTime } = req.body;

    // Update visitor status
    const visitor = await Visitor.findByIdAndUpdate(
      visitorId,
      { status: 'Checked-Out' },
      { new: true }
    );

    if (!visitor) {
      return res.status(404).json({ message: 'Visitor not found' });
    }

    // Update gate entry
    const gateEntry = await GateEntry.findOneAndUpdate(
      { visitor: visitorId, checkOutTime: null },
      { checkOutTime: checkOutTime || Date.now() },
      { new: true }
    );

    res.json(visitor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get all visitors (with optional filtering)
exports.getAllVisitors = async (req, res) => {
  try {
    // Basic filtering
    const query = {};
    if (req.query.status) query.status = req.query.status;
    if (req.query.purpose) query.purpose = req.query.purpose;
    
    const visitors = await Visitor.find(query)
      .sort({ checkInTime: -1 })
      .lean(); // Convert to plain JS objects

    // Add gate entry info using $lookup
    const visitorsWithEntries = await Visitor.aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'gateentries',
          localField: '_id',
          foreignField: 'visitor',
          as: 'gateEntry'
        }
      },
      { $unwind: '$gateEntry' },
      {
        $project: {
          name: 1,
          email: 1,
          contactNumber: 1,
          purpose: 1,
          checkInTime: 1,
          checkOutTime: 1,
          status: 1,
          duration: {
            $cond: {
              if: { $ne: ['$checkOutTime', null] },
              then: {
                $divide: [
                  { $subtract: ['$checkOutTime', '$checkInTime'] },
                  60000 // Convert ms to minutes
                ]
              },
              else: null
            }
          },
          comments: '$gateEntry.comments'
        }
      },
      { $sort: { checkInTime: -1 } }
    ]);

    res.json({
      status: 'success',
      results: visitorsWithEntries.length,
      data: visitorsWithEntries
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// Get visitor statistics for dashboard
exports.getVisitorStats = async (req, res) => {
  try {
    const stats = await Visitor.aggregate([
      {
        $facet: {
          totalToday: [
            {
              $match: {
                checkInTime: {
                  $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                  $lt: new Date(new Date().setHours(23, 59, 59, 999))
                }
              }
            },
            { $count: 'count' }
          ],
          checkedIn: [
            { $match: { status: 'checked-in' } },
            { $count: 'count' }
          ],
          checkedOut: [
            { $match: { status: 'checked-out' } },
            { $count: 'count' }
          ]
        }
      },
      {
        $project: {
          totalToday: { $arrayElemAt: ['$totalToday.count', 0] },
          checkedIn: { $arrayElemAt: ['$checkedIn.count', 0] },
          checkedOut: { $arrayElemAt: ['$checkedOut.count', 0] }
        }
      }
    ]);

    res.json({
      status: 'success',
      data: stats[0] || { totalToday: 0, checkedIn: 0, checkedOut: 0 }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// Delete visitor
exports.deleteVisitor = async (req, res) => {
  try {
    await Visitor.findByIdAndDelete(req.params.id);
    await GateEntry.deleteMany({ visitor: req.params.id });
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};