const {
  homeHandler,
  publicHandler,
  errorHandler,
  userLogin,
  checkUser,
  displayTasks,
  logOut,
  addTask,
  takeTask
} = require("./handlers");

const router = (request, response) => {
  const { url } = request;
  if (url === "/") {
    homeHandler(response);
  } else if (url === "/user-login") {
    userLogin(request, response);
  } else if (url === "/tasks") {
    displayTasks(response);
  } else if (url === "/check-user") {
    checkUser(request, response);
  } else if (url === "/log-out") {
    logOut(response);
  } else if (url === "/add-task") {
    addTask(request, response);
  } else if (url === "/take-task") {
    takeTask(request, response);
  } else if (url.includes("public")) {
    publicHandler(url, response);
  } else {
    errorHandler(response);
  }
};

module.exports = router;
