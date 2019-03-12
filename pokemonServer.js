const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Pokemon = require('./pokes');
const server = express();
require('dotenv').config();

// const User = require('./UserSchema');
// const jwt = require('jsonwebtoken');

server.use(express.json());

const uri = process.env.MONGO_URI;
mongoose.connect(uri);

server.listen(5000, () => {
  console.log('server listening on port 5000');
})

//routes:
  //register
  //login
  //logout
  //pokemon- get ALL pokemon
  //pokemon/{:name}- get 1 by name

server.get('/', (req, res) => {
  res.status(200).json({msg: 'hello world'});
})

server.get('/pokemon', (req, res) => {
  Pokemon.find({}, (err, pokes) => {
    if(err) {
      res.status(500).json(err);
      return;
    }
    res.json(pokes);
  })

  //returns array
  // Pokemon.find()
  //   .then(pokes => {
  //     res.status(200).json(pokes);
  //     // console.log(pokemon.character[0]);
  //   })
  //   .catch( err => {
  //     res.status(500).json(err);
  //   })
})

server.get('/pokemon/:id', (req, res) => {
  const id = req.params.id;
  Pokemon.findById(id, (err, pokemon) => {
    if(err) res.sendStatus(500);
    if(!id) return res.status(500).json({msg: 'ID not found'});
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