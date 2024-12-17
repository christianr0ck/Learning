const form = document.getElementById('learning-form');
const logsContainer = document.getElementById('logs');
const searchInput = document.getElementById('search');

let logs = JSON.parse(localStorage.getItem('logs')) || [];

function displayLogs(filter = '') {
    logsContainer.innerHTML = '';
    logs.filter(log => log.topic.includes(filter) || log.description.includes(filter))
        .forEach((log, index) => {
            const logDiv = document.createElement('div');
            logDiv.classList.add('log');
            logDiv.innerHTML = `
                <p><strong>Topic:</strong> ${log.topic}</p>
                <p><strong>Date:</strong> ${log.date}</p>
                <p>${log.description}</p>
                <button onclick="deleteLog(${index})">Delete</button>
            `;
            logsContainer.appendChild(logDiv);
        });
}

function addLog(e) {
    e.preventDefault();
    const topic = document.getElementById('topic').value;
    const date = document.getElementById('date').value;
    const description = document.getElementById('description').value;
    logs.push({ topic, date, description });
    localStorage.setItem('logs', JSON.stringify(logs));
    displayLogs();
    form.reset();
}

function deleteLog(index) {
    logs.splice(index, 1);
    localStorage.setItem('logs', JSON.stringify(logs));
    displayLogs();
}

form.addEventListener('submit', addLog);
searchInput.addEventListener('input', () => displayLogs(searchInput.value));

window.onload = () => displayLogs();

document.getElementById('learning-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const fileInput = document.getElementById('file');
    const file = fileInput.files[0];

    let fileLink = '';
    if (file) {
        fileLink = URL.createObjectURL(file); // Creates a temporary link to the file
    }

    const log = {
        topic: document.getElementById('topic').value,
        date: document.getElementById('date').value,
        description: document.getElementById('description').value,
        file: fileLink,
    };

    logs.push(log);
    localStorage.setItem('logs', JSON.stringify(logs));
    displayLogs();
});

function displayLogs() {
    const logsContainer = document.getElementById('logs');
    logsContainer.innerHTML = '';

    logs.forEach((log) => {
        const logDiv = document.createElement('div');
        logDiv.classList.add('log');
        logDiv.innerHTML = `
            <p><strong>Topic:</strong> ${log.topic}</p>
            <p><strong>Date:</strong> ${log.date}</p>
            <p>${log.description}</p>
            ${log.file ? `<img src="${log.file}" width="150" />` : ''}
        `;
        logsContainer.appendChild(logDiv);
    });
}

window.onload = displayLogs;

const form = document.getElementById('learning-form');
const logsContainer = document.getElementById('logs');

// GitHub API Configuration
const githubUsername = 'your-username'; // Replace with your GitHub username
const repoName = 'Learning'; // Replace with your repository name
const branch = 'main'; // Replace with your branch name
const token = 'YOUR_GITHUB_TOKEN'; // Replace with your GitHub token

async function saveToGitHub(content, fileName) {
    const apiUrl = `https://api.github.com/repos/${githubUsername}/${repoName}/contents/${fileName}`;
    const message = `Add new log: ${fileName}`;

    // Check if file already exists (to update instead of create)
    const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    });

    const data = await response.json();
    const fileSha = response.ok ? data.sha : null;

    // Prepare request body
    const body = {
        message: message,
        content: btoa(content), // Encode content in Base64
        branch: branch
    };

    if (fileSha) body.sha = fileSha; // Add SHA if file exists (for updates)

    // Create or update the file
    const saveResponse = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    if (saveResponse.ok) {
        alert('Log saved to GitHub!');
        displayLogs();
    } else {
        alert('Error saving to GitHub!');
    }
}

form.addEventListener('submit', function (e) {
    e.preventDefault();

    const topic = document.getElementById('topic').value;
    const date = document.getElementById('date').value;
    const description = document.getElementById('description').value;

    const fileName = `logs/${date}-${topic.replace(/\s+/g, '-')}.txt`;
    const content = `Topic: ${topic}\nDate: ${date}\nDescription: ${description}`;

    saveToGitHub(content, fileName);
});

function displayLogs() {
    logsContainer.innerHTML = `<p>Logs are saved to your GitHub repository!</p>`;
}

const githubUsername = 'christianr0ck'; 
const repoName = 'Learning'; 
const branch = 'main'; 
const token = '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'; 
