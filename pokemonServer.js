const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Monster = require('./monsters');
const User = require('./users');
const path = require('path');
const server = express();

require('dotenv').config({path: '.env'});

const PORT = process.env.PORT || 8000;

// const jwt = require('jsonwebtoken');

server.use(express.json());

const uri = process.env.MONGO_URI;
mongoose.connect(uri, {useNewUrlParser: true });

server.listen(PORT, () => {
  console.log('server listening');
})

//register
server.post('/api/register', (req, res) => {
  const userData = req.body;
  const newUser = new User(userData);
  newUser.save()
    .then(user => {
      res.status(200).json(user)
    })
    .catch(err => res.sendStatus(500))
})

//login
//add jwt
server.put('/api/login', (req, res) => {
  const { username, password} = req.body;
  User.findOne({username})
    .then( user => {
      user.comparePasswords(password)
        .then(isMatch => {
          if(isMatch) {
            res.status(200).json({msg: 'login successful'})
          } else {
            res.status(401).json({msg: 'login failed'})
          }
        })
    })
    .catch(err => res.status(500).json({msg: 'cannot get user'}))
})

//logout- handled on frontend

//pokemon- get ALL pokemon
server.get('/pokemon', (req, res) => {
  Monster.find({}, (err, monsters) => {
    if(err) {
      res.status(500).json(err);
      return;
    }
    res.json(monsters);
  })
})

//pokemon/{:id}- get 1 by id
server.get('/pokemon/:id', (req, res) => {
  const id = req.params.id;
  Monster.findById(id, (err, monster) => {
    if(err) res.sendStatus(500);
    if(!id) return res.status(500).json({msg: 'Pokemon not found'});
    res.json(monster);
  })
})