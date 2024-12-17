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
