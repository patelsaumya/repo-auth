const passport = require('passport');
const jwt = require('jsonwebtoken');
const encryptConfig = require('../../config/encrypt.config');

function test(req, res, next) {
  console.log(req);
  res.json({data: 'Hello World'});
}

module.exports = {
  test
}
