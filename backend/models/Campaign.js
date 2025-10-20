// backend/models/Campaign.js
const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
  creator: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  goal: { type: Number, required: true },
  amountRaised: { type: Number, default: 0 },
  
  // --- NEW FIELD ---
  // This array will store an object for each investment.
  investors: [
    {
      investorName: { type: String, required: true },
      amount: { type: Number, required: true },
      date: { type: Date, default: Date.now }
    }
  ],

  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('campaign', CampaignSchema);