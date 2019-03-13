const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET = process.env.SECRET

const makeToken = (user) => {
  const payload = {
    sub: user._id,
    name: user.username
  }
  const options = {
    expiresIn: '24h'
  }
  return jwt.sign(payload, SECRET, options);
}

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if(!token){
    res.status(401).json({msg: 'no token'});
    return;
  }
  jwt.verify(token, SECRET, (err, payload) => {
    if(err) {
      res.status(401).json({msg: 'token cannot be verified'});
      return;
    }
    // req.jwtpayload = payload;
    next();
  })
}

module.exports = { makeToken, verifyToken }