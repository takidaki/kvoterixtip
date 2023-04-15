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
      acceptedBy.innerText = ` Accepted by ${task.acceptedBy}`;
      listItem.appendChild(acceptedBy);
    } else {
      const acceptButton = document.createElement("button");
      acceptButton.innerText = "Accept";
      acceptButton.addEventListener("click", () => {
        const user = prompt("Enter your name:");
        acceptTask(index, user);
      });
      listItem.appendChild(acceptButton);
    }

    if (task.done) {
      const done = document.createElement("span");
      done.innerText = " - Done";
      listItem.appendChild(done);
    } else {
      const doneButton = document.createElement("button");
      doneButton.innerText = " Done";
      doneButton.addEventListener("click", () => {
        markTaskDone(index);
      });
      listItem.appendChild(doneButton);
    }

    const removeButton = document.createElement("button");
    removeButton.innerText = " Remove";
    removeButton.addEventListener("click", () => {
      removeTask(index);
    });
    listItem.appendChild(removeButton);

    taskList.appendChild(listItem);
  });
}
