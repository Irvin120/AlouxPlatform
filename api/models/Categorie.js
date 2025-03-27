const mongoose = require('mongoose')
const { ObjectId } = require('mongodb')

const serviceCategorieSchema = mongoose.Schema({
    name:        { type: String, maxLength: 50, trim: true, required: true },
    createdAt:      { type: Number },
    lastUpdate:     { type: Number },
})

const ServiceCategorie = mongoose.model("ServiceCategories", serviceCategorieSchema);

module.exports = ServiceCategorie