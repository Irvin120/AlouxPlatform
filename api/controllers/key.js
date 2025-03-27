const Key = require('../models/Key')
const Log = require('../models/Log')
const bcrypt = require("bcryptjs")
const { createHmac } = require('node:crypto')

const self = module.exports;

self.create = async (req, res) => {
    try {

        let key = new Key(req.body)
        key.createdAt  = (new Date()).getTime()
        key.lastUpdate = key.createdAt    
        console.log(key.createdAt)   
        // key.key = await bcrypt.hash( key.createdAt , 5);

        key.key = createHmac('sha256', process.env.AUTH_SECRET)
               .update(String(key.createdAt))
               .digest('hex');
        
        const create = await key.save()
        
        res.status(201).send(create)
    } catch (error) {
        console.error(error)
        res.status(400).send({error:error.message})
    }
}
self.retrieve = async(req, res) => {    
    try {

        const retrieve = await Key.find({}, { config: 0 }).populate('_client').sort({_id:-1})
        
        res.status(200).send(retrieve)
    } catch (error) {
        res.status(404).send({error:error.message})
    }
}

// Count
self.count = async(req, res) => {    
    try {
        const response = await Key.countDocuments()
        
        res.status(200).send({count: response})
    } catch (error) {
        const obj = {
            title: 'Error al contar las llaves',
            detail: error.message,
            suggestion: 'Revisa el detalle del error'
        }
        res.status(400).send(obj)
    }
}

self.detail = async(req, res) => {    
    try {
        const _id = req.params.KEY_ID
        const detail = await Key.findOne({_id}).populate([{path:'_api'},{path:'_client'}]).lean()
        
        if(!detail)
            throw new Error('Upss! No se encontró el Elemento')

        for(let i in detail._api){
            detail._api[i].request = await Log.find({_key: detail._id, _api: detail._api[i]._id}).count()
            detail._api[i].requestSuccess = await Log.find({_key: detail._id, _api: detail._api[i]._id, 'response.metadata.httpStatusCode':  200 }).count()
            detail._api[i].requestError = await Log.find({_key: detail._id, _api: detail._api[i]._id, 'response.metadata.httpStatusCode': { $ne: 200 } }).count()
            detail._api[i].amount = detail._api[i].request * detail._api[i].price
        }

        res.status(200).send(detail)
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}

self.update = async( req, res) =>{
    try {

        const _id = req.params.KEY_ID
        const update = await Key.updateOne( { _id },{$set:req.body, lastUpdate: (new Date()).getTime()})   

        res.status(202).send(update)
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}

self.delete = async(req, res) => {    
    try {

        const _id = req.params.KEY_ID
        const del = await Key.deleteOne({ _id })
        
        res.status(200).send(del)
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}