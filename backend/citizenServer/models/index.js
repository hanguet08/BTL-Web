const mongoose = require("mongoose");
const User = require("./user.model");
mongoose.Promise = global.Promise;

const db = {};

db.user = require("./user.model");
db.role = require("./role.model");
db.city = require("./city.model")
db.district = require("./district.model")
db.ward = require("./ward.model")
db.village = require("./village.model")
db.citizen = require("./citizen.model")

db.ROLES = ["A1", "A2", "A3", "B1", 'B2'];



module.exports = db;

