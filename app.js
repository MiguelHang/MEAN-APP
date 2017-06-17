'use strict'
const express = require('express')
const bodyParser = require('body-parser')

let app = express()

//rutes
let user_routes = require('./routes/user')
let artist_routes = require('./routes/artist')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


//config headers http

//base routes
app.use('/api', user_routes)
app.use('/api', artist_routes)

//rutas body-parser

module.exports = app
