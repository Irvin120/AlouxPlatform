const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

const contactSchema = mongoose.Schema({
  name: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  phone: { type: String, required: false, trim: true, maxLength: 13 },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  address: {
    locality: { type: String, required: false, trim: true, maxLength: 30 },
    state: { type: String, required: false, trim: true, maxLength: 50 },
    street: { type: String, required: false, trim: true, maxLength: 50 },
    outNumber: { type: Number, required: false },
  },
  _client: { type: ObjectId, ref: "Client" },
  createdAt: { type: Number },
  lastUpdate: { type: Number },
});

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
