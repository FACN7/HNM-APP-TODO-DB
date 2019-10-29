const {
  homeHandler,
  publicHandler,
  errorHandler,
  userLogin
} = require("./handlers");

const router = (request, response) => {
  const { url } = request;
  if (url === "/") {
    homeHandler(response);
  } else if (url === "/user-login") {
    userLogin(request, response);
  } else if (url.includes("public")) {
    publicHandler(url, response);
  } else {
    errorHandler(response);
  }
};

module.exports = router;
