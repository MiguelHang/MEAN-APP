'use strict'
const mongoose = require('mongoose')
let Schema = mongoose.Schema

let SongSchema = Schema({
  number: String,
  name: String,
  duration: String,
  file: String,
  votes: {type:Number, default:0},
  points: {type:Number, default:0},
  album: {type: Schema.ObjectId, ref: 'Album'},
  playlist:[{type: Schema.ObjectId, ref: 'Playlist'}]
})

module.exports = mongoose.model('Song', SongSchema)
