'use strict'

let express = require('express')
let UserController = require('../controllers/user.js')
let api = express.Router();
let md_auth = require('../middlewares/auth')

let multipart = require('connect-multiparty')
let md_upload = multipart({uploadDir: './uploads/users'})

api.get('/probando-controller', md_auth.ensureAuth, UserController.pruebas)
api.get('/get-image-user/:imageFile', UserController.getImageFile)
api.get('/get-users/:userText?', md_auth.ensureAuth, UserController.getUsers)
api.post('/register', UserController.saveUser)
api.post('/login', UserController.loginUser)
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage)
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser)

module.exports  = api
