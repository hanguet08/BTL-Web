const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var districtSchema = new Schema({
    districtID: {
        type: String,
        required: true
    },
    districtName: {
        type: String,
        required:true
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City'
    }
});

var District = mongoose.model('District', districtSchema);
module.exports = District;
