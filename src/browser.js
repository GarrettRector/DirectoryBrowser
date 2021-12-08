const { resolve } = require("path");
const paths = require("path")
const { readdir } = require("fs/promises");
const fs = require("fs");
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});


readline.on("line", scanDirectory);
let currentDirectory = __dirname;

promptUser();

function promptUser() {
    readline.setPrompt("\nPath? > ");
    readline.prompt();
}

async function scanDirectory(userInput) {
    let path = userInput.trim().toLowerCase();
    const goUp = path === "up";
    currentDirectory = resolve(currentDirectory, goUp ? ".." : path);

    try {
        if (fs.statSync(paths.join(currentDirectory)).isFile()) {
            fs.readFile(currentDirectory, (err, data) => {
                if (err) throw err

                console.log(data.toString())
                promptUser();
            })
        } else {
            const files = await readdir(currentDirectory);
            files.forEach(function (file) {
                let stats = fs.statSync(paths.join(currentDirectory, file));
                let isfile;
                if (stats.isFile()) { isfile = "File"; } else { isfile = "Directory"; }
                console.log(`|\n| - ${file} (${isfile})`);
            });
            promptUser();
        }
    } catch (error) {
        console.log(`Directory "${userInput}" does not exist!`);
        return readline.close();
    }
}