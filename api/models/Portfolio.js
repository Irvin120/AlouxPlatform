const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

const schema = mongoose.Schema({
  title: { type: String, maxLength: 200, required: true },
  descrption: { type: String, maxLength: 2000, required: true },
  clientName: { type: String, maxLength: 200, required: true },
  clientImg: { type: String, maxLength: 500, required: true },
  url: { type: String, maxLength: 500, required: true },
  projectImg: [{ type: String, maxLength: 500, required: false }],
  review: { type: String, required: true },
  services: [{ type: ObjectId, ref: "Service" }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Number },
  lastUpdate: { type: Number },
});

const Schema = mongoose.model("Portfolio", schema);

module.exports = Schema;
