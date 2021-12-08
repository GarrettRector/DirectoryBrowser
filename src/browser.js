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
console.log("Current Directory:")
promptUser(true).then();

async function promptUser(doread) {
    if (doread) {
        await read()
    }
    readline.setPrompt("\nPath? > ");
    readline.prompt();
}

async function scanDirectory(userInput) {
    let path = userInput.trim().toLowerCase();
    if (path === "showdir") {
        console.log("\nCurrent Directory:")
        await read()
        return promptUser()
    }

    const goUp = path === "up";
    currentDirectory = resolve(currentDirectory, goUp ? ".." : path);


    try {
        if (fs.statSync(paths.join(currentDirectory)).isFile()) {
            fs.readFile(currentDirectory, async (err, data) => {
                if (err) throw err
                data = data.toString();
                if (data === "") {
                    data = "File is empty\n";
                }
                console.log(data);
                currentDirectory = paths.join(currentDirectory, "..")
                await promptUser(false);
            })
        } else {
            await promptUser(true);
        }
    } catch (error) {
        console.log(`Directory "${userInput}" does not exist!`);
        return readline.close();
    }
}

async function read() {
    const files = await readdir(currentDirectory);
    files.forEach(function (file) {
        let stats = fs.statSync(paths.join(currentDirectory, file));
        let isfile;
        if (stats.isFile()) {
            isfile = "File";
        } else {
            isfile = "Directory";
        }
        console.log(`|\n| - ${file} (${isfile})`);
    })
}