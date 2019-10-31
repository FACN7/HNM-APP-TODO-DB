const {
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
  signUpPage,
  markCompleted,
  getUserTasksDone
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
  } else if (url === "/complete-task") {
    markCompleted(request, response);
  } else if (url === "/tasks-for-all") {
    tasksToDo(response);
  } else if (url === "/user-tasks") {
    getUserTasks(response);
  } else if (url === "/tasks-done") {
    getUserTasksDone(response);
  } else if (url.includes("public")) {
    publicHandler(url, response);
  } else if (url === "/sign-up") {
    signUp(request, response);
  } else if (url === "/sign-up-page") {
    signUpPage(response);
  }
  else {
    errorHandler(response);
  }
};

module.exports = router;
