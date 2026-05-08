import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
// Get the API key from the environment
console.log(process.env.API_KEY);
// Initialize the client
const genAI = new GoogleGenerativeAI("AIzaSyCQceGvx3klDcumzkGXb_EAKUcyOkcUkHM");
console.log(process.env.API_KEY);
// Define your prompt
const prompt = "Explain the concept of artificial intelligence in simple terms.";

// Generate a response
async function run() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
  } catch (error) {
    console.error("Error:", error);
  }
}

run();