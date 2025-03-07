document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    const completedTaskList = document.getElementById('completed-task-list');
    const taskStats = document.getElementById('task-stats');
    const toggleDarkModeButton = document.getElementById('toggle-dark-mode');
    const colorPicker = document.getElementById('color-picker');
    const taskColorInput = document.getElementById('task-color');
    const motivationMessage = document.getElementById('motivation-message');
    const clearTasksButton = document.getElementById('clear-tasks');
    const lightModeButton = document.getElementById('light-mode-btn');
    const darkModeButton = document.getElementById('dark-mode-btn');
    const blackModeButton = document.getElementById('black-mode-btn');
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    lightModeButton.addEventListener('click', () => {
        document.body.classList.remove('dark-mode', 'black-mode');
        document.body.classList.add('light-mode');
    });

    darkModeButton.addEventListener('click', () => {
        document.body.classList.remove('light-mode', 'black-mode');
        document.body.classList.add('dark-mode');
    });

    blackModeButton.addEventListener('click', () => {
        document.body.classList.remove('light-mode', 'dark-mode');
        document.body.classList.add('black-mode');
    });

    colorPicker.addEventListener('click', (e) => {
        if (e.target.classList.contains('color-option')) {
            document.querySelectorAll('.color-option').forEach(option => {
                option.classList.remove('selected');
            });
            e.target.classList.add('selected');
            taskColorInput.value = e.target.getAttribute('data-color');
        }
    });

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addTask();
    });

    clearTasksButton.addEventListener('click', () => {
        tasks = [];
        localStorage.removeItem('tasks');
        renderTasks();
        updateStats();
    });

    function addTask() {
        const title = document.getElementById('task-title').value;
        const description = document.getElementById('task-description').value;
        const dueDate = document.getElementById('task-due-date').value;
        const color = taskColorInput.value;

        const task = { id: Date.now(), title, description, dueDate, color, isCompleted: false };
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
        updateStats();
        taskForm.reset();
        document.querySelectorAll('.color-option').forEach(option => {
            option.classList.remove('selected');
        });
        taskColorInput.value = '#ffffff';
    }

    function renderTasks() {
        taskList.innerHTML = '';
        completedTaskList.innerHTML = '';
        tasks.forEach(task => {
            if (task.isCompleted) {
                renderCompletedTask(task);
            } else {
                renderTask(task);
            }
        });
    }

    function renderTask(task) {
        const taskItem = document.createElement('li');
        taskItem.style.backgroundColor = task.color;
        taskItem.innerHTML = `
            <div>
                <h3>${task.title}</h3>
                <p>${task.description}</p>
                <p>Due: ${new Date(task.dueDate).toLocaleDateString()}</p>
            </div>
            <div class="task-actions">
                <button class="complete-btn"><i class="fas fa-check"></i> Complete</button>
                <button class="delete-btn"><i class="fas fa-trash"></i> Delete</button>
            </div>
        `;

        taskItem.querySelector('.complete-btn').addEventListener('click', () => {
            task.isCompleted = true;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks();
            updateStats();
            showMotivationMessage();
        });

        taskItem.querySelector('.delete-btn').addEventListener('click', () => {
            tasks = tasks.filter(t => t.id !== task.id);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks();
            updateStats();
        });

        taskList.appendChild(taskItem);
    }

    function renderCompletedTask(task) {
        const taskItem = document.createElement('li');
        taskItem.style.backgroundColor = '#28a745';
        taskItem.classList.add('completed');
        taskItem.innerHTML = `
            <div>
                <h3>${task.title}</h3>
                <p>${task.description}</p>
                <p>Due: ${new Date(task.dueDate).toLocaleDateString()}</p>
                <i class="fas fa-check-circle"></i>
            </div>
            <div class="task-actions">
                <button class="incomplete-btn"><i class="fas fa-undo"></i> Incomplete</button>
            </div>
        `;

        taskItem.querySelector('.incomplete-btn').addEventListener('click', () => {
            task.isCompleted = false;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks();
            updateStats();
        });

        completedTaskList.appendChild(taskItem);
    }

    function updateStats() {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.isCompleted).length;
        const pendingTasks = totalTasks - completedTasks;

        taskStats.innerHTML = `
            <p>Total Tasks: ${totalTasks}</p>
            <p>Completed Tasks: ${completedTasks}</p>
            <p>Pending Tasks: ${pendingTasks}</p>
        `;
    }

    function showMotivationMessage() {
        motivationMessage.classList.add('show');
        setTimeout(() => {
            motivationMessage.classList.remove('show');
        }, 3000);
    }

    renderTasks();
    updateStats();
});






// تعطيل الزر الأيمن
document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
});

// تعطيل اختصارات F12 و Ctrl+Shift+I و Ctrl+Shift+J و Ctrl+U
document.addEventListener("keydown", function (e) {
    if (e.key === "F12" || 
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J")) || 
        (e.ctrlKey && e.key === "U")) {
        e.preventDefault();
    }
});