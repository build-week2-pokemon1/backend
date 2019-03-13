const express = require('express');
const mongoose = require('mongoose');
const Monster = require('./monsters');
const User = require('./users');
const path = require('path');
const server = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { makeToken, verifyToken } = require('./AuthFns');

require('dotenv').config({path: '.env'});

const PORT = process.env.PORT || 8000;

server.use(express.json());
server.use(cors());

const uri = process.env.MONGO_URI;
mongoose.connect(uri, { useNewUrlParser: true }, { useMongoClient: true });

server.listen(PORT, () => {
  console.log('server listening');
})

server.get('/', (req, res) => {
  return res.status(200).json({msg: "hello!"});
})

//register
server.post('/api/register', (req, res) => {
  const userData = req.body;
  const newUser = new User(userData);
  newUser.save()
    .then(user => {
      const token = makeToken(user)
      res.status(200).json({user, token})
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
            const token = makeToken(user)
            res.status(200).json({username, token})
          } else {
            res.status(401).json({msg: 'login failed'})
          }
        })
    })
    .catch(err => res.status(500).json({msg: 'cannot get user'}))
})

//logout- handled on frontend

//pokemon- get ALL pokemon
//verifyToken
server.get('/pokemon', verifyToken, (req, res) => {
  Monster.find({}, (err, monsters) => {
    if(err) {
      res.status(500).json(err);
      return;
    }
    res.json(monsters);
  })
})

//pokemon/{:id}- get 1 by id
//verifyToken
server.get('/pokemon/:id', verifyToken, (req, res) => {
  const id = req.params.id;
  Monster.findById(id, (err, monster) => {
    if(err) res.sendStatus(500);
    if(!id) return res.status(500).json({msg: 'Pokemon not found'});
    res.json(monster);
  })
})