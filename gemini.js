// Import mini API
import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI("AIzaSyD0LVIthyXuQpepTWt2eOhPxGTAS6ET2g");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

async function submit() {
  const input = document.getElementById('inputid').value;
  const alertDiv = document.getElementById('alert');
  
  try {
    const result = await model.generateContent(input);
    alertDiv.textContent = result.response.text();
  } catch (error) {
    alertDiv.textContent = "Error: " + error.message;
  }
}