const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

const NotificationSchema = mongoose.Schema({
  seen: { type: Boolean, default: false },
  title: { type: String, maxLength: 1000 },
  text: { type: String, maxLength: 1000 },
  _payment: { type: ObjectId, required: true, ref: "Payment" },
  _client: { type: ObjectId, ref: "Client" },
  createdAt: { type: Number, required: true },
  lastUpdate: { type: Number, required: false },
});

const Notification = mongoose.model("Notification", NotificationSchema);
module.exports = Notification;
