/**
 * @author Stanisław Polak <polak@agh.edu.pl>
 */

/* ********* */
/* CommonsJS */
/* ********* */
// const fs = require('fs-extra')
//const fs = require('node:fs')
//const { argv } = require('node:process');
/* **** */
/* ES6  */
/* **** */
import fs from 'fs-extra';
import { argv } from 'node:process';
/************************* */
function read_async() {
    console.log(`1.\t\x1B[33mWykonano pierwszą linię funkcji "read_async()"\x1B[0m`);
    console.log('2.\t\x1B[33mWywołano funkcję \'readFile()\'\x1B[0m');
    console.time('\tCzas wykonania "readFile()"');
    fs.readFile(argv[1], (err, data) => {
        if (err) throw err;
        console.log('3.\t\x1B[33mWczytana zawartość pliku jest dostępna w zmiennej \'data\'\x1B[0m');
    });
    console.timeEnd('\tCzas wykonania "readFile()"');
    console.log(`4.\t\x1B[33mWykonano ostatnią linię funkcji "read_async()"\x1B[0m`);
}
function read_sync() {
    console.log(`5.\t\x1B[32mWykonano pierwszą linię funkcji "read_sync()"\x1B[0m`);
    console.log('6.\t\x1B[32mWywołano funkcję \'readFileSync()\'\x1B[0m');
    console.time('\tCzas wykonania "readFileSync()"');
    let data = fs.readFileSync(argv[1]);
    console.timeEnd('\tCzas wykonania "readFileSync()"');
    console.log('7.\t\x1B[32mWczytana zawartość pliku jest dostępna w zmiennej \'data\'\x1B[0m');
    console.log(`8.\t\x1B[32mWykonano ostatnią linię funkcji "read_sync()"\x1B[0m`);
}
/************************* */
console.clear()
console.log(`\x1B[31mAsynchroniczny odczyt pliku "${argv[1]}"\x1B[0m`);
read_async();
console.log('------------------');
console.log(`\x1B[31mSynchroniczny odczyt pliku "${argv[1]}"\x1B[0m`);
read_sync();
console.log('------------------');
console.log('9.\t\x1B[34mWykonano ostatnią linię skryptu\x1B[0m');   