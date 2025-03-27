const mongoose = require("mongoose");

const clientSchema = mongoose.Schema({
  name: { type: String, maxLength: 50, trim: true, required: true },
  description: { type: String, maxLength: 150, trim: true },
  taxInfo: {
    rfc: { type: String, maxLength: 13, trim: true },
    name: { type: String, maxLength: 500, trim: true },
    regime: { type: Object },
    CFDIuse: { type: Object },
    zip: { type: String, maxLength: 5, trim: true },
    status: {
      type: String,
      enum: ["Por validar", "Valido", "Invalido"],
      required: true,
      default: "Por validar",
    },
  },
  files: {
    imgUrl: { type: String, maxLength: 500, trim: true },
    llcUrl: { type: String, maxLength: 500, trim: true },
    satUrl: { type: String, maxLength: 500, trim: true },
    ineFrontUrl: { type: String, maxLength: 500, trim: true },
    ineUrl: { type: String, maxLength: 500, trim: true },
  },
  createdAt: { type: Number, required: true },
  lastUpdate: { type: Number },
  status: {
    type: String,
    enum: ["Activo", "Inactivo"],
    required: true,
    default: "Activo",
  },
});

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;
