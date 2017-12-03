'use strict'

let User = require('../models/user')
let bcrypt = require('bcrypt-nodejs')
let jwt = require('../services/jwt')
let fs = require('fs')
let path = require('path')

function pruebas(req, res){
  res.status(200).send({
    message: 'Probando una accion del controlador de usuarios del api rest'
  })
}

function saveUser(req, res){
  let user = new User()
  let params = req.body

  user.name = params.name
  user.surname = params.surname
  user.email = params.email
  user.role = 'ROLE_USER'
  user.image = 'null'

  User.find({email: user.email}, (err, comp) => {
    if(err){
      res.status(500).send({message: 'Server error'})
    }else{
      if(comp.length > 0){
        res.status(500).send({message: 'Email already used'})
      }else{
        if(params.password){
          //encrypt password
          bcrypt.hash(params.password, null, null, (err, hash) => {
            user.password = hash

            if(user.name != null && user.surname != null && user.email != null){
              user.save( (err, userStored) => {
                if (err) {
                    res.status(500).send({message: 'error to save user'})
                }else{
                  if(!userStored){
                      res.status(404).send({message: 'user not saved'})
                  }else {
                      res.status(200).send({user: userStored})
                  }
                }
              })
            }else{
                res.status(500).send({message: 'required all user data'})
            }
          })
        }else{
          res.status(500).send({message: 'required password'})
        }
      }
    }
  })
}

function loginUser(req, res){
    let params = req.body

    let email = params.email
    let password = params.password

    User.findOne({email: email.toLowerCase()}, (err, user) => {
      if(err){
        res.status(500).send({message: 'bad request'})
      }else{
        if(!user){
          res.status(400).send({message: 'user not exist'})
        }else{
          //compare passwords
          bcrypt.compare(password, user.password, (err, check) => {
            if(check){
              if (params.gethash){
                //return token
                res.status(200).send({
                  token: jwt.createToken(user)
                })
              }else{
                res.status(200).send(user)
              }
            }else{
              res.status(404).send({message: 'user can not login'})
            }
          })
        }
      }
    })
}

function updateUser(req, res){
  let userId = req.params.id
  let update = req.body

  // if (userId != req.user.sub ) {
  //   return res.status(500).send({message: 'not same user'})
  // }

  User.findByIdAndUpdate(userId, update, (err, userUpdate) =>{
    if(err){
      res.status(500).send({message: 'error to update user'})
    }else{
      if(!userUpdate){
        res.status(404).send({message: 'user can not update'})
      }else{
        res.status(200).send({user: userUpdate})
      }
    }
  })
}

function uploadImage(req, res){
  let userId = req.params.id
  let file_name = 'No upload...'

  if(req.files){
    let file_path = req.files.image.path
    let file_split = file_path.split('\/');
    file_name = file_split[2]

    let ext_split = file_name.split('\.')
    let file_ext = ext_split[1]

    if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
      User.findByIdAndUpdate(userId, {image: file_name}, (err, userUpdate) =>{
        if(!userUpdate){
          res.status(404).send({message: 'user can not update'})
        }else{
          res.status(200).send({image: file_name, user: userUpdate})
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
  let path_file = './uploads/users/'+imageFile

  fs.exists(path_file, (exist) => {
    if(exist){
      res.sendFile(path.resolve(path_file))
    }else{
      res.status(200).send({message: 'image not exist'})
    }
  })
}

function getUsers(req, res){
  let userText = req.params.userText
  let find = null
  if(!userText){

  }else{
    User.find({name: {'$regex' : userText, '$options' : 'i'}})
  }

  User.find({}, (err, users, total)=>{
    if(err){
      res.status(500).send({message: 'Error albuns'})
    }else{
      if(!users){
        res.status(404).send({message: 'Not users'})
      }else{
        return res.status(200).send({
          totalItems: total,
          users: users
        })
      }
    }
  })
}

module.exports = {
  pruebas,
  saveUser,
  loginUser,
  updateUser,
  uploadImage,
  getImageFile,
  getUsers
}
