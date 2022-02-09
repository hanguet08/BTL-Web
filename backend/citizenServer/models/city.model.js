const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var citySchema = new Schema({
    cityID: {
        type: String,
        required: true
    },
    cityName: {
        type: String,
        required:true
    }
})

var City = mongoose.model('City', citySchema);
module.exports = City;