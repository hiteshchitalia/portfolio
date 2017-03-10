var mongoose = require("mongoose");

var feedbackSchema = mongoose.Schema({
    feedbackText: String,
    inserted : { type: Date, default: Date.now }
});

module.exports = mongoose.model("Feedback", feedbackSchema);