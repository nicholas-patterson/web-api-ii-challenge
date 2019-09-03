const express = require("express");
const server = express();
const postRoutes = require("./posts/postRoutes");
server.use(express.json());
server.use("/api/posts", postRoutes);

const port = 8000;
server.listen(port, () => console.log(`Server Listening on Port: ${port}`));
