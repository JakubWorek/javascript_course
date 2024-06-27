// Requiring modules
import { Application, Router, Context, FormDataBody } from "https://deno.land/x/oak/mod.ts";
import {
  dejsEngine,
  oakAdapter,
  viewEngine,
} from "https://deno.land/x/view_engine/mod.ts";
import { MongoClient } from "https://deno.land/x/mongo/mod.ts";

// MongoDB connection URI
const mongoURI: string = "mongodb+srv://admin:admin@cluster0.szu7uaw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient();

// Connect to MongoDB
await client.connect(mongoURI);
const db = client.database("posts");
const collection = db.collection("posts");

// Initiate app
const app: Application = new Application();
const router: Router = new Router();

// Passing view-engine as middleware
app.use(viewEngine(oakAdapter, dejsEngine, { viewRoot: "./views" }));

// Adding middleware to require our router
app.use(router.routes());
app.use(router.allowedMethods());

// Creating Routes
router.get("/", async (ctx: Context) => {
  const postsData = await collection.find({}).toArray();
  await ctx.render("index.ejs", { posts: postsData });
});

router.post("/", async (ctx: Context) => {
  if (!ctx.request.hasBody) {
    ctx.throw(415);
  }
  const formData: FormDataBody = await ctx.request.body.formData();
  
  const fullName: string = formData.get("full-name") || "";
  const message: string = formData.get("message") || "";

  await collection.insertOne({
    "full-name": fullName,
    message: message,
  });

  ctx.response.redirect("/");
});

// Making app to listen to port
console.log("App is listening to port: 8000");
await app.listen({ port: 8000 });
