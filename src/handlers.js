const http = require("http");
const bcrypt = require("bcryptjs");
const pg = require("pg");
const { readFile } = require("fs");
const fs = require("fs");
const path = require("path");
const queryString = require("querystring");
const { parse } = require("cookie");
const { sign, verify } = require("jsonwebtoken");
const userCreds = require("./queries/check_user");
const insertTask = require("./queries/insert_new_task");
const takenTask = require("./queries/update_task_to_taken");
const availableTasks = require("./queries/available_tasks");
const userTasks = require("./queries/task_list_byUser");
const addUser = require("./queries/add_user");

const SECRET = "kjshfcwahbfcjawbsf";

const serverError = (err, response) => {
  response.writeHead(500, "Content-Type:text/html");
  response.end("<h1>Sorry, there was a problem loading the homepage</h1>");
  console.log(err);
};

const homeHandler = response => {
  const filepath = path.join(__dirname, "..", "public", "index.html");
  readFile(filepath, (err, file) => {
    if (err) return serverError(err, response);
    response.writeHead(200, { "Content-Type": "text/html" });
    response.end(file);
  });
};

const logOut = res => {
  res.writeHead(302, {
    Location: "/",
    "Set-Cookie": "jwt=0; Max-Age=0"
  });
  return res.end();
};

const displayTasks = response => {
  const filepath = path.join(__dirname, "..", "public", "tasks.html");
  readFile(filepath, (err, file) => {
    if (err) return serverError(err, response);
    response.writeHead(200, { "Content-Type": "text/html" });
    response.end(file);
  });
};

const userLogin = (request, response) => {
  let data = "";
  request.on("data", function (chunk) {
    data += chunk;
  });
  request.on("end", () => {
    const username = queryString.parse(data).userName;
    const password = queryString.parse(data).password;
    userCreds(username, password, (err, res) => {
      if (err) {
        response.writeHead(500, "Content-Type: text/html");
        response.end("<h1>Sorry, there was a problem finding this user</h1>");
        console.log(err);
      } else {
        if (res.length > 0) {
          const cookie = sign(
            { user_name: username, user_id: res[0].user_id },
            SECRET
          );
          if (!username || !password) {
            response.writeHead(401, { "content-type": "text/html" });
            response.end("<h1>Username or password is missing</h1>");
          } else {
            response.writeHead(302, {
              Location: "/tasks",
              "Set-Cookie": `jwt=${cookie}; HttpOnly`
            });
            return response.end(username);
          }
        } else {
          response.writeHead(401, { "content-type": "text/html" });
          response.end("<h1>Could not find this user</h1>");
        }
      }
    });
  });
};

const checkUser = (request, response) => {
  if (request.headers.cookie) {
    const { jwt } = parse(request.headers.cookie);
    if (jwt) {
      return verify(jwt, SECRET, (err, jwt) => {
        if (err) {
          response.writeHead(404, { "content-type": "text/html" });
          response.end("<h1>Username not found</h1>");
        } else {
          console.log("Eta should be value:", typeof jwt);
          var whosTheUser = JSON.stringify(jwt);
          response.writeHead(200, {
            "Content-Type": "application/json"
          });
          response.end(whosTheUser);
        }
      });
    } else {
      response.writeHead(404, { "content-type": "text/html" });
      response.end("<h1>Poshel nakui</h1>");
    }
  }
};

const signUp = (request, response) => {
  let data = "";
  request.on("data", function (chunk) {
    data += chunk;
  });
  request.on("end", () => {
    const password = queryString.parse(data).password;
    const user_name = queryString.parse(data).username;

    console.log(password, user_name);

    const hashPassword = (password, callback) => {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          callback(err);
        } else {
          bcrypt.hash(password, salt, callback);
        }
      });
    };

    hashPassword(
      password, function (err, res) {
        if (err) {
          console.log(err);
          return err;
        } else {
          console.log("result: " + res);
          addUser(user_name, res, (err, resp) => {
            if (err) {
              response.writeHead(500, "Content-Type: text/html");
              response.end("<h1>Sorry, there was a problem finding this user</h1>");
              console.log(err);
            } else {

              response.writeHead(302, { Location: "/login" });
              response.end();


            }
          })
        }
      })



  })
}

const signUpPage = (response) => {
  const filepath = path.join(__dirname, "..", "public", "sign-up-page.html");
  readFile(filepath, (err, file) => {
    if (err) return serverError(err, res);
    response.writeHead(200, { "Content-Type": "text/html" });
    response.end(file);
  });
}

const addTask = (request, response) => {
  let data = "";
  request.on("data", function (chunk) {
    data += chunk;
  });
  request.on("end", () => {
    const content = queryString.parse(data).task;
    const userId = queryString.parse(data).author_id;
    insertTask(content, userId, (err, res) => {
      if (err) {
        response.writeHead(500, "Content-Type: text/html");
        response.end("<h1>Sorry, there was a problem adding that task</h1>");
        console.log(err);
      } else {
        response.writeHead(302, { Location: "/tasks" });
        response.end();
      }
    });
  });
};

const takeTask = (request, response) => {
  let data = "";
  request.on("data", function (chunk) {
    data += chunk;
  });
  request.on("end", () => {
    const content = queryString.parse(data).content;
    const userId = queryString.parse(data).user_id;
    takenTask(content, userId, (err, res) => {
      if (err) {
        response.writeHead(500, "Content-Type: text/html");
        response.end("<h1>Sorry, there was a problem taking this task</h1>");
        console.log(err);
      } else {
        response.writeHead(302, { Location: "/tasks" });
        response.end();
      }
    });
  });
};

const tasksToDo = response => {
  availableTasks((err, res) => {
    if (err) return console.log(err);
    let dynmicData = JSON.stringify(res);
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(dynmicData);
  });
};

const getUserTasks = response => {
  userTasks((err, res) => {
    if (err) return console.log(err);
    let dynmicData = JSON.stringify(res);
    console.log(dynmicData);
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(dynmicData);
  });
};

const publicHandler = (url, response) => {
  const filepath = path.join(__dirname, "..", url);
  readFile(filepath, (err, file) => {
    if (err) return serverError(err, response);
    const [, extension] = url.split(".");
    const extensionType = {
      html: "text/html",
      css: "text/css",
      js: "application/javascript",
      ico: "image/x-icon"
    };
    response.writeHead(200, { "content-type": extensionType[extension] });
    response.end(file);
  });
};

const errorHandler = response => {
  response.writeHead(404, { "content-type": "text/html" });
  response.end("<h1>404 Page Requested Cannot be Found</h1>");
};

module.exports = {
  homeHandler,
  publicHandler,
  errorHandler,
  userLogin,
  checkUser,
  displayTasks,
  logOut,
  addTask,
  takeTask,
  tasksToDo,
  getUserTasks,
  signUp,
  signUpPage
};
