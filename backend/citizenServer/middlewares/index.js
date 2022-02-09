const authJwt = require("./authJwt");
const verifySignUp = require("./verifySignUp");
const checkCity = require("./checkCity");
const checkDistrict = require("./checkDistrict");
const checkWard = require("./checkWard");
const checkVillage = require("./checkVillage");
const checkCitizen = require("./checkCitizen")

module.exports = {
  authJwt,
  verifySignUp,
  checkCitizen,
  checkCity,
  checkDistrict,
  checkVillage,
  checkWard
};
