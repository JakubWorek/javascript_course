"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
var node_url_1 = require("node:url");
var mongodb_1 = require("mongodb");
// MongoDB connection URI
var mongoURI = "mongodb+srv://admin:admin@cluster0.szu7uaw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// Connect to MongoDB
var client = new mongodb_1.MongoClient(mongoURI, {});
// Database and collection names
var dbName = "posts";
var collectionName = "posts";
// Function to handle incoming HTTP requests
function requestListener(request, response) {
    return __awaiter(this, void 0, void 0, function () {
        var url, db, collection_1, _a, postsData, body_1, error_1;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log("--------------------------------------");
                    console.log("The relative URL of the current request: ".concat(request.url));
                    console.log("Access method: ".concat(request.method));
                    console.log("--------------------------------------");
                    url = new node_url_1.URL(request.url || "", "http://".concat(request.headers.host));
                    if (url.pathname !== "/favicon.ico")
                        console.log(url);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 8, , 9]);
                    return [4 /*yield*/, client.connect()];
                case 2:
                    _b.sent();
                    db = client.db(dbName);
                    collection_1 = db.collection(collectionName);
                    _a = [request.method, url.pathname].join(" ");
                    switch (_a) {
                        case "GET /": return [3 /*break*/, 3];
                        case "POST /": return [3 /*break*/, 5];
                    }
                    return [3 /*break*/, 6];
                case 3: return [4 /*yield*/, collection_1.find().toArray()];
                case 4:
                    postsData = _b.sent();
                    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
                    response.write("\n          <!DOCTYPE html>\n          <html lang=\"en\">\n            <head>\n              <meta charset=\"utf-8\">\n              <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n              <title>Zad-dom 2</title>\n            </head>\n            <body style=\"margin-left: 20px\">\n              <main>\n                <div>\n                  ".concat(postsData
                        .map(function (post) { return "\n                    <div style=\"border: grey solid 1px; padding: 0 10px 10px;\">\n                      <h2>".concat(post["full-name"], "</h2>\n                      <span>").concat(post.message, "</span>\n                    </div>\n                  "); })
                        .join("") // scuffed version of jsx
                    , "\n                </div>\n                <form method=\"POST\" action=\"/\">\n                  <legend><h4>New post:</h4></legend>\n                  <div style=\"margin-left: 10px; display: flex; flex-direction: column; width: 200px\">\n                    <label for=\"full-name\">Give your full name</label>\n                    <input name=\"full-name\" placeholder=\"John Smith\" style=\"margin-bottom:10px\">\n                    <label for=\"message\">Post message</label>\n                    <textarea name=\"message\" placeholder=\"Did anyone have problem with ...?\" style=\"margin-bottom:10px\"></textarea>\n                    <div style=\"display: flex; justify-content: space-around\">\n                      <input type=\"submit\">\n                      <input type=\"reset\">\n                    </div>\n                  </div>\n                </form>\n              </main>\n            </body>\n          </html>"));
                    response.end();
                    return [3 /*break*/, 7];
                case 5:
                    body_1 = "";
                    request.on("data", function (chunk) {
                        body_1 += chunk.toString();
                    });
                    request.on("end", function () { return __awaiter(_this, void 0, void 0, function () {
                        var formData, fullName, message, newPost, insertResult, error_2;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    formData = new URLSearchParams(body_1);
                                    fullName = formData.get("full-name") || "";
                                    message = formData.get("message") || "";
                                    newPost = {
                                        "full-name": fullName,
                                        message: message,
                                    };
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, 4, 5]);
                                    return [4 /*yield*/, collection_1.insertOne(newPost)];
                                case 2:
                                    insertResult = _a.sent();
                                    response.writeHead(200, {
                                        "Content-Type": "text/plain; charset=utf-8",
                                    });
                                    response.write("Hello ".concat(fullName));
                                    return [3 /*break*/, 5];
                                case 3:
                                    error_2 = _a.sent();
                                    console.error("Error inserting post:", error_2);
                                    response.writeHead(500, {
                                        "Content-Type": "text/plain; charset=utf-8",
                                    });
                                    response.write("Error inserting post");
                                    return [3 /*break*/, 5];
                                case 4:
                                    response.end();
                                    return [7 /*endfinally*/];
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); });
                    return [3 /*break*/, 7];
                case 6:
                    response.writeHead(501, {
                        "Content-Type": "text/plain; charset=utf-8",
                    });
                    response.write("Error 501: Not implemented");
                    response.end();
                    _b.label = 7;
                case 7: return [3 /*break*/, 9];
                case 8:
                    error_1 = _b.sent();
                    console.error("Error:", error_1);
                    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
                    response.write("Internal Server Error");
                    response.end();
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
}
// Ensure the MongoDB client is properly connected before starting the server
client.connect().then(function () {
    // Create HTTP server
    var server = (0, http_1.createServer)(requestListener);
    // Start listening on port 8001
    server.listen(8001);
    console.log("The server was started on port 8001");
    console.log('To stop the server, press "CTRL + C"');
    // Handle server shutdown
    process.on('SIGINT', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Shutting down server...');
                    // Close the MongoDB connection
                    return [4 /*yield*/, client.close()];
                case 1:
                    // Close the MongoDB connection
                    _a.sent();
                    // Close the HTTP server
                    server.close(function () {
                        console.log('Server shut down.');
                        process.exit(0);
                    });
                    return [2 /*return*/];
            }
        });
    }); });
}).catch(function (error) {
    console.error("Error connecting to MongoDB:", error);
});
