const http = require("http");
const pg = require("pg");
const { readFile } = require("fs");
const fs = require("fs");
const path = require("path");
const queryString = require("querystring");

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

module.exports = {
    homeHandler
}