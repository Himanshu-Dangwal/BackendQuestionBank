const Questions = require("../models/Questions")

module.exports.getQuestions = async function (req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    try {
        const skip = (page - 1) * limit;

        const questions = await Questions.find()
            .skip(skip)
            .limit(limit)
            .sort({ questionNumber: 1 });

        const totalQuestions = await Questions.countDocuments();

        res.status(200).json({
            message: "success",
            questions,
            totalQuestions,
            totalPages: Math.ceil(totalQuestions / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching questions from the server" });
    }
};



module.exports.createQuestion = async function (req, res) {
    const { questionNumber, questionText, option1, option2, option3 = "empty", option4 = "empty", correctChoice } = req.body;

    const validChoices = ["option1", "option2", "option3", "option4"];
    if (!validChoices.includes(correctChoice)) {
        return res.status(400).json({ message: "Invalid correctChoice value. Must be one of 'option1', 'option2', 'option3', or 'option4'." });
    }

    const newQuestion = new Questions({ questionNumber, questionText, option1, option2, option3, option4, correctChoice });

    try {
        const savedQuestion = await newQuestion.save();
        res.status(201).json({
            message: "Question created successfully",
            question: savedQuestion,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating the question", error: error.message });
    }
};







