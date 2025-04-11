const Explanation = require("../models/Explanation");
const Questions = require("../models/Questions");
const dotenv = require("dotenv")
dotenv.config()
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });


console.log("Using API key:", process.env.GEMINI_API_KEY ? "✅ Exists" : "❌ Missing");


async function getExplanation(q) {

    try {
        const prompt = `
        You are a Nursing Expert.

        Given the following multiple choice question:

        "${q.questionText}"

        Options:
        A. ${q.option1}
        B. ${q.option2}
        C. ${q.option3 !== "empty" ? q.option3 : "N/A"}
        D. ${q.option4 !== "empty" ? q.option4 : "N/A"}

        The correct answer is: ${q[q.correctChoice]}

        Explain clearly why this is the correct choice. If applicable, briefly mention why the other options are incorrect.
        `;

        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("Error fetching hints from Gemini API:", error);
        return "Error fetching hints. Please try again later.";
    }
}

module.exports.explanationController = async (req, res) => {
    const { questionId } = req.body;
    console.log(questionId)
    const explanationResponse = await Explanation.findOne({ questionId });

    if (explanationResponse) {
        return res.status(201).json({ explanation: explanationResponse.explanation });
    }

    const question = await Questions.findById(questionId);
    const explanation = await getExplanation(question);
    const newExplanationToAdd = new Explanation({
        questionId,
        explanation,
    });
    await newExplanationToAdd.save();
    res.status(201).json({ explanation: explanation });
};
