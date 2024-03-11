// src/app.js

import express from "express";
import postsRouter from "./routes/posts.router.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// comments 라우터는 reviews 라우터에서 처리할 것!
app.use("/api", postsRouter);

app.listen(PORT, () => {
  console.log(`Server listen ${PORT}`);
});
