const { ref } = require("joi");
const mongoose = require("mongoose");

const explanationSchema = new mongoose.Schema({
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Questions'
    },
    explanation: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Explanation', explanationSchema);