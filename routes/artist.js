'use strict'

let express = require('express')
let ArtistController = require('../controllers/artist')
let Searchsongs = require('../controllers/search')

let api = express.Router()
let md_auth = require('../middlewares/auth')

let multipart = require('connect-multiparty')
let md_upload = multipart({uploadDir: './uploads/artists'})

api.get('/artist/:id', md_auth.ensureAuth, ArtistController.getArtist)
api.get('/artists/:page?', md_auth.ensureAuth, ArtistController.getArtists)
api.get('/get-image-artist/:imageFile', ArtistController.getImageFile)
api.get('/searchartists/:artistText', md_auth.ensureAuth, Searchsongs.getArtists)
api.post('/artist', md_auth.ensureAuth, ArtistController.saveArtist)
api.post('/upload-image-artist/:id', [md_auth.ensureAuth, md_upload], ArtistController.uploadImage)
api.put('/artist/:id', md_auth.ensureAuth, ArtistController.updateArtist)
api.delete('/artist/:id', md_auth.ensureAuth, ArtistController.deleteArtist)


module.exports = api
