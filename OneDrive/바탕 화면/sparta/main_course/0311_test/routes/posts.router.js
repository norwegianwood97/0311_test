// src/routes/posts.router.js
import express from "express";
const router = express.Router();

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// posts 작성 API
router.post("/posts", async (req, res) => {
  const { id, title, content } = req.body;

  if (!content) {
    return res.status(400).send({ message: "포스트 내용을 입력해주세요" });
  }

  try {
    const postsExists = await prisma.posts.findUnique({
      where: { id: id },
    });

    if (postsExists) {
      return res
        .status(404)
        .send({ message: "해당 포스트가 존재하지 이미 존재합니다." });
    }

    // postsId를 포함하여 포스트 데이터 생성
    const newPosts = await prisma.posts.create({
      data: {
        id,
        title,
        content,
      },
    });
    res.status(201).send(newPosts);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "포스트 작성 중 오류가 발생했습니다.",
      error: error.message,
    });
  }
});

// posts 목록 조회 API
router.get("/posts", async (req, res) => {
  try {
    const posts = await prisma.posts.findMany({
      where: {},
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).send(posts);
  } catch (error) {
    res.status(500).send({
      message: "포스트 목록 조회 중 오류가 발생했습니다.",
      error: error.message,
    });
  }
});

// posts 수정 API
router.patch("/posts/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  if (!title || !content) {
    return res
      .status(400)
      .send({ message: "포스트 제목과 내용을 입력해주세요" });
  }

  try {
    const existingPosts = await prisma.posts.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingPosts) {
      return res.status(404).send({ message: "존재하지 않는 포스트입니다." });
    }

    const updatedPosts = await prisma.posts.update({
      where: { id: parseInt(id) },
      data: { title, content },
    });

    res.status(200).send(updatedPosts);
  } catch (error) {
    res.status(500).send({
      message: "포스트 수정 중 오류가 발생했습니다.",
      error: error.message,
    });
  }
});

// posts 삭제 API
router.delete("/posts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const existingPosts = await prisma.Posts.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingPosts) {
      return res.status(404).send({ message: "존재하지 않는 포스트입니다." });
    }

    await prisma.Posts.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).send({ message: "success" });
  } catch (error) {
    res.status(500).send({
      message: "포스트 삭제 중 오류가 발생했습니다.",
      error: error.message,
    });
  }
});

export default router;
