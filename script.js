const form = document.getElementById('learning-form');
const logsContainer = document.getElementById('logs');

// GitHub API Configuration
const githubUsername = 'christianr0ck'; // Replace with your GitHub username
const repoName = 'Learning'; // Replace with your repository name
const branch = 'main'; // Branch name (e.g., main)
const token = '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'; // Replace with your GitHub personal access token

// Save Log to GitHub
async function saveToGitHub(content, fileName) {
    const apiUrl = `https://api.github.com/repos/${githubUsername}/${repoName}/contents/logs/${fileName}`;
    const message = `Add log: ${fileName}`;

    // Check if file exists
    const response = await fetch(apiUrl, {
        headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    });

    const fileSha = response.ok ? (await response.json()).sha : null;

    const body = {
        message: message,
        content: btoa(content), // Base64 encode the content
        branch: branch
    };

    if (fileSha) body.sha = fileSha; // Add SHA if updating an existing file

    const saveResponse = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    if (saveResponse.ok) {
        alert('Log saved successfully to GitHub!');
        fetchLogsFromGitHub(); // Refresh logs
    } else {
        alert('Failed to save log. Check your GitHub configuration.');
    }
}

// Fetch Logs from GitHub
async function fetchLogsFromGitHub() {
    const apiUrl = `https://api.github.com/repos/${githubUsername}/${repoName}/contents/logs`;

    const response = await fetch(apiUrl, {
        headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json`
        }
    });

    logsContainer.innerHTML = ''; // Clear previous logs

    if (response.ok) {
        const files = await response.json();
        for (const file of files) {
            const fileContent = await fetch(file.download_url);
            const text = await fileContent.text();

            // Display log entry
            const logDiv = document.createElement('div');
            logDiv.classList.add('log');
            logDiv.innerHTML = `<pre>${text}</pre>`;
            logsContainer.appendChild(logDiv);
        }
    } else {
        logsContainer.innerHTML = `<p>No logs found. Start by adding some!</p>`;
    }
}

// Handle Form Submission
form.addEventListener('submit', function (e) {
    e.preventDefault();

    const topic = document.getElementById('topic').value;
    const date = document.getElementById('date').value;
    const description = document.getElementById('description').value;

    const fileName = `${date}-${topic.replace(/\s+/g, '-')}.txt`; // File name format
    const content = `Topic: ${topic}\nDate: ${date}\nDescription: ${description}`;

    saveToGitHub(content, fileName);
});

// Load Logs on Page Load
window.onload = fetchLogsFromGitHub;
