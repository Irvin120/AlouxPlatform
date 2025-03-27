const Api = require('../models/Api')

const self = module.exports;

self.create = async (req, res) => {
    try {

        let api = new Api(req.body)
        api.createdAt  = (new Date()).getTime()
        api.lastUpdate = api.createdAt       
        
        const create = await api.save()
        
        res.status(201).send(create)
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}

self.retrieve = async(req, res) => {    
    try {
        const retrieve = await Api.find({}).sort({_id:-1})
        
        res.status(200).send(retrieve)
    } catch (error) {
        res.status(404).send({error:error.message})
    }
}

self.detail = async(req, res) => {    
    try {
        const _id = req.params.api_id
        const detail = await Api.findOne({_id})
        
        if(!detail)
            throw new Error('Upss! No se encontró el Elemento')

        res.status(200).send(detail)
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}

self.update = async( req, res) =>{
    try {

        const _id = req.params.api_id
        const update = await Api.updateOne( { _id },{$set:req.body, lastUpdate: (new Date()).getTime()})   

        res.status(202).send(update)
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}

self.delete = async(req, res) => {    
    try {

        const _id = req.params.api_id
        const del = await Api.deleteOne({ _id })
        
        res.status(200).send(del)
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}