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