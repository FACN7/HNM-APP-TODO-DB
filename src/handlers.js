const http = require("http");
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
  request.on("data", function(chunk) {
    data += chunk;
  });
  request.on("end", () => {
    const username = queryString.parse(data).userName;
    console.log(username);
    const password = queryString.parse(data).password;

    userCreds(username, password, (err, res) => {
      if (err) {
        response.writeHead(500, "Content-Type: text/html");
        response.end("<h1>Sorry, there was a problem finding this user</h1>");
        console.log(err);
      } else {
        if (res.length > 0) {
          console.log(res);
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
    console.log("Eta heders cuki:", request.headers.cookie);
    const { jwt } = parse(request.headers.cookie);
    console.log("Eta should be value befor we do anything:", jwt);
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

const addTask = (request, response) => {
  let data = "";
  request.on("data", function(chunk) {
    data += chunk;
  });
  request.on("end", () => {
    const content = queryString.parse(data).content;
    const userId = queryString.parse(data).user_id;
    insertTask(content, user_id, (err, res) => {
      if (err) {
        response.writeHead(500, "Content-Type: text/html");
        response.end("<h1>Sorry, there was a problem adding that task</h1>");
        console.log(err);
      } else {
        response.writeHead(200, { "Content-Type": "text/html" });
        fs.readFile(__dirname + "/../public/tasks.html", function(error, file) {
          if (error) {
            throw new Error("We have an error:", err);
            return;
          } else {
            response.end(file);
          }
        });
      }
    });
  });
};

const takeTask = (request, response) => {
  let data = "";
  request.on("data", function(chunk) {
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
  getUserTasks
};
