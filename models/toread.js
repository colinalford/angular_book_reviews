var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ToReadSchema = new Schema({
    isbn: String, // This is unique key
    title: String,
    author: String,
    year_published: String,
    began_date: Date,
    notes: String,
    img_url: String
});

module.exports = mongoose.model('ToRead', ToReadSchema);
