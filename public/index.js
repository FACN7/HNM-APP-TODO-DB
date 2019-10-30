
fetch("/check-user")
  .then(res => res.json())
  .then(info => {
    console.log(info);
    const username = info.user_name;
    console.log(info.user_id);
    let userID = info.user_id;

    fetch('/id', {
      method: 'POST',
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



