const {
    homeHandler
} = require("./handlers");

const router = (request, response) => {
    const { url } = request;
    if (url === "/") {
        homeHandler(response);
    }
}

module.exports = router;