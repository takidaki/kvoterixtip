let tasks = [];

function addTask() {
  const taskName = document.getElementById("task-name").value;
  tasks.push({name: taskName, acceptedBy: null, done: false});
  renderTasks();
}

function acceptTask(taskIndex, user) {
  tasks[taskIndex].acceptedBy = user;
  renderTasks();
}

function markTaskDone(taskIndex) {
  tasks[taskIndex].done = true;
  renderTasks();
}

function removeTask(taskIndex) {
  tasks.splice(taskIndex, 1);
  renderTasks();
}

function renderTasks() {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const listItem = document.createElement("li");
    const taskText = document.createTextNode(task.name);
    listItem.appendChild(taskText);

    if (task.acceptedBy) {
      const acceptedBy = document.createElement("span");
      acceptedBy.innerText = ` Prihvatio ${task.acceptedBy}`;
      listItem.appendChild(acceptedBy);
    } else {
      const acceptButton = document.createElement("button");
      acceptButton.innerText = "Prihvatam";
      acceptButton.addEventListener("click", () => {
        const user = prompt("Unesi ime:");
        acceptTask(index, user);
      });
      listItem.appendChild(acceptButton);
    }

    if (task.done) {
      const done = document.createElement("span");
      done.innerText = " - uradjeno";
      listItem.appendChild(done);
    } else {
      const doneButton = document.createElement("button");
      doneButton.innerText = " Uradjeno";
      doneButton.addEventListener("click", () => {
        markTaskDone(index);
      });
      listItem.appendChild(doneButton);
    }

    const removeButton = document.createElement("button");
    removeButton.innerText = " Izbrisi";
    removeButton.addEventListener("click", () => {
      removeTask(index);
    });
    listItem.appendChild(removeButton);

    taskList.appendChild(listItem);
  });

  // Show browser notification
  if (Notification.permission === 'granted') {
    const notification = new Notification('Task napravljen', {
      body: li.textContent,
      icon: 'notification.png'
    });
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  createTask();
});

// Request permission for browser notifications
if (Notification.permission !== 'granted') {
  Notification.requestPermission();
}

