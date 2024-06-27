/**
 * @fileoverview This file contains a server script for a forum application.
 * It handles incoming requests, saves new entries to a file, and generates an HTML response for the forum page.
 * The server listens on port 8000.
 * @module server_script2
 */

/**
 * Represents a book.
 * @constructor
 * @param {server}
 * @author Jakub Worek
 */

/**
 * @external IncomingMessage
 * @see {@link https://nodejs.org/api/http.html#http_class_http_incomingmessage}
 */

/**
 * @external ServerResponse
 * @see {@link https://nodejs.org/api/http.html#http_class_http_serverresponse}
 */

import http from 'node:http';
import { readFile } from 'fs/promises';
import { appendFile } from 'fs/promises';

/** formatting imported data */
function parseEntry(entry) {
  const [name, content] = entry.split(":");
  return `<div><h2>${name}</h2><p>${content}</p></div>`;
}

/**
 * Handles incoming requests.
 *
 * @param {IncomingMessage} request - Input stream — contains data received from the browser, e.g,. encoded contents of HTML form fields.
 * @param {ServerResponse} response - Output stream — put in it data that you want to send back to the browser.
 * The answer sent by this stream must consist of two parts: the header and the body.
 * <ul>
 *  <li>The header contains, among others, information about the type (MIME) of data contained in the body.
 *  <li>The body contains the correct data, e.g. a form definition.
 * </ul>
 * @returns {void}
 * @throws {Error} If there is an error reading or writing to the file.
 * @async
 * @memberof module:server_script2
 */
async function requestListener(request, response) {
  if (request.method === "POST" && request.url === "/post") {
    let body = '';
    for await (const chunk of request) {
      body += chunk;
    }
    const { name, content } = JSON.parse(body);
    await appendFile('ksiega.txt', `\n${name}:${content}`);
  }
  let data = await readFile('ksiega.txt', 'utf-8');
  data = data
    .split("\n")
    .filter(entry => entry.trim() !== "")
    .map(parseEntry)
    .join('');

  response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  /** front site */
  response.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Forum</title>
        <link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet'>
        <style>
            body {
                font-family: 'Roboto';
                font-size: .9375rem;
                font-weight: 400;
                line-height: 1.5;
                color: #1d2125;
                text-align: left;
            }
            .form-control {
                display: block;
                width: 99%;
                height: calc(1.5em + 0.75rem + 2px);
                padding: .375rem .75rem;
                line-height: 1.5;
                color: #495057;
                background-color: #fff;
                background-clip: padding-box;
                border: 1px solid #8f959e;
                border-radius: .5rem;
                transition: border-color 0.15s ease-in-out,box-shadow 0.15s ease-in-out;
            }
            .form-group {
                margin-bottom: 1rem;
              }
            label {
                display: inline-block;
                margin-bottom: .5rem;
            }
            .title {
                display: block;
                width: 100%;
                max-width: 100%;
                padding: 0;
                margin-bottom: 0.5rem;
                font-size: 1.5rem;
                line-height: inherit;
                color: inherit;
                white-space: normal;
            }
            .btn {
                display: inline-block;
                font-weight: 400;
                text-align: center;
                vertical-align: middle;
                user-select: none;
                border: 1px solid transparent;
                padding: .375rem .75rem;
                font-size: .9375rem;
                line-height: 1.5;
                border-radius: .5rem;
                transition: color 0.15s ease-in-out,background-color 0.15s ease-in-out,border-color 0.15s ease-in-out,box-shadow 0.15s ease-in-out;
                cursor: pointer;
                border-radius: 8px;
            }
            .btn-primary {
                margin-top: 1rem;
                color: #fff;
                background-color: #393743;
                border-color: #393743;
            }
        </style>
    </head>
    <body>
        <main>
            <div>
                ${data}
            </div>
            <p class="title">Nowy wpis:</p>
            <form id="post-form">
                <div class="form-group">               
                    <label for="name">Twoje imię i nazwisko</label>
                    <input type="text" class="form-control" id="name" placeholder="Jerzy Wiśniewski">
                </div
                <div class="form-group">
                    <label for="content">Treść wpisu</label>
                    <textarea class="form-control" id="content" rows="3" placeholder="Proszę o kontakt osoby, które ze mną studiowały — tel. 12 345 67 89 "></textarea>
                </div>
                <button type="submit" class="btn btn-primary" onClick='window.location.reload());'>Dodaj wpis</button>
            </form> 
            <script>
                document.getElementById('post-form').addEventListener('submit', function(event) {
                    event.preventDefault();
                    const name = document.getElementById('name').value;
                    const content = document.getElementById('content').value;
                    document.getElementById('name').value = '';
                    document.getElementById('content').value = '';
                    fetch('/post', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ name, content }),
                    })
                    .then(() => 
                        window.location.reload()
                    );
                });
            </script>
        </main>
    </body>
    </html>
  `);
  response.end();
}

const server = http.createServer(requestListener);
server.listen(8000);
console.log('The server was started on port 8000');
console.log('To stop the server, press "CTRL + C"');