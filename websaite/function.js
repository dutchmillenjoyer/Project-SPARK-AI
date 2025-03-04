// Remove import statement since we're using script tags\
//what is this for (incomplete??)
let model;
import { GenerativeModel, GoogleGenerativeAI } from "https://cdn.skypack.dev/@google/generative-ai";

async function initializeAI() {
    try {
    const genAI = new GoogleGenerativeAI("AIzaSyD0LVIthyXuQpepTWt2eOhPxGTAS6ET2g");
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        console.log("AI initialized successfully");
    } catch (error) {
        console.error("AI initialization failed:", error);
    }
}

// Define functions before making them global
async function submit() {
    const input = document.getElementById('inputid');
    const submitBtn = document.querySelector('.submit-btn');
    const alertDiv = document.getElementById('alert');
    
    if (!input.value.trim()) {
        alert("Please enter a question");
        return;
    }
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Thinking...';
    alertDiv.textContent = "Processing your question...";
    
    try {
        const result = await model.generateText(input.value);
        localStorage.setItem('userQuestion', input.value);
        localStorage.setItem('sparkResponse', result.text);
        window.location.href = 'results.html';
    } catch (error) {
        alertDiv.textContent = "Error: " + error.message;
        submitBtn.disabled = false;
        submitBtn.textContent = 'Ask SPARK';
    }
}

async function generateStudyMaterial() {
    const input = document.getElementById('inputid');
    
    if (!input.value.trim()) {
        alert("Please enter a topic for the study guide");
        return;
    }
    
    try {
        const prompt = `Create a comprehensive study guide about: ${input.value}`;
        const result = await model.generateText(prompt);
        localStorage.setItem('userQuestion', `Study Guide: ${input.value}`);
        localStorage.setItem('sparkResponse', result.text);
        window.location.href = 'results.html';
    } catch (error) {
        alert("Error generating study guide: " + error.message);
    }
}

function myFunction() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
}

function loadResults() {
    if (window.location.pathname.includes('results.html')) {
        const questionEl = document.getElementById('userQuestion');
        const responseEl = document.getElementById('sparkResponse');
        
        if (questionEl && responseEl) {
            questionEl.textContent = localStorage.getItem('userQuestion') || '';
            responseEl.textContent = localStorage.getItem('sparkResponse') || '';
        }
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', async () => {
    await initializeAI();
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
    loadResults();
});

// Make functions globally available
window.submit = submit;
window.generateStudyMaterial = generateStudyMaterial;
window.myFunction = myFunction;