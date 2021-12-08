const local_path = require("path")
const fs = require("fs")
const browser = require("./browser");
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});


function get_dirs(path) {
    let dir_path;
    if (path.toLowerCase() === "up") {
        let path_ = local_path.join(__dirname).split("/");
        path_.pop();
        dir_path = path_.join("/");
    } else {
        dir_path = local_path.join(__dirname, path);
    }
    fs.readdir(dir_path, function (err, files) {
        if (err) {
            return console.log("Unable to scan directory!")
        }

        files.forEach(function (file) {
            console.log(
                `|\n| - ${file}`
            )
        });
    });
}

exports.question = function get_input() {
    let response;

    readline.setPrompt("Path? > ")
    readline.prompt()

    return new Promise((resolve) => {
        readline.on('line', (userInput) => {
            response = userInput;
            readline.close();
        });

        readline.on('close', () => {
            resolve(response);
        });
    })
}

browser.question().then(response => get_dirs(response))
