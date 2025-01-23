const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    questionNumber: {
        type: Number,
        unique: true, // Ensure uniqueness
        required: true,
    },
    questionText: {
        type: String,
        required: [true, "Question text is required"],
        trim: true,
    },
    option1: {
        type: String,
        required: [true, "Option 1 is required"],
        trim: true,
    },
    option2: {
        type: String,
        required: [true, "Option 2 is required"],
        trim: true,
    },
    option3: {
        type: String,
        default: "empty",
        trim: true,
    },
    option4: {
        type: String,
        default: "empty",
        trim: true,
    },
    correctChoice: {
        type: String,
        required: [true, "Correct choice is required"],
        enum: ["option1", "option2", "option3", "option4"],
    },
});

questionSchema.pre("save", async function (next) {
    if (!this.isNew) return next();

    const lastQuestion = await this.constructor.findOne({}).sort({ questionNumber: -1 });
    this.questionNumber = lastQuestion ? lastQuestion.questionNumber + 1 : 1;
    next();
});

module.exports = mongoose.model("Questions", questionSchema);
