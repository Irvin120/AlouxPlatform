const Log = require('../models/Log')

const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

const self = module.exports;

self.send = async (req, res) => {
    try {

        const client = new SNSClient({ region: process.env.AWS_REGION })

        const params = {
            PhoneNumber: req.body.PhoneNumber,
            Message: req.body.Message
        }
        const command = new PublishCommand(params)
        const response = await client.send(command)
        
        let log = new Log({
            response: {
                metadata: response.$metadata,
                MessageId: response.MessageId
            },
            data: req.body,
            key: req.key,
            api: req.api,
            origin: req.get('host'),
            _api: req.api._id,
            _key: req.key._id,
            _client: req.api._id,
            createdAt: (new Date()).getTime()
        })

        log.save()
        
        res.status(201).send(response)
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}