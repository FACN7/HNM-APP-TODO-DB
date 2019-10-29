function request(url, cb) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                cb(null, xhr.responseText);
            } else {
                cb("error" + xhr.responseType);
            }
        }
    };
    xhr.open("GET", url, true);
    xhr.send();
}

function updateToDoDom(err, data) {

}


request("/todo", updateBooksListDom);