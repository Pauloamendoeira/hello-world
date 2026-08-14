const API_URL = 'http://localhost:3000';
const DEMO_API_KEY = 'demo_key_project_pulse_2026';

async function loadTasks() {
  const response = await fetch(`${API_URL}/api/tasks`, {
    headers: { 'x-api-key': DEMO_API_KEY }
  });
  const tasks = await response.json();
  document.getElementById('taskList').innerHTML = tasks.map(task => `
    <div class="task">
      <strong>${task.title}</strong>
      <div>${task.notes}</div>
      <div class="status">${task.owner} · ${task.status}</div>
    </div>
  `).join('');
}

async function createTask() {
  const payload = {
    title: document.getElementById('title').value,
    owner: document.getElementById('owner').value,
    notes: document.getElementById('notes').value
  };

  await fetch(`${API_URL}/api/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': DEMO_API_KEY
    },
    body: JSON.stringify(payload)
  });
  loadTasks();
}

function logout() {
  localStorage.removeItem('user');
  location.reload();
}

loadTasks();
