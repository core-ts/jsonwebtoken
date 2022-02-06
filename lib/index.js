"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = require("jsonwebtoken");
function generate(payload, secret, expiresIn) {
  return new Promise((function (resolve, reject) {
    jsonwebtoken_1.sign(payload, secret, { expiresIn: expiresIn }, function (err, token) { return err ? reject(err) : resolve(token); });
  }));
}
exports.generate = generate;
exports.generateToken = generate;
function verify(token, secret) {
  return new Promise((function (resolve, reject) {
    jsonwebtoken_1.verify(token, secret, function (err, payload) { return err ? reject(err) : resolve(payload); });
  }));
}
exports.verify = verify;
exports.verifyToken = verify;
var TokenService = (function () {
  function TokenService() {
    this.generate = this.generate.bind(this);
    this.verify = this.verify.bind(this);
  }
  TokenService.prototype.generate = function (payload, secret, expiresIn) {
    return generate(payload, secret, expiresIn);
  };
  TokenService.prototype.verify = function (token, secret) {
    return verify(token, secret);
  };
  return TokenService;
}());
exports.TokenService = TokenService;
function buildJwtError(err) {
  if (err instanceof jsonwebtoken_1.TokenExpiredError) {
    return { status: 401, body: 'the token is expired' };
  }
  else if (err instanceof jsonwebtoken_1.JsonWebTokenError) {
    return { status: 401, body: 'invalid token' };
  }
  else {
    return { status: 500, body: 'Internal Server Error ' + toString(err) };
  }
}
exports.buildJwtError = buildJwtError;
function toString(err) {
  return (typeof err === 'string' ? err : JSON.stringify(err));
}
exports.toString = toString;
