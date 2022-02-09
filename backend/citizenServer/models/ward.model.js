const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var wardSchema = new Schema({
    wardID: {
        type: String,
        required: true
    },
    wardName: {
        type: String,
        required:true
    },
    district: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'District'
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City'

    }
});

var Ward = mongoose.model('Ward', wardSchema);
module.exports = Ward;
