const { Double } = require('mongodb');
const mongoose = require('mongoose')

const ApiSchema = mongoose.Schema({
    name:       { type: String, enum : ['sms', 'email'], required: true },
    price:      { type: Number, required: true },
    api:        { type: String, required: true },

    createdAt:  { type: Number, required: true },
    lastUpdate: { type: Number, required: true },
    isActive:   { type: Boolean, default: true }
})

const Api = mongoose.model("Api", ApiSchema);

module.exports = Api