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
document.addEventListener('DOMContentLoaded', async () => {
    await initializeAI();
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
    loadResults();
});

// function to read user in database
function login() {
    if (window.location.pathname.includes('login.html')) {
    // put this in database
    const username = document.getElementById('inputid-user').value;
    const password = document.getElementById('inputid-pass').value;

    if (!username.trim() || !password.trim()) {
        alert("Please enter your username and password");
        return;
    }

    // regular expression & constraint
    const regUser = /^[a-zA-Z][a-zA-Z0-9_.]{5,25}$/;
    const regPass = /^(?=.*[a-z])(?=.*\d)[a-zA-Z0-9@#$!%*?&]{8,128}$/;

    // check if username and password are valid
    const validUser = regUser.test(username);
    const validPass = regPass.test(password);

    console.log(validUser, validPass);

    // if username and password are not valid
    if (!validUser || !validPass) {
        alert("Invalid username or password! Please try again.");
        return;
    }

    console.log("Username: ", username);
    console.log("Password: ", password);
    }
}


// function to write user in database
function signup() {
    if (window.location.pathname.includes('signup.html')) {
        // put this in database
        const email = document.getElementById('inputid-email').value;
        const username = document.getElementById('inputid-user').value;
        const password = document.getElementById('inputid-pass').value;
    
        if (!username.trim() || !password.trim()) {
            alert("Please enter your email, username, and password");
            return;
        }
    
        // regular expression & constraint
        const regEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        const regUser = /^[a-zA-Z][a-zA-Z0-9_.]{5,25}$/;
        const regPass = /^(?=.*[a-z])(?=.*\d)[a-zA-Z0-9@#$!%*?&]{8,128}$/;
    
        // check if username and password are valid
        const validEmail = regEmail.test(email);
        const validUser = regUser.test(username);
        const validPass = regPass.test(password);
    
    
        // if username and password are not valid
        const errorArr = {};
        
        // check if which one is invalid
        if(!validEmail){
            errorArr.email = 'Invalid email: ' + email;
        }

        if (!validUser){
            errorArr.username = 'Invalid username: ' + username;
        }

        if (!validPass){
            errorArr.password = 'Invalid password: ' + password;
        }

        // if there are errors or none
        if (Object.values(errorArr).length > 0){
        const values = Object.values(errorArr);

        alert(values.join("\n"));
        return;
        }

        console.log("Email: ", email);
        console.log("Username: ", username);
        console.log("Password: ", password);
        }
        window.location.href = 'login.html';
        
}

// Make functions globally available
window.login = login;
window.signup = signup;
window.submit = submit;
window.generateStudyMaterial = generateStudyMaterial;
window.myFunction = myFunction;