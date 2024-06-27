import { createServer, IncomingMessage, ServerResponse } from "http";
import { URL } from "node:url";
import { MongoClient, Db, Collection, InsertOneResult } from "mongodb";

// Define the Post interface
interface Post {
  "full-name": string;
  message: string;
}

// MongoDB connection URI
const mongoURI: string = "mongodb+srv://admin:admin@cluster0.szu7uaw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
const client: MongoClient = new MongoClient(mongoURI, {});

// Database and collection names
const dbName: string = "posts";
const collectionName: string = "posts";

// Function to handle incoming HTTP requests
async function requestListener(
  request: IncomingMessage,
  response: ServerResponse
): Promise<void> {
  console.log("--------------------------------------");
  console.log(`The relative URL of the current request: ${request.url}`);
  console.log(`Access method: ${request.method}`);
  console.log("--------------------------------------");

  const url: URL = new URL(request.url || "", `http://${request.headers.host}`);

  if (url.pathname !== "/favicon.ico") console.log(url);

  try {
    await client.connect();

    const db: Db = client.db(dbName);
    const collection: Collection<Post> = db.collection(collectionName);

    switch ([request.method, url.pathname].join(" ")) {
      case "GET /":
        // Fetch posts from MongoDB
        const postsData: Post[] = await collection.find().toArray();

        response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        response.write(`
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <title>Zad-dom 2</title>
            </head>
            <body style="margin-left: 20px">
              <main>
                <div>
                  ${
                    postsData
                      .map(
                        (post: Post) => `
                    <div style="border: grey solid 1px; padding: 0 10px 10px;">
                      <h2>${post["full-name"]}</h2>
                      <span>${post.message}</span>
                    </div>
                  `
                      )
                      .join("") // scuffed version of jsx
                  }
                </div>
                <form method="POST" action="/">
                  <legend><h4>New post:</h4></legend>
                  <div style="margin-left: 10px; display: flex; flex-direction: column; width: 200px">
                    <label for="full-name">Give your full name</label>
                    <input name="full-name" placeholder="John Smith" style="margin-bottom:10px">
                    <label for="message">Post message</label>
                    <textarea name="message" placeholder="Did anyone have problem with ...?" style="margin-bottom:10px"></textarea>
                    <div style="display: flex; justify-content: space-around">
                      <input type="submit">
                      <input type="reset">
                    </div>
                  </div>
                </form>
              </main>
            </body>
          </html>`);

        response.end();
        break;

      case "POST /":
        let body: string = "";
        request.on("data", (chunk: Buffer) => {
          body += chunk.toString();
        });

        request.on("end", async () => {
          const formData: URLSearchParams = new URLSearchParams(body);

          const fullName: string = formData.get("full-name") || "";
          const message: string = formData.get("message") || "";

          const newPost: Post = {
            "full-name": fullName,
            message: message,
          };

          try {
            // Insert new post into MongoDB
            const insertResult: InsertOneResult<Post> =
              await collection.insertOne(newPost);

            response.writeHead(200, {
              "Content-Type": "text/plain; charset=utf-8",
            });
            response.write(`Hello ${fullName}`);
          } catch (error: any) {
            console.error("Error inserting post:", error);
            response.writeHead(500, {
              "Content-Type": "text/plain; charset=utf-8",
            });
            response.write("Error inserting post");
          } finally {
            response.end();
          }
        });
        break;

      default:
        response.writeHead(501, {
          "Content-Type": "text/plain; charset=utf-8",
        });
        response.write("Error 501: Not implemented");
        response.end();
    }
  } catch (error: any) {
    console.error("Error:", error);
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.write("Internal Server Error");
    response.end();
  }
}

// Ensure the MongoDB client is properly connected before starting the server
client.connect().then(() => {
  // Create HTTP server
  const server = createServer(requestListener);

  // Start listening on port 8001
  server.listen(8001);
  console.log("The server was started on port 8001");
  console.log('To stop the server, press "CTRL + C"');

  // Handle server shutdown
  process.on('SIGINT', async () => {
    console.log('Shutting down server...');
  
    // Close the MongoDB connection
    await client.close();
  
    // Close the HTTP server
    server.close(() => {
      console.log('Server shut down.');
      process.exit(0);
    });
  });
}).catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});
