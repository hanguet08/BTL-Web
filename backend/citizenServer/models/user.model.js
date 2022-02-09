const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    password: String,
    roles:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      }
    ],
    createBy: String,
    timeStart: Date,
    timeFinish: Date,
    city:
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City"
    },
    district: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "District"
    },
    ward: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ward"
    },
    village: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Village"
    },
    active: Number,
    complete: Number,
  })
);

module.exports = User;