const mongoose = require('mongoose')
const { ObjectId } = require('mongodb')

const keySchema = mongoose.Schema({
    name:           { type: String, maxLength: 500, required: true, trim: true },
    key:            { type: String, maxLength: 500, required: true, trim: true },
    origins:        [ 
        {
            origin: {  type: String, trim: true } 
        }
    ],
    _api:           [ 
        {  type: ObjectId , ref: 'Api'} 
    ],
    config: {
        postbox: {
            toAddress:      [
                {
                    email: { type: String, maxLength: 322,trim: true }
                }
            ],
            source:                 { type: String , maxLength: 322 },
            subjectNotification:    { type: String , maxLength: 500 },
            subjectContact:         { type: String , maxLength: 500 },
            htmlNotification:       { type: String , maxLength: 50000 },
            htmlContact:            { type: String , maxLength: 50000 }
        }
    },
    _client:        { type: ObjectId , ref: 'Client'},
    createdAt:      { type: Number , required: true },
    lastUpdate:     { type: Number , required: false },
    status:         { type: String, enum : ['Activo','Inactivo'], default: 'Activo', required: true  }
})
  
const Key = mongoose.model("Key", keySchema);

module.exports = Key