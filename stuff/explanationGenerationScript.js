const mongoose = require("mongoose")
const Questions = require("../models/Questions")
const Explanation = require("../models/Explanation")
const dotenv = require("dotenv")
dotenv.config()
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const dbUrl = process.env.PROD_URI || "mongodb://localhost:27017/"

async function connectToMongo() {
    mongoose.set("strictQuery", false);
    try {
        await mongoose.connect(dbUrl);
        console.log("Successfully connected to MongoDB database");
        console.log("Connected to database:", mongoose.connection.name); // Logs the database name
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
}


connectToMongo().catch(err => console.log("Some error"));

async function getExplanation(q) {

    try {
        const prompt = `
        You are a Nursing Expert.

        Given the following multiple choice question:

        "${q.questionText}"

        Options:
        A. ${q.option1}
        B. ${q.option2}
        C. ${q.option3 && q.option3 !== "empty" ? q.option3 : "N/A"}
        D. ${q.option4 && q.option4 !== "empty" ? q.option4 : "N/A"}


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


const fetchQuestions = async () => {
    const allQuestions = await Questions.find({});
    return allQuestions;
}

async function generateExplanation() {
    const allQuestions = await fetchQuestions();
    for (let i = 0; i < allQuestions.length; i++) {
        try {
            const question = allQuestions[i];
            const questionId = question._id;
            const explanation = await getExplanation(question);
            const newExplanationToAdd = new Explanation({
                questionId,
                explanation,
            });
            await newExplanationToAdd.save();
        } catch (err) {
            console.error(`Error processing question ${i}:`, err);
        }
    }
}

async function deleteMany() {
    try {
        const result = await Explanation.deleteMany({});
        console.log(`Deleted ${result.deletedCount} explanation(s)`);
    } catch (error) {
        console.error("Error deleting explanations:", error);
    } finally {
        mongoose.connection.close();
    }
}

deleteMany();
