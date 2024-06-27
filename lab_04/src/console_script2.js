
import fs from 'node:fs';
import { argv, stdin, stdout } from 'node:process';
import { exec } from 'node:child_process';

const mode = argv[2];
const counterFile = 'data.txt'

function counterSync(){
    console.log("Writing to file synchronicly");
    const data = fs.readFileSync('./src/data.txt', 'utf8');
    const curr = parseInt(data, 10);
    console.log("curr counter status : ", data);
    const count = curr + 1;
    fs.writeFileSync('./src/data.txt', count.toString());
    console.log("Counter after incrementing : ", count);

}

function counterAsync() {
    console.log("Writing to file asynchronously");
    fs.readFile("./src/data.txt", 'utf-8', (err, data) => {
        if (err) {
            console.error("Error during file read:", err);
            return;
        }
        const curr = parseInt(data, 10);
        console.log("current counter value: ", curr);
        const count = curr + 1;
        fs.writeFile('./src/data.txt', count.toString(), (err) => {
            if (err) {
                console.error("Error during file write:", err);
                return;
            }
            console.log("counter after incrementing: ", count);
        });
    });
}



if(mode === "--sync"){
    counterSync();

}
else if(mode === "--async"){
    counterAsync();

}else {
    console.log("Wprowadź komendę systemową:");
    stdin.resume();
    stdin.setEncoding('utf8');
    stdin.on('data', (data) => {
        const command = data.trim();
        exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        });
    });
}
