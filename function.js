// Remove import statement since we're using script tags\
let model;

import { GenerativeModel, GoogleGenerativeAI } from "https://cdn.skypack.dev/@google/generative-ai";

async function initializeAI() {
    try {
    const genAI = new GoogleGenerativeAI( "AIzaSyD0LVIthyXuQpepTWt2eOhPxGTKAS6ET2g" );
    model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        console.log("AI initialized successfully");
    } catch (error) {
        console.error("AI initialization failed:", error);
        alert("AI initialization failed. See console for details.");
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

    if(!model) {
        alertDiv.textContent = "AI is still initializing. Please wait.";
        submitBtn.disabled = false;
        submitBtn.textContent = 'Ask SPARK';
        return; // Exit the function
    }
    
    try {
        const result = await model.generateContent(input.value);
        const response = result.response.candidates[0].content.parts[0].text;
        console.log("Raw response: ", response);
        localStorage.setItem('userQuestion', input.value);
        localStorage.setItem('sparkResponse', response);
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
        const prompt = `Create a comprehensive study guide about: ${input.value}`; // initialization

        // result of AI
        const result = await model.generateContent(prompt);

        // AI position (wag baguhin)
        const response = result.response.candidates[0].content.parts[0].text;
        console.log(response);


        localStorage.setItem('userQuestion', `STUDY GUIDE: ${input.value}`.toUpperCase());
        localStorage.setItem('sparkResponse', response);


        window.location.href = 'results.html';
    } catch (error) {
        alert("Error generating study guide: " + error.message);
    }
}

// ninja mode
function myFunction() {
    try{
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    } catch (error) { 
        console.log("Restarting Dark Mode: " + error.message);
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDark);
    }
}

function loadResults() {
    if (window.location.pathname.includes('results.html')) {
        const questionEl = document.getElementById('userQuestion');
        const responseEl = document.getElementById('sparkResponse');
        
        if (questionEl && responseEl) {
            questionEl.textContent = localStorage.getItem('userQuestion') || '';
            responseEl.textContent = localStorage.getItem('sparkResponse') || '';

            const markdownText = localStorage.getItem('sparkResponse') || '';
            responseEl.innerHTML = marked.parse(markdownText);
        }
    }
}

// Initialize on load
try{
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
}
catch (error) {
    console.log("Error: " + error.message);
    document.addEventListener('DOMContentLoaded', async () => {
        await initializeAI();
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
        }
        loadResults();
    });
}