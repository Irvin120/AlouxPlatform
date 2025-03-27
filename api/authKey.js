const Key = require('./models/Key')

const authKey = async(req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const apiRequest =  req.originalMethod + ' ' + req.route.path 

        const key = await Key.findOne({ key: token, isActive: true }).populate('_api').lean()
        if (!key) {
            throw new Error('Llave no valida')
        }

        const api = key._api.find(function(item) {
            return item.api === apiRequest
        })
        if (!api) {
            throw new Error('Api no autorizada')
        }

        req.key = key
        req.api = api
        next()
    } catch (error) {
        res.status(401).send({ error: error.message})
    }
}

module.exports = {authKey}