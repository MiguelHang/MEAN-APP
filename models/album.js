'use strict'
const mongoose = require('mongoose')
let Schema = mongoose.Schema

let AlbumSchema = Schema({
  title: String,
  decription: String,
  year: Number,
  password: String,
  image: String,
  Artist: {type: Schema.ObjectId, ref: 'Artist'}
})

module.exports = mongoose.model('Album', AlbumSchema)
