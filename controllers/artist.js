'use strict'

let path = require('path')
let fs = require('fs')
let mongoosePaginate = require('mongoose-pagination')

let Artist = require('../models/artist')
let Album = require('../models/album')
let Song = require('../models/song')

function getArtist(req, res){
   let artistId = req.params.id
   Artist.findById(artistId, (err, artist) => {
     if(err){
        res.status(500).send({message: 'Error petitio'})
     }else{
       if(!artist){
         res.status(404).send({message: 'artist not exist'})
       }else{
         res.status(200).send({artist})
       }
     }
   })

}


function saveArtist(req, res){
  let artist = new Artist()

  let params = req.body
  artist.name = params.name
  artist.description = params.description
  artist.image = 'null'

  artist.save( (err, artistStored) =>{
    if(err){
      res.status(500).send({message: 'Error artist'})
    }else{
      if(!artistStored){
        res.status(404).send({message: 'Error artist not saved'})
      }else{
        res.status(200).send({artist: artistStored})
      }
    }
  })
}

function getArtists(req, res){
  let page = req.params.page
  if(!page){
    page = 1
  }

  let itemsPerPage = 3

  Artist.find().sort('name').paginate(page, itemsPerPage, (err, artists, total)=>{
    if(err){
      res.status(500).send({message: 'Error artists'})
    }else{
      if(!artists){
        res.status(404).send({message: 'Not have artist'})
      }else{
        return res.status(200).send({
          totalItems: total,
          artists: artists
        })
      }
    }
  })
}

function updateArtist (req, res){
  let artistId = req.params.id
  let update = req.body
  Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
    if(err){
      res.status(500).send({message: 'Error artists'})
    }else{
      if(!artistUpdated){
        res.status(404).send({message: 'Artist not updated'})
      }else{
        res.status(200).send({artist: artistUpdated})
      }
    }
  })
}

function deleteArtist( req, res){
  let artistId =req.params.id

  Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
    if(err){
      res.status(500).send({message: 'Error artists'})
    }else{
      if(!artistRemoved){
        res.status(404).send({message: 'Artist not removed'})
      }else{
        Album.find({artist: artistRemoved._id}).remove( (err, albumRemoved) => {
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
                    res.status(200).send({artist: artistRemoved})
                  }
                }
              })
            }
          }
        })
      }
    }
  })
}

function uploadImage(req, res){
  let artistId = req.params.id
  let file_name = 'No upload...'
  
  if(req.files){
    let file_path = req.files.image.path
    let file_split = file_path.split('\/');
    file_name = file_split[2]

    let ext_split = file_name.split('\.')
    let file_ext = ext_split[1]

    if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
      Artist.findByIdAndUpdate(artistId, {image: file_name}, (err, artistUpdate) =>{
        if(!artistUpdate){
          res.status(404).send({message: 'artists can not update'})
        }else{
          res.status(200).send({artist: artistUpdate})
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
  let path_file = './uploads/artists/'+imageFile

  fs.exists(path_file, (exist) => {
    if(exist){
      res.sendFile(path.resolve(path_file))
    }else{
      res.status(200).send({message: 'image not exist'})
    }
  })
}

module.exports = {
  getArtist,
  saveArtist,
  getArtists,
  updateArtist,
  deleteArtist,
  uploadImage,
  getImageFile
}
