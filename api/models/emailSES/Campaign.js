const mongoose = require("mongoose");

const campaignSchema = mongoose.Schema({
  name: { type: String, required: true, maxLength: 320 },
  emailTitle: { type: String, required: true, maxLength: 320 },
  segmentation: [{ type: String, required: true }], //lista de correos
  emailSender: { type: String, required: true },
  count: { type: Number, required: true },
  countSuccess: { type: Number, required: true },
  createdAt: { type: Number, required: true },
  lastUpdate: { type: Number, required: false },
  isActive: { type: Boolean, default: true },
});
const Campaign = mongoose.model("Campaign", campaignSchema);
module.exports = Campaign;
