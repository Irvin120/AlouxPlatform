const mongoose = require('mongoose')
const { ObjectId } = require('mongodb')

const subCategorieSchema = mongoose.Schema({
    name:        { type: String, maxLength: 50, trim: true, required: true },
    _categorie:        { type: ObjectId , ref: 'ServiceCategories'},
    createdAt:      { type: Number },
    lastUpdate:     { type: Number },
})

const SubCategorie = mongoose.model("SubCategories", subCategorieSchema)

module.exports = SubCategorie