const SubCategorie = require('../models/Subcategorie')

const self = module.exports;

// Create
self.create = async (req, res) => {
    try {
        let subCategorie = new SubCategorie(req.body)
        subCategorie.createdAt  = (new Date()).getTime()

        const create = await subCategorie.save()
        
        res.status(201).send(create)
    } catch (error) {
        const obj = {
            title: 'Error al crear la subcategoria.',
            detail: error.message,
            suggestion: 'Revisa el detalle del error'
        }
        res.status(400).send(obj)
    }
}

// Retrieve
self.retrieve = async(req, res) => {    
    try {
        const retrieve = await SubCategorie.find({}).sort({ _id: -1 })

        res.status(200).send(retrieve)
    } catch (error) {
        const obj = {
            title: 'Error al obtener las subcategorias',
            detail: error.message,
            suggestion: 'Revisa el detalle del error'
        }
        res.status(400).send(obj)
    }
}

// Detail
self.detail = async(req, res) => {    
    try {
        const _id = req.params.SUBCATEGORIE_ID
        const detail = await SubCategorie.findOne({_id})
        
        if(!detail)
            throw new Error('Upss! No se encontró el Elemento')

        res.status(200).send(detail)
    } catch (error) {
        const obj = {
            title: 'Error al obtener el detalle de la subcategoria',
            detail: error.message,
            suggestion: 'Revisa el detalle del error'
        }
        res.status(400).send(obj)
    }
}

// Update
self.update = async( req, res) => {
    try {

        const _id = req.params.SUBCATEGORIE_ID

        await SubCategorie.updateOne( { _id },{ $set:req.body })  
        
        let subCategorie = await SubCategorie.findOne( { _id } )
        
        subCategorie.lastUpdate = (new Date()).getTime()
        const update = await subCategorie.save()          

        res.status(202).send(update)
    } catch (error) {
        const obj = {
            title: 'Error al actualizar la subcategoria',
            detail: error.message,
            suggestion: 'Revisa el detalle del error'
        }
        res.status(400).send(obj)
    }
}

// Delete
self.delete = async(req, res) => {    
    try {

        const _id = req.params.SUBCATEGORIE_ID
        const del = await SubCategorie.deleteOne({ _id })
        
        res.status(200).send(del)
    } catch (error) {
        const obj = {
            title: 'Error al eliminar la subcategoria',
            detail: error.message,
            suggestion: 'Revisa el detalle del error'
        }
        res.status(400).send(obj)
    }
}