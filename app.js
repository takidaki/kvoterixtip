// Get DOM elements
const taskInput = document.getElementById('task-input');
const assigneeInput = document.getElementById('assignee-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');

// Create WebSocket connection
const socket = new WebSocket('ws://localhost:8080');

// Listen for WebSocket connection open
socket.addEventListener('open', event => {
  console.log('WebSocket connection established.');
});

// Listen for WebSocket messages
socket.addEventListener('message', event => {
  const data = JSON.parse(event.data);
  const action = data.action;
  const task = data.task;

  if (action === 'add') {
    addTask(task);
  } else if (action === 'accept') {
    acceptTask(task);
  } else if (action === 'delete') {
    deleteTask(task);
  }
});

// Listen for add button click
addBtn.addEventListener('click', () => {
  // Get task and assignee
  const task = taskInput.value;
  const assignee = assigneeInput.value;

  // Send WebSocket message
  const data = { action: 'add', task: { task, assignee } };
  socket.send(JSON.stringify(data));

  // Clear input fields
  taskInput.value = '';
  assigneeInput.value = '';
});

// Listen for accept button click
taskList.addEventListener('click', event => {
  const target = event.target;

  if (target.matches('.accept-btn')) {
    const task = target.previousElementSibling.textContent.trim();
    const assignee = prompt(`Who is accepting the task "${task}"?`);

    if (assignee) {
      // Send WebSocket message
      const data = { action: 'accept', task: { task, assignee } };
      socket.send(JSON.stringify(data));

      // Update button text and disable
      target.textContent = `Accepted by ${assignee}`;
      target.disabled = true;
    }
  }
});

// Listen for delete button click
taskList.addEventListener('click', event => {
  const target = event.target;

  if (target.matches('.delete-btn')) {
    const li = target.closest('li');
    const task = li.querySelector('span').textContent.trim();

    // Send WebSocket message
    const data = { action: 'delete', task: { task } };
    socket.send(JSON.stringify(data));

    // Remove task element from list
    li.parentNode.removeChild(li);
  }
});

// Add task to list
function addTask(task) {
  const li = document.createElement('li');
  li.innerHTML = `<span>${task.task} - ${task.assignee}</span>
                  <button class="accept-btn">Accept</button>
                  <button class="delete-btn">Delete</button>`;

  taskList.appendChild(li);
}

// Accept task
function acceptTask(task) {
  const li = Array.from(taskList.children).find(li => {
    const span = li.querySelector('span');
    return span.textContent.trim() === task.task;
  });

  const acceptBtn = li.querySelector('.accept-btn');
  acceptBtn.textContent = `Accepted by ${task.assignee}`;
  acceptBtn.disabled = true;
}

// Delete task
function deleteTask(task) {
  const li = Array.from(taskList.children).find(li => {
    const span = li.querySelector('span');
    return span.textContent.trim() === task.task;
  });

  li.parentNode.removeChild(li);
}
