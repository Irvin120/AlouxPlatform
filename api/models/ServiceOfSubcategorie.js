const mongoose = require('mongoose')
const { ObjectId } = require('mongodb')

const serviceSubcategorieSchema = mongoose.Schema({
    description:    { type: String, maxLength: 150, trim: true },
    imgUrl:         { type: String, maxLength: 500, trim: true },
    _subcategorie:  { type: ObjectId , ref: 'SubCategories'},
    createdAt:      { type: Number },
    lastUpdate:     { type: Number },
})

const ServiceSubcategorie = mongoose.model("ServiceSubcategories", serviceSubcategorieSchema);

module.exports = ServiceSubcategorie