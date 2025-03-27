const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

const logSESSchema = mongoose.Schema({
  status: { type: String, required: true },
  error: { type: String, required: true },
  email: { type: String, required: true },
  _campaign: { type: ObjectId, required: true, ref: "Campaign" },
  createdAt: { type: Number, required: true },
});
const LogSES = mongoose.model("LogSES", logSESSchema);
module.exports = LogSES;
