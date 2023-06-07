const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const { getStoredPosts, storePosts } = require("./data/posts");

const app = express();

// Enable CORS for all routes
app.use(cors());

app.use(bodyParser.json());

app.use((req, res, next) => {
  // Attach CORS headers
  // Required when using a detached backend (that runs on a different domain)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/posts", async (req, res) => {
  const storedPosts = await getStoredPosts().catch((err) => {
    // return an array with error
    return [err.message];
  });
  //await new Promise((resolve, reject) => setTimeout(() => resolve(), 1500));
  res.json({ posts: storedPosts });
});

app.get("/posts/:id", async (req, res) => {
  const storedPosts = await getStoredPosts();
  const post = storedPosts.find((post) => post.id === req.params.id);
  res.json({ post });
});

app.post("/posts", async (req, res) => {
  const existingPosts = await getStoredPosts();
  const postData = req.body;
  const newPost = {
    ...postData,
    id: Math.random().toString(),
  };
  const updatedPosts = [newPost, ...existingPosts];
  await storePosts(updatedPosts);
  res.status(201).json({ message: "Stored new post.", post: newPost });
});

app.delete('/posts/:id', async (req, res) => {
  const { id } = req.params;
  console.log("id");
  console.log(id);
  let existingPosts = await getStoredPosts();
  console.log("existingPosts");
  console.log(existingPosts);
  existingPosts = existingPosts.filter(post => post.id !== id);
  const updatedPosts = existingPosts;
  console.log("updatedPosts");
  console.log(updatedPosts);
  await storePosts(updatedPosts);
  res.status(204).json({ message: "Deleted post.", post: existingPosts.filter(post => post.id === id)  }) // Send a successful response 
});

// Start the server
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
