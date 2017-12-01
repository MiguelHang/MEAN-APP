'use strict'

let path = require('path')
let fs = require('fs')
let mongoosePaginate = require('mongoose-pagination')
let Twit = require('twit')

let Artist = require('../models/artist')
let Album = require('../models/album')
let Song = require('../models/song')

var T = new Twit({
  consumer_key:         'PIXJVmTtpYVkAfl3Y63CcLKSa',
  consumer_secret:      'jNPafgGQ9FwR0jFT0BxRFnEs6bQSngpne41uoCYnsJOqBbGkgE',
  access_token:         '936650007104708608-zRdxBhUSKF4TWyf0EtzxNVAhsygOGAu',
  access_token_secret:  'tp9U8MfH3ZQe8GkDsHGIwC96kJAQTlOnFrm9KVi6wBgLi'
})

function getAlbum(req, res){
  let albumId = req.params.id

  Album.findById(albumId).populate({path: 'artist'}).exec( (err, album) => {
    if(err){
      res.status(500).send({message: 'Error request'})
    }else{
      if(!album){
        res.status(404).send({message: 'Album not exist'})
      }else{
        res.status(200).send({album})
      }
    }
  })
}

function getAlbums(req, res){
  let artistId = req.params.artist
  let find = null

  if (!artistId) {
    find = Album.find({}).sort('title')
  }else{
    find = Album.find({artist: artistId}).sort('year')
  }

  find.populate({path: 'artist'}).exec( (err, albums) => {
    if (err) {
      res.status(500).send({message: 'Server error'})
    }else{
      if(!albums){
        res.status(404).send({message: 'album not saved'})
      }else{
        res.status(200).send({albums})
      }
    }
  })
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
          res.status(200).send({album: albumStored})
      }
    }
  })

  T.post('statuses/update',
    { status: 'Nuevo album '+album.title +'! Escúchalo ya en http://soundclub.com/' },
     (err, data, response) => {
      console.log(data)
  })
}

function updateAlbum(req, res){
  let albumId = req.params.id
  let update = req.body

  Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) => {
    if (err) {
      res.status(500).send({message: 'Server error'})
    }else{
      if(!albumUpdated){
        res.status(404).send({message: 'album not exist'})
      }else{
        res.status(200).send({album: albumUpdated})

      }
    }
  })
}

function deleteAlbum(req, res){
  let albumId = req.params.id

  Album.findByIdAndRemove(albumId, (err, albumRemoved) => {
    if(err){
      res.status(500).send({message: 'Error Albums'})
    }else{
      if(!albumRemoved){
        res.status(404).send({message: 'album not removed'})
      }else{
        Song.find({album: albumRemoved._id}).remove( (err, songRemoved) => {
          if(err){
            res.status(500).send({message: 'Error song'})
          }else{
            if(!songRemoved){
              res.status(404).send({message: 'song not removed'})
            }else{
              res.status(200).send({album: albumRemoved})
            }
          }
        })
      }
    }
  })
}

function uploadImage(req, res){
  let albumId = req.params.id
  let file_name = 'No upload...'

  if(req.files){
    let file_path = req.files.image.path
    let file_split = file_path.split('\/');
    file_name = file_split[2]

    let ext_split = file_name.split('\.')
    let file_ext = ext_split[1]

    if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
      Album.findByIdAndUpdate(albumId, {image: file_name}, (err, albumUpdate) =>{
        if(!albumUpdate){
          res.status(404).send({message: 'artists can not update'})
        }else{
          res.status(200).send({artist: albumUpdate})
        }
      })
    }else{
        res.status(200).send({message: 'image extension not valid'})
    }
  }else{
    res.status(200).send({message: 'image not upload'})
  }
}

function getImageFile(req, res){
  let imageFile = req.params.imageFile
  let path_file = './uploads/albums/'+imageFile

  fs.exists(path_file, (exist) => {
    if(exist){
      res.sendFile(path.resolve(path_file))
    }else{
      res.status(200).send({message: 'image not exist'})
    }
  })
}

module.exports = {
  getAlbum,
  getAlbums,
  saveAlbum,
  updateAlbum,
  deleteAlbum,
  uploadImage,
  getImageFile
}
