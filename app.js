'use strict'
const express = require('express')
const bodyParser = require('body-parser')

let app = express()

//rutes
let user_routes = require('./routes/user')
let artist_routes = require('./routes/artist')
let album_routes = require('./routes/album')
let song_routes = require('./routes/song')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


//config headers http

//base routes
app.use('/api', user_routes)
app.use('/api', artist_routes)
app.use('/api', album_routes)
app.use('/api', song_routes)

//rutas body-parser

module.exports = app
