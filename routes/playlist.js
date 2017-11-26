'use strict'

let express = require('express')
let PlaylistController = require('../controllers/playlist')
let Searchplaylist = require('../controllers/search')

let api = express.Router()
let md_auth = require('../middlewares/auth')

//let multipart = require('connect-multiparty')
//let md_upload = multipart({uploadDir: './uploads/artists'})

api.get('/playlist/:id', md_auth.ensureAuth, PlaylistController.getPlaylist)
api.get('/playlists/:page?', md_auth.ensureAuth, PlaylistController.getPlaylists)
// api.get('/searchplaylists/:playlistText', md_auth.ensureAuth, Searchplaylist.getPlaylists)
api.post('/playlist', md_auth.ensureAuth, PlaylistController.savePlaylist)
api.put('/playlist/:id', md_auth.ensureAuth, PlaylistController.updatePlaylist)
api.delete('/playlist/:id', md_auth.ensureAuth, PlaylistController.deletePlaylist)

module.exports = api
