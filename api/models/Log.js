const mongoose = require('mongoose')
const { ObjectId } = require('mongodb')

const keySchema = mongoose.Schema({

    data:           { type: Object },
    response:       { type: Object },
    key:            { type: Object, required: true },
    api:            { type: Object, required: true },
    origin:         { type: String, required: true, maxLength: 500},
    _api:           [ 
                        {  type: ObjectId , ref: 'Api'} 
                    ],
    _key:           { type: String, maxLength: 500, required: true, trim: true },
    _client:        { type: ObjectId , ref: 'Client'},
    createdAt:      { type: Number , required: true }
})
  
const Log = mongoose.model("Log", keySchema);

module.exports = Log