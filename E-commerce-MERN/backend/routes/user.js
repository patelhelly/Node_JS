import express from "express";
import { createUser, loginUser } from "../controllers/user.js";
import asyncHandler from "express-async-handler";

const router = express.Router();

router.post("/register", asyncHandler(createUser));

router.post("/login", asyncHandler(loginUser));

export default router;
