const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Pokemon = require('./pokes');
const User = require('./users');
const server = express();
require('dotenv').config();

// const jwt = require('jsonwebtoken');

server.use(express.json());

const uri = process.env.MONGO_URI;
mongoose.connect(uri);

server.listen(8000, () => {
  console.log('server listening on port 8000');
})

server.get('/', (req, res) => {
  res.status(200).json({msg: 'hello world'});
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

//logout


//pokemon- get ALL pokemon
server.get('/pokemon', (req, res) => {
  Pokemon.find({}, (err, pokes) => {
    if(err) {
      res.status(500).json(err);
      return;
    }
    res.json(pokes);
  })
})

//pokemon/{:name}- get 1 by name
server.get('/pokemon/:name', (req, res) => {
  const name = req.params.name;
  Pokemon.findById(name, (err, pokemon) => {
    if(err) res.sendStatus(500);
    if(!name) return res.status(500).json({msg: 'Pokemon not found'});
    res.json(pokemon);
    console.log(pokemon);
  })
})

server.post('/pokemon', (req, res) => {
  const newPokemon = new Pokemon(req.body);
  newPokemon.save((err, newPokemon) => {
    if(err) {
      res.status(500).json({msg: "couldn't save pokemon"});
      return;
    }
    res.status(200).json(newPokemon);
    console.log(newPokemon);
  })
})