const Project   = require('../models/Project')
const Payment    = require('../models/Payment')
const { AlouxAWS } = require('aloux-iam')

const path = require('path');
const { S3Client, PutObjectCommand, DeleteObjectsCommand } = require("@aws-sdk/client-s3");

const self = module.exports;

// Create
self.create = async (req, res) => {
    try {
        let project = new Project(req.body)
        project.createdAt  = (new Date()).getTime()
        project.status = 'Activo'

        const create = await project.save()
        
        res.status(201).send(create)
    } catch (error) {
        const obj = {
            title: 'Error al crear el proyecto',
            detail: error.message,
            suggestion: 'Revisa el detalle del error'
        }
        res.status(400).send(obj)
    }
}

// Retrieve
self.retrieve = async(req, res) => {    
    try {
        const retrieve = await Project.find({}).populate('_client').sort({_id:-1})
        
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

// Count
self.count = async(req, res) => {    
    try {
        const response = await Project.countDocuments()
        
        res.status(200).send({count: response})
    } catch (error) {
        const obj = {
            title: 'Error al contar los proyectos',
            detail: error.message,
            suggestion: 'Revisa el detalle del error'
        }
        res.status(400).send(obj)
    }
}

// Detail
self.detail = async(req, res) => {    
    try {
        const _id = req.params.PROJECT_ID
        const detail = await Project.findOne({_id}).populate('_client')
        
        if(!detail)
            throw new Error('Upss! No se encontró el Elemento')

        res.status(200).send(detail)
    } catch (error) {
        const obj = {
            title: 'Error al obtener el detalle del proyecto',
            detail: error.message,
            suggestion: 'Revisa el detalle del error'
        }
        res.status(400).send(obj)
    }
}

// Update
self.update = async( req, res) => {
    try {

        const _id = req.params.PROJECT_ID

        await Project.updateOne( { _id },{ $set:req.body })  
        
        let project = await Project.findOne( { _id } )
        
        project.lastUpdate = (new Date()).getTime()
        const update = await project.save()          

        res.status(202).send(update)
    } catch (error) {
        const obj = {
            title: 'Error al actualizar el proyecto',
            detail: error.message,
            suggestion: 'Revisa el detalle del error'
        }
        res.status(400).send(obj)
    }
}

// Delete
self.delete = async(req, res) => {    
    try {

        const _id = req.params.PROJECT_ID
        const del = await Project.deleteOne({ _id })
        
        res.status(200).send(del)
    } catch (error) {
        const obj = {
            title: 'Error al eliminar el proyecto',
            detail: error.message,
            suggestion: 'Revisa el detalle del error'
        }
        res.status(400).send(obj)
    }
}

// Change Status
self.status = async (req, resp) => {
    try {
        const _id = req.params.PROJECT_ID
        let project = await Project.findOne({ _id })

        if (!project) {
            throw {
                code: 404,
                title: 'Id no encontrado',
                detail: 'No se encontró el _id: ' + _id,
                suggestion: 'Verifique la información',
                error: new Error()
              }
        }

        project.status = req.body.status
        project.lastUpdate = (new Date()).getTime()
        const result = await project.save()

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
            title: 'Error al obtener los pagos del proyecto',
            detail: error.message,
            suggestion: 'Revisa el detalle del error'
        }
        res.status(400).send(obj)
    }
}

// Retrieve payments
self.payment = async(req, res) => {    
    try {

        const _project = req.params.PROJECT_ID
        const retrieve = await Payment.find({_project}).sort({createdAt:-1})
        
        res.status(200).send(retrieve)
    } catch (error) {
        const obj = {
            title: 'Error obtener los pagos del cliente',
            detail: error.message,
            suggestion: 'Revisar el detalle del error'
        }
        res.status(400).send(obj)
    }
}

self.file = async (req, res) => {
    try {
        let project = await Project.findOne({ _id: req.params.PROJECT_ID })
        const imgUrl = await AlouxAWS.upload('projectPlatform/' + 'agreement' + "-" + req.params.PROJECT_ID, req.files.agreement)
        project.files.agreementUrl = imgUrl
        const updateProject = await project.save()
        res.status(202).send(updateProject)
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
}