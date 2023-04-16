// Get DOM elements
const taskInput = document.getElementById('task-input');
const assigneeInput = document.getElementById('assignee-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');

// Listen for add button click
addBtn.addEventListener('click', () => {
  // Get task and assignee
  const task = taskInput.value;
  const assignee = assigneeInput.value;

  // Create task element
  const li = document.createElement('li');
  li.innerHTML = `<span>${task} - ${assignee}</span>
                  <button class="accept-btn">Prihvati</button>
                  <button class="delete-btn">Obriši</button>`;

  // Add task element to list
  taskList.appendChild(li);

  // Send browser notification
  if ('Notification' in window) {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification(`Novi task kreiran- ${task}`, { icon: 'notification.png' });
      }
    });
  }

  // Clear input fields
  taskInput.value = '';
  assigneeInput.value = '';
});

// Listen for accept/delete button clicks using event delegation
taskList.addEventListener('click', event => {
  const target = event.target;

  if (target.matches('.accept-btn')) {
    const task = target.previousElementSibling.textContent.trim();
    const assignee = prompt(`Ko prihvata task "${task}"?`);

    if (assignee) {
      target.textContent = `Prihvatio ${assignee}`;
      target.disabled = true;
    }
  }

  if (target.matches('.delete-btn')) {
    const li = target.closest('li');
    li.parentNode.removeChild(li);
  }
});
