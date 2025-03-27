const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

const paymentSchema = mongoose.Schema({
  concept: { type: String, maxLength: 500, required: true, trim: true },
  satProduct: { type: Object },
  satPaymentMethod: { type: Object },
  satUnit: {
    key: { type: String, required: true },
    description: { type: String, required: true },
  },
  amount: { type: Number, required: true },
  dateLimit: { type: Number, required: true },
  datePay: { type: Number, required: false },
  status: { type: String, enum: ["Por pagar", "Pagado"], default: "Por pagar" },
  type: { type: String, enum: ["Proyecto", "Servicio"], required: true },
  _project: { type: ObjectId, ref: "Project" },
  _service: { type: ObjectId, ref: "Service" },
  _client: { type: ObjectId, ref: "Client" },
  invoiceStatus: {
    type: String,
    enum: ["No facturado", "Facturado", "Cancelada"],
    default: "No facturado",
  },
  invoiceID: { type: ObjectId },
  invoiceUrl: { type: String, maxLength: 500, required: false, trim: true },

  createdAt: { type: Number, required: true },
  lastUpdate: { type: Number, required: false },
  isActive: { type: Boolean, default: true },
});

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
