const mongoose = require('mongoose')
const { ObjectId } = require('mongodb')

const schema = mongoose.Schema({
    _business:      { type: ObjectId, required: true, ref: "Business" },
    name:           { type: String, maxLength: 500, required: true },
    amount:         { type: Number, required: true},
    dateStart:      { type: Number },
    dateEnd:        { type: Number },
    files:          {
        agreementUrl:         { type: String, maxLength: 500, trim: true }
    },
    status:         { type: String, enum:['Activo', 'Terminado', 'Cancelado'], required: true },
    _client:        { type: ObjectId, ref: 'Client'},
    createdAt:      { type: Number },
    lastUpdate:     { type: Number },
})

const Schema = mongoose.model("Project", schema)

module.exports = Schema