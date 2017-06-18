'use strict'

let path = require('path')
let fs = require('fs')
let mongoosePaginate = require('mongoose-pagination')

let Artist = require('../models/artist')
let Album = require('../models/album')
let Song = require('../models/song')

function getAlbum(req, res){
  res.status(200).send({message: 'GetAlbum'})
}

function saveAlbum(req, res){
  let album =  new Album()
  let params = req.body
  album.title = params.title
  album.description = params.description
  album.year = params.year
  album.image = 'null'
  album.artist = params.artist

  album.save( (err, albumStored) => {
    if(err){
      res.status(500).send({message: 'Server error'})
    }else{
      if(!albumStored){
        res.status(404).send({message: 'album not saved'})
      }else{
          res.satus(200).send({album: albumStored})
      }
    }
  })
}

module.exports = {
  getAlbum,
  saveAlbum
}
