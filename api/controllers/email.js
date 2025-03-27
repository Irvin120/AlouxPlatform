const Log = require('../models/Log')

const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses")

const self = module.exports;

self.send = async (req, res) => {
    try {

        const client = new  SESClient({ region: process.env.AWS_REGION })

        const params = {
            Destination: {
                ToAddresses: req.body.ToAddresses
              },
              Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: req.body.Html
                    }
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: req.body.Subject
                }
              },
              Source: req.body.Source
        }
        const command = new SendEmailCommand(params);
        const response = await client.send(command);
        
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