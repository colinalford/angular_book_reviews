var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReviewedSchema = new Schema({
    lccn: {unique: true, type: String, required: true}, // This is unique key
    title: String,
    author: String,
    year_published: Date,
    began_date: Date,
    finished_date: Date,
    summary: String,
    notes: String,
    rating: Number,
    review: String
});

module.exports = mongoose.model('Reviewed', ReviewedSchema);
