const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const complementSchema = mongoose.Schema({
  status: {
    type: String,
    enum: ["Cancelado", "Facturado"],
    default: "Facturado",
  },
  amount: { type: Number, required: true },
  installment: { type: Number, required: true }, //Parcialidad
  last_balance: { type: Number, required: true }, //Cantidad que estaba pendiente por pagar antes de recibir este pago.
  createdAt: { type: Number, required: true },
  lastUpdate: { type: Number, required: false },
  isActive: { type: Boolean, default: true },
});

const Complement = mongoose.model("Complement", complementSchema);
module.exports = Complement;
