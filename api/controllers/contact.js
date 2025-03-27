const Contact   = require('../models/Contact')

const path = require('path');
const { S3Client, PutObjectCommand, DeleteObjectsCommand } = require("@aws-sdk/client-s3");

const self = module.exports;

// Create
self.create = async (req, res) => {
    try {
        let contact = new Contact(req.body)
        contact.createdAt  = (new Date()).getTime()
        contact.status = 'Activo'

        const create = await contact.save()
        
        res.status(201).send(create)
    } catch (error) {
        const obj = {
            title: 'Error al crear el contacto',
            detail: error.message,
            suggestion: 'Revisa el detalle del error'
        }
        res.status(400).send(obj)
    }
}

// Retrieve
self.retrieve = async(req, res) => {    
    try {
        const retrieve = await Contact.find({}).sort({_id:-1})
        
        res.status(200).send(retrieve)
    } catch (error) {
        const obj = {
            title: 'Error al obtener los proyectos',
            detail: error.message,
            suggestion: 'Revisa el detalle del error'
        }
        res.status(400).send(obj)
    }
}


// Detail
self.detail = async(req, res) => {    
    try {
        const _id = req.params.CONTACT_ID
        const detail = await Contact.findOne({_id})
        
        if(!detail)
            throw new Error('Upss! No se encontró el Elemento')

        res.status(200).send(detail)
    } catch (error) {
        const obj = {
            title: 'Error al obtener el detalle del contacto',
            detail: error.message,
            suggestion: 'Revisa el detalle del error'
        }
        res.status(400).send(obj)
    }
}

// Update
self.update = async( req, res) => {
    try {

        const _id = req.params.CONTACT_ID

        await Contact.updateOne( { _id },{ $set:req.body })  
        
        let contact = await Contact.findOne( { _id } )
        
        contact.lastUpdate = (new Date()).getTime()
        const update = await contact.save()          

        res.status(202).send(update)
    } catch (error) {
        const obj = {
            title: 'Error al actualizar el contacto',
            detail: error.message,
            suggestion: 'Revisa el detalle del error'
        }
        res.status(400).send(obj)
    }
}

// Delete
self.delete = async(req, res) => {    
    try {

        const _id = req.params.CONTACT_ID
        const del = await Contact.deleteOne({ _id })
        
        res.status(200).send(del)
    } catch (error) {
        const obj = {
            title: 'Error al eliminar el contacto',
            detail: error.message,
            suggestion: 'Revisa el detalle del error'
        }
        res.status(400).send(obj)
    }
}

// Change Status
self.status = async (req, resp) => {
    try {
        const _id = req.params.CONTACT_ID
        let contact = await Contact.findOne({ _id })

        if (!contact) {
            throw {
                code: 404,
                title: 'Id no encontrado',
                detail: 'No se encontró el _id: ' + _id,
                suggestion: 'Verifique la información',
                error: new Error()
              }
        }

        contact.status = req.body.status
        contact.lastUpdate = (new Date()).getTime()
        const result = await contact.save()

        resp.status(200).send(result)
    } catch (error) {
        let obj = error
        if(!error.code){
            obj = {
                code: 400,
                title: 'Error al cambiar el estatus',
                detail: error.message,
                suggestion: 'Revisa el detalle del error'
            }
        }
        res.status(error.code).send(obj)
    }
}


// Retrieve payments
self.payments = async(req, res) => {    
    try {

        const _client = req.params.CLIENT_ID
        const retrieve = await Payment.find({_client}).sort({createdAt:-1})
        
        res.status(200).send(retrieve)
    } catch (error) {
        const obj = {
            title: 'Error al obtener los pagos del contacto',
            detail: error.message,
            suggestion: 'Revisa el detalle del error'
        }
        res.status(400).send(obj)
    }
}