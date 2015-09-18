var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ToReadSchema = new Schema({
    lccn: {unique: true, type: String, required: true}, // This is unique key
    title: String,
    author: String,
    year_published: Date,
    began_date: Date,
    notes: String,
    img_url: String
});

module.exports = mongoose.model('ToRead', ToReadSchema);
