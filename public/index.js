// We store the ID of logged in user to use it after
let userID;

// Authentication fetch, say hello to the user

fetch("/check-user")
  .then(res => res.json())
  .then(info => {
    let username = info.user_name;
    userID = info.user_id;
    var hellodiv = document.getElementById("hello");
    var hellomsg = document.createElement("div");
    hellomsg.innerHTML = `Hello, ${username}!`;
    hellomsg.className = "hello-user";
    hellodiv.appendChild(hellomsg);
    hellodiv.appendChild(logoutForm);
  });

// Fetch to show the tasks which are available for all the users.
// Creates a field to add a new task;
// creates a button for each task so the user can take a task for himself/herself

fetch("/tasks-for-all")
  .then(res => res.json())
  .then(info => {
    var taskcont = document.getElementById("add-task-container");
    var newTask = document.createElement("form");
    newTask.className = "new-task-form";
    newTask.method = "post";
    newTask.action = "/add-task";
    var newTaskField = document.createElement("input");
    newTaskField.type = "text";
    newTaskField.name = "task";
    newTaskField.placeholder = "Add your task here";
    newTaskField.className = "new-task";
    var uID = document.createElement("input");
    uID.type = "text";
    uID.name = "author_id";
    uID.value = `${userID}`;
    uID.style = "display:none";
    var submitTask = document.createElement("button");
    submitTask.innerHTML = "Submit";
    submitTask.type = "submit";
    submitTask.name = "submit-todo";
    newTask.appendChild(newTaskField);
    newTask.appendChild(uID);
    newTask.appendChild(submitTask);
    taskcont.appendChild(newTask);
    var todos = document.getElementById("tasksToDo");
    info.forEach(function(todo) {
      var li = document.createElement("li");
      var rowForm = document.createElement("form");
      rowForm.className = "row-form";
      rowForm.method = "post";
      rowForm.action = "/take-task";
      rowForm.innerText = todo.content;
      rowForm.className = "task-to-do";
      var author = document.createElement("span");
      author.innerText = ` By ${todo.user_name} `;
      author.className = "task-by";
      var inputID = document.createElement("input");
      inputID.type = "text";
      inputID.name = "user_id";
      inputID.value = `${userID}`;
      inputID.style = "display:none";
      var description = document.createElement("input");
      description.type = "text";
      description.name = "content";
      description.value = `${todo.content}`;
      description.style = "display:none";
      var takeButton = document.createElement("button");
      takeButton.innerHTML = "Take";
      takeButton.type = "submit";
      takeButton.name = "take-todo";
      rowForm.appendChild(author);
      rowForm.appendChild(takeButton);
      rowForm.appendChild(inputID);
      rowForm.appendChild(description);
      li.appendChild(rowForm);
      todos.appendChild(li);
    });
  });

// Fetch to display the tasks of the current user

fetch("/user-tasks")
  .then(res => res.json())
  .then(info => {
    var todos = document.getElementById("userTasksNotDone");
    var usertasks = info.filter(x => (x.user_id = userID));
    usertasks.forEach(function(todo) {
      var li = document.createElement("li");
      var rowForm = document.createElement("form");
      rowForm.className = "row-form";
      rowForm.method = "post";
      rowForm.action = "/complete-task";
      rowForm.innerText = todo.content;
      rowForm.className = "task-to-do";
      var inputID = document.createElement("input");
      inputID.type = "text";
      inputID.name = "user_id";
      inputID.value = `${userID}`;
      inputID.style = "display:none";
      var description = document.createElement("input");
      description.type = "text";
      description.name = "content";
      description.value = `${todo.content}`;
      description.style = "display:none";
      var takeButton = document.createElement("button");
      takeButton.innerHTML = "Done";
      takeButton.type = "submit";
      takeButton.name = "do-todo";
      rowForm.appendChild(takeButton);
      rowForm.appendChild(inputID);
      rowForm.appendChild(description);
      li.appendChild(rowForm);
      todos.appendChild(li);
    });
  });

fetch("/tasks-done")
  .then(res => res.json())
  .then(info => {
    var todos = document.getElementById("fnishedTasks");
    var usertasks = info.filter(x => (x.user_id = userID));
    usertasks.forEach(function(todo) {
      var li = document.createElement("li");
      var rowForm = document.createElement("form");
      rowForm.className = "row-form";
      rowForm.method = "post";
      rowForm.action = "/complete-task";
      rowForm.innerText = todo.content;
      rowForm.className = "task-to-do";
      li.appendChild(rowForm);
      todos.appendChild(li);
    });
  });
