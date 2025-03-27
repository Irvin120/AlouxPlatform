const ServiceSubCategorie = require('../models/ServiceOfSubcategorie')
const { AlouxAWS } = require('aloux-iam')

const self = module.exports;

// Create
self.create = async (req, res) => {
    try {
        let serviceSubcategorie = new ServiceSubCategorie(req.body)
        serviceSubcategorie.createdAt  = (new Date()).getTime()

        const create = await serviceSubcategorie.save()
        
        res.status(201).send(create)
    } catch (error) {
        const obj = {
            title: 'Error al crear el servicio.',
            detail: error.message,
            suggestion: 'Revisa el detalle del error'
        }
        res.status(400).send(obj)
    }
}

// Retrieve
self.retrieve = async(req, res) => {    
    try {
        const retrieve = await ServiceSubCategorie.find({}).sort({ _id: -1 })

        res.status(200).send(retrieve)
    } catch (error) {
        const obj = {
            title: 'Error al obtener los servicios',
            detail: error.message,
            suggestion: 'Revisa el detalle del error'
        }
        res.status(400).send(obj)
    }
}

// Detail
self.detail = async(req, res) => {    
    try {
        const _id = req.params.SERVICE_ID
        const detail = await ServiceSubCategorie.findOne({_id})
        
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

        const _id = req.params.SERVICE_ID

        await ServiceSubCategorie.updateOne( { _id },{ $set:req.body })  
        
        let serviceSubcategorie = await ServiceSubCategorie.findOne( { _id } )
        
        serviceSubcategorie.lastUpdate = (new Date()).getTime()
        const update = await serviceSubcategorie.save()          

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

        const _id = req.params.SERVICE_ID
        const del = await ServiceSubCategorie.deleteOne({ _id })
        
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

self.updatePicture = async (req, res) => {
    try {
        let service = await ServiceSubCategorie.findOne({ _id: req.params.SERVICE_ID })
        const imgUrl = await AlouxAWS.upload('subcategorie/' + 'service' + "-" + req.params.SERVICE_ID, req.files.picture)
        service.imgUrl = imgUrl
        const updateEvent = await service.save()
        res.status(202).send(updateEvent)
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
}