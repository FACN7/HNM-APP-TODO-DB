fetch("/check-user")
  .then(res => res.json())
  .then(info => {
    console.log(info);
    const username = info.user_name;
    console.log(info.user_id);
    let userID = info.user_id;

    fetch("/id", {
      method: "POST",
      body: userID
    }).catch(error => {
      console.log(error);
    });

    var hellodiv = document.getElementById("hello");
    var hellomsg = document.createElement("div");
    hellomsg.innerHTML = `Hello, ${username}! Your ID is ${userID}`;
    hellodiv.appendChild(hellomsg);
    var logoutForm = document.createElement("form");
    logoutForm.className = "logout-form";
    logoutForm.method = "post";
    logoutForm.action = "/log-out";
    var inputID = document.createElement("input");
    var logoutButton = document.createElement("button");
    logoutButton.type = "submit";
    logoutButton.name = "submit-return";
    logoutButton.innerText = "Log Out";
    logoutForm.appendChild(logoutButton);
    hellodiv.appendChild(logoutForm);
  });

fetch("/tasks-for-all")
  .then(res => res.json())
  .then(info => {
    var todos = document.getElementById("tasksToDo");
    console.log(info);
    info.forEach(function(todo) {
      var li = document.createElement("li");
      var rowForm = document.createElement("form");
      rowForm.className = "row-form";
      rowForm.method = "post";
      rowForm.action = "/take-task";
      rowForm.innerText = todo.content;
      rowForm.className = "task-to-do";
      var author = document.createElement("span");
      author.innerText = `By ...`;
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
      takeButton.innerHTML = ">>";
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
