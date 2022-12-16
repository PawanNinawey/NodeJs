const jwt = require("jsonwebtoken");
const fs = require("fs");
const jwtKey = fs.readFileSync('./common/private.key', 'utf8');

const token = (req, res, next) => {
  
  try {
    jwt.verify(req.headers.auth, jwtKey, function (err, decoded) {
      if (!err) { 
        next();
      } else {
        res.status(403).send(`Error!! ${err}`);
      }
    });
  } catch (error) {
    
  }
};

module.exports = token;
