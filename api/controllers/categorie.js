const ServiceCategorie = require('../models/Categorie')

const self = module.exports;

// Create
self.create = async (req, res) => {
    try {
        let serviceCategorie = new ServiceCategorie(req.body)
        serviceCategorie.createdAt  = (new Date()).getTime()

        const create = await serviceCategorie.save()
        
        res.status(201).send(create)
    } catch (error) {
        const obj = {
            title: 'Error al crear la categoria del servicio.',
            detail: error.message,
            suggestion: 'Revisa el detalle del error'
        }
        res.status(400).send(obj)
    }
}

// Retrieve
self.retrieve = async(req, res) => {    
    try {
        const retrieve = await ServiceCategorie.find({}).sort({ _id: -1 });

        res.status(200).send(retrieve)
    } catch (error) {
        const obj = {
            title: 'Error al obtener las categorias del servicio',
            detail: error.message,
            suggestion: 'Revisa el detalle del error'
        }
        res.status(400).send(obj)
    }
}

// Detail
self.detail = async(req, res) => {    
    try {
        const _id = req.params.CATEGORIE_ID
        const detail = await ServiceCategorie.findOne({_id})
        
        if(!detail)
            throw new Error('Upss! No se encontró el Elemento')

        res.status(200).send(detail)
    } catch (error) {
        const obj = {
            title: 'Error al obtener el detalle de la categoria del servicio',
            detail: error.message,
            suggestion: 'Revisa el detalle del error'
        }
        res.status(400).send(obj)
    }
}

// Update
self.update = async( req, res) => {
    try {

        const _id = req.params.CATEGORIE_ID

        await ServiceCategorie.updateOne( { _id },{ $set:req.body })  
        
        let serviceCategorie = await ServiceCategorie.findOne( { _id } )
        
        serviceCategorie.lastUpdate = (new Date()).getTime()
        const update = await serviceCategorie.save()          

        res.status(202).send(update)
    } catch (error) {
        const obj = {
            title: 'Error al actualizar la categoria del servicio',
            detail: error.message,
            suggestion: 'Revisa el detalle del error'
        }
        res.status(400).send(obj)
    }
}

// Delete
self.delete = async(req, res) => {    
    try {

        const _id = req.params.CATEGORIE_ID
        const del = await ServiceCategorie.deleteOne({ _id })
        
        res.status(200).send(del)
    } catch (error) {
        const obj = {
            title: 'Error al eliminar la categoria del servicio',
            detail: error.message,
            suggestion: 'Revisa el detalle del error'
        }
        res.status(400).send(obj)
    }
}
