const socket = io();

// DOM elements
const taskForm = document.querySelector('#task-form');
const taskNameInput = document.querySelector('#task-name');
const taskList = document.querySelector('#task-list');
const clearCompletedButton = document.querySelector('#clear-completed');

// local array of tasks
let tasks = [];

// handle new task event from server
socket.on('new task', task => {
	tasks.push(task);
	renderTasks();
});

// handle remove task event from server
socket.on('remove task', id => {
	const index = tasks.findIndex(task => task.id === id);
	if (index !== -1) {
		tasks.splice(index, 1);
		renderTasks();
	}
});

// handle update task event from server
socket.on('update task', updatedTask => {
	const task = tasks.find(task => task.id === updatedTask.id);
	if (task) {
		task.name = updatedTask.name;
		task.completed = updatedTask.completed;
		task.assignedTo = updatedTask.assignedTo;
		renderTasks();
	}
});

// add new task to list
function addTask(name) {
	const task = {
		id: Date.now(),
		name: name,
		completed: false,
		assignedTo: null
	};
	tasks.push(task);
	socket.emit('new task', task);
	taskNameInput.value = '';
	renderTasks();
}

// remove task from list
function removeTask(id) {
	const index = tasks.findIndex(task => task.id === id);
	if (index !== -1) {
		tasks.splice(index, 1);
		socket.emit('remove task', id);
		renderTasks();
	}
}

// toggle task completion status
function toggleTaskCompletion(id) {
	const task = tasks.find(task => task.id === id);
	if (task) {
		task.completed = !task.completed;
		socket.emit('update task', task);
		renderTasks();
	}
}

// assign task to user
function assignTask(id, assignedTo) {
	const task = tasks.find(task => task.id === id);
	if (task) {
		task.assignedTo = assignedTo;
		socket.emit('update task', task);
		renderTasks();
	}
}

// render tasks on page
function renderTasks() {
	taskList.innerHTML = '';
	tasks.forEach(task => {
		const listItem = document.createElement('li');
		listItem.classList.add('task');
		if (task.completed) {
			listItem.classList.add('completed');
		}
		listItem.innerHTML = `
			<span class="task-name ${task.completed ? 'completed' : ''}">
				${task.name}
			</span>
			<div class="task-actions">
				<span class="assigned-to">${task.assignedTo ? `Assigned to ${task.assignedTo}` : 'Not assigned'}</span>
				<button class="assign-task">Assign</button>
				<button class="complete-task">${task.completed ? 'Undo' : 'Done'}</button>
				<button class="remove-task">Delete</button>
			</div>
		`;
		const assignButton = listItem.querySelector('.assign-task');
		const completeButton = listItem.querySelector('.complete-task');
		const removeButton = listItem.querySelector('.remove-task');
		assignButton.addEventListener('click', () => {
			const assignedTo = prompt('Assign task to:');
			if (assignedTo) {
				assignTask(task.id, assignedTo);
			}
		});
		completeButton.addEventListener('click', () => {
			toggleTaskCompletion(task.id);
		});
		removeButton.addEventListener('click', () => {
			removeTask(task.id);
		});

    taskList.appendChild(listItem);
});
}

// handle form submission
taskForm.addEventListener('submit', event => {
event.preventDefault();
const taskName = taskNameInput.value.trim();
if (taskName) {
addTask(taskName);
}
});

// clear completed tasks
clearCompletedButton.addEventListener('click', () => {
tasks = tasks.filter(task => !task.completed);
renderTasks();
});

// initial render of tasks
renderTasks();

// request permission for notifications
if (Notification.permission === 'granted') {
  const notification = new Notification('Novi Task kreiran', {
    body: 'novi task je kreiran',
    icon: 'notification.png'
  });
}

