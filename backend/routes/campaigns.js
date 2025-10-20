// backend/routes/campaigns.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Campaign = require('../models/Campaign');
const User = require('../models/User');

// @route   POST api/campaigns/create
router.post('/create', auth, async (req, res) => {
  const { title, description, goal } = req.body;
  try {
    const user = await User.findById(req.user.id).select('-password');
    const newCampaign = new Campaign({
      title,
      description,
      goal,
      creator: user.name,
    });
    const campaign = await newCampaign.save();
    res.json(campaign);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/campaigns
router.get('/', async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ date: -1 });
    res.json(campaigns);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/campaigns/mycampaigns
router.get('/mycampaigns', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const campaigns = await Campaign.find({ creator: user.name }).sort({ date: -1 });
    res.json(campaigns);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/campaigns/:id
router.get('/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ msg: 'Campaign not found' });
    }
    res.json(campaign);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- UPDATED INVESTMENT ROUTE ---
// @route   PUT api/campaigns/invest/:id
// @desc    Invest a custom amount in a campaign
router.put('/invest/:id', auth, async (req, res) => {
  const { amount } = req.body;
  const investmentAmount = parseInt(amount, 10);

  if (!investmentAmount || investmentAmount <= 0) {
    return res.status(400).json({ msg: 'Please enter a valid amount' });
  }

  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ msg: 'Campaign not found' });
    }

    const user = await User.findById(req.user.id);

    const newInvestor = {
      investorName: user.name,
      amount: investmentAmount,
    };

    campaign.investors.unshift(newInvestor);
    campaign.amountRaised += investmentAmount;
    
    await campaign.save();
    res.json(campaign);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/campaigns/:id
// @desc    Update a campaign
router.put('/:id', auth, async (req, res) => {
  const { title, description, goal } = req.body;
  try {
    let campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ msg: 'Campaign not found' });
    }
    const user = await User.findById(req.user.id);
    if (campaign.creator.toString() !== user.name) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    if (title) campaign.title = title;
    if (description) campaign.description = description;
    if (goal) campaign.goal = goal;
    await campaign.save();
    res.json(campaign);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/campaigns/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ msg: 'Campaign not found' });
    }
    const user = await User.findById(req.user.id);
    if (campaign.creator.toString() !== user.name) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    await campaign.deleteOne();
    res.json({ msg: 'Campaign removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;