const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

const invoiceSchema = mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["Normal", "Por definir", "Complemento", "Cancelación"],
    trim: true,
  },
  xmlUrl: { type: String, required: false, maxLength: 500, trim: true },
  pdfUrl: { type: String, required: false, maxLength: 500, trim: true },
  uuid: { type: String, required: false, maxLength: 100, trim: true },
  folio: { type: Number, required: true },
  _customer: { type: ObjectId, ref: "Client" },
  _invoice: { type: ObjectId }, //contains the id of facturapi
  _mainInvoice: { type: ObjectId, default: null },
  _payment: { type: ObjectId, required: false, ref: "Payment" },
  _complement: { type: ObjectId, required: false, ref: "Complement" },
  xmlCancelUrl: { type: String, required: false, maxLength: 500, trim: true },
  pdfCancelUrl: { type: String, required: false, maxLength: 500, trim: true },
  paymentMethod: { type: String, required: false, enum: ["PUE", "PPD", "NA"] },
  paymentMethodObj: { type: Object, required: false },
  payment_form: {
    type: String,
    required: false,
    enum: [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "08",
      "12",
      "13",
      "14",
      "15",
      "17",
      "23",
      "24",
      "25",
      "26",
      "27",
      "28",
      "29",
      "30",
      "31",
      "99",
    ],
  },
  payment_formObj: { type: Object, required: false },
  amount: { type: Number, required: true },
  customerFacturapi: { type: Object, required: true },
  liveMode: { type: Boolean, required: false, default: true },
  createdAt: { type: Number, required: true },
  lastUpdate: { type: Number, required: false },
  isActive: { type: Boolean, default: true },
});

const Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice;
