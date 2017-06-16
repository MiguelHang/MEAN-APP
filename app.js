'use strict'
const express = require('express')
const bodyParser = require('body-parser')

let app = express()

//rutes
let user_routes = require('./routes/user')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


//config headers http

//base routes
app.use('/api', user_routes)

//rutas body-parser

module.exports = app
