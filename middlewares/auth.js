'use strict'

let jwt = require('jwt-simple')
let moment = require('moment')
let secret = 'secret_key_proyect'

exports.ensureAuth = function(req, res, next){
  if(!req.headers.authorization){
    return res.status(403).send({message: 'Request without auth header'})
  }

  let token = req.headers.authorization.replace(/['"]+/g, '')

  try {
    let payload = jwt.decode(token, secret)
    if(payload.exp <= moment().unix()){
      res.status(401).send({message: 'token expired'})
    }
  } catch (ex) {
    console.log(ex)
    return res.status(404).send({message: 'token is not valid'})
  }

  req.user = jwt.decode(token, secret)
  next()
}
