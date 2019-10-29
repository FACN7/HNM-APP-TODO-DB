const http = require("http");
const pg = require("pg");
const { readFile } = require("fs");
const fs = require("fs");
const path = require("path");
const queryString = require("querystring");
const { parse } = require("cookie");
const { sign, verify } = require("jsonwebtoken");

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

const userLogin = (request, response) => {
  let data = "";
  request.on("data", function(chunk) {
    data += chunk;
  });
  request.on("end", () => {
    const username = queryString.parse(data).userName;
    const password = queryString.parse(data).password;
    const cookie = sign({ user_name: username }, SECRET);
    if (!username || !password) {
      response.writeHead(404, { "content-type": "text/html" });
      response.end("<h1>Username or password is missing</h1>");
    } else {
      response.writeHead(302, {
        Location: "/tasks",
        "Set-Cookie": `jwt=${cookie}; HttpOnly`
      });
      return response.end(username);
    }
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
  userLogin
};
