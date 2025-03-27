const express = require('express')
const methodOverride = require('method-override')
const router = require('./router')
const mongoose = require('mongoose')
const path = require('path')

const { IAMRouter, IAMSwagger } = require('aloux-iam')

// swagger
const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')

var swagger_path = path.resolve(__dirname, './swagger.yaml')
let swagger = YAML.load(swagger_path)

if (process.env.DEBUG === 'true') {
    swagger['servers'] = []
    swagger.servers.push({ url: process.env.SWAGGER_SERVER, description: 'DEV' })
}

// MongoDB Conexión
mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true
})

const app = express()

// CORS
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', process.env.ACCESS_CONTROL_ALLOW_ORIGIN);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// middleware
app.use(express.json())
app.use(methodOverride());
app.use(router)
app.use(IAMRouter)

if (process.env.DEBUG === 'true') {
    app.use(
        "/docs",
        swaggerUI.serveFiles(swagger, {}),
        swaggerUI.setup(swagger)
    )

    app.use(
        "/docs-iam",
        swaggerUI.serveFiles(IAMSwagger, {}),
        swaggerUI.setup(IAMSwagger)
    )
}

app.listen(process.env.PORT, () => {
    console.log(`\n - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -`);
    console.log(` |  API REST [api.platform.aloux] - http://localhost:${process.env.PORT}/  | `);
    console.log(` - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - \n`);
})