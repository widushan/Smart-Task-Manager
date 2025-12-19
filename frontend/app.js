const API_BASE = '/api';
let token = localStorage.getItem('token');
let user_id = localStorage.getItem('user_id');

document.addEventListener('DOMContentLoaded', () => {
    if (token) {
        showDashboard();
    } else {
        showAuth('login');
    }

    // Auth Listeners
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);

    // Task Listeners
    document.getElementById('addTaskBtn').addEventListener('click', addTask);
});

function showAuth(type) {
    document.getElementById('authSection').style.display = 'block';
    document.getElementById('dashboardSection').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'none';

    document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
    if (type === 'login') {
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('registerForm').style.display = 'none';
        document.querySelector('.tab:nth-child(1)').classList.add('active');
    } else {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('registerForm').style.display = 'block';
        document.querySelector('.tab:nth-child(2)').classList.add('active');
    }
}

function showDashboard() {
    document.getElementById('authSection').style.display = 'none';
    document.getElementById('dashboardSection').style.display = 'block';
    document.getElementById('logoutBtn').style.display = 'block';
    loadTasks();
}

async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        
        if (res.ok) {
            token = data.token;
            user_id = data.user_id;
            localStorage.setItem('token', token);
            localStorage.setItem('user_id', user_id);
            showDashboard();
        } else {
            alert(data.message);
        }
    } catch (err) {
        alert('Login failed');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;

    try {
        const res = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        
        if (res.ok) {
            alert('Registration successful! Please login.');
            showAuth('login');
        } else {
            alert(data.message);
        }
    } catch (err) {
        alert('Registration failed');
    }
}

function handleLogout() {
    token = null;
    user_id = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    showAuth('login');
}

async function loadTasks() {
    const res = await fetch(`${API_BASE}/tasks/tasks`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.status === 401) return handleLogout();
    
    const tasks = await res.json();
    renderTasks(tasks);
}

function renderTasks(tasks) {
    const todoList = document.getElementById('todoList');
    const progressList = document.getElementById('progressList');
    const doneList = document.getElementById('doneList');

    todoList.innerHTML = '';
    progressList.innerHTML = '';
    doneList.innerHTML = '';

    tasks.forEach(task => {
        const card = createTaskCard(task);
        if (task.status === 'To-Do') todoList.appendChild(card);
        else if (task.status === 'In-Progress') progressList.appendChild(card);
        else if (task.status === 'Done') doneList.appendChild(card);
    });
}

function createTaskCard(task) {
    const div = document.createElement('div');
    div.className = 'task-card';
    div.innerHTML = `
        <span>${task.title}</span>
        <div class="task-controls">
            ${task.status !== 'To-Do' ? '<button onclick="updateStatus(' + task.id + ', \'prev\')">⬅️</button>' : ''}
            <button onclick="deleteTask(${task.id})">🗑️</button>
            ${task.status !== 'Done' ? '<button onclick="updateStatus(' + task.id + ', \'next\')">➡️</button>' : ''}
        </div>
    `;
    return div;
}

async function addTask() {
    const input = document.getElementById('newTaskInput');
    const title = input.value;
    if (!title) return;

    await fetch(`${API_BASE}/tasks/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, status: 'To-Do' })
    });
    input.value = '';
    loadTasks();
}

async function deleteTask(id) {
    if(!confirm('Delete this task?')) return;
    await fetch(`${API_BASE}/tasks/tasks/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    loadTasks();
}

async function updateStatus(id, direction) {
    // We need to know current status, but for simplicity let's just cycle or I can check the DOM parent?
    // Better to fetch current task or just assume logic.
    // Hack for MVP: simple logic based on column would require finding the element.
    // Let's refactor createTaskCard to pass the current status string.
    
    // Instead of complex logic, let's just use strict transitions:
    // To-Do -> In-Progress -> Done
    
    // Changing approach: render button with explicit target status would be safer but "next/prev" is intuitive.
    // I'll make a quick helper to find the task in the local list or just re-fetch.
    // Since I don't have local state of tasks easily accessible in updateStatus without passing it...
    // I will modify `createTaskCard` to pass the status string.
}

// Redefine to use closure or pass params
window.updateStatus = async (id, direction) => {
    // This is tricky without knowing current status. 
    // Let's re-fetch the single task or just implementation is:
    // GET task -> calc new status -> PUT.
    // OR simpler: just pass the CURRENT status in the onclick.
};

// Re-write createTaskCard to fix this:
function createTaskCard(task) {
    const div = document.createElement('div');
    div.className = 'task-card';
    
    let leftBtn = '';
    let rightBtn = '';
    
    if (task.status === 'In-Progress') leftBtn = `<button onclick="changeStatus(${task.id}, 'To-Do')">⬅️</button>`;
    if (task.status === 'Done') leftBtn = `<button onclick="changeStatus(${task.id}, 'In-Progress')">⬅️</button>`;
    
    if (task.status === 'To-Do') rightBtn = `<button onclick="changeStatus(${task.id}, 'In-Progress')">➡️</button>`;
    if (task.status === 'In-Progress') rightBtn = `<button onclick="changeStatus(${task.id}, 'Done')">➡️</button>`;

    div.innerHTML = `
        <span>${task.title}</span>
        <div class="task-controls">
            ${leftBtn}
            <button onclick="deleteTask(${task.id})">🗑️</button>
            ${rightBtn}
        </div>
    `;
    return div;
}

window.changeStatus = async (id, newStatus) => {
    await fetch(`${API_BASE}/tasks/tasks/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
    });
    loadTasks();
}

window.deleteTask = deleteTask; // Ensure global scope access
