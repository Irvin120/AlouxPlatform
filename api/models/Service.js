const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

const schema = mongoose.Schema({
  concept: { type: String, maxLength: 500, trim: true },
  amount: { type: Number, required: true },
  membershipType: { type: String, enum: ["Anual", "Mensual"], required: true },
  satCode: {
    key: { type: Number, required: true },
    description: { type: String, required: true },
  },
  satUnit: {
    key: { type: String, required: true },
    description: { type: String, required: true },
  },
  dateStart: { type: Number, required: true },
  dateNextPayment: { type: Number, required: false },
  cutoffDate: { type: Number, required: true },
  files: {
    agreementUrl: { type: String, maxLength: 500, trim: true },
  },
  status: {
    type: String,
    enum: ["Activo", "Suspendido", "Terminado"],
    required: true,
  },
  _client: { type: ObjectId, ref: "Client" },
  createdAt: { type: Number },
  lastUpdate: { type: Number },
});

const Schema = mongoose.model("Service", schema);

module.exports = Schema;
