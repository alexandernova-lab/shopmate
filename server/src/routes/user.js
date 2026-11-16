import express from "express";
import { register } from "../controllers/user.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { registerValidator } from "../validators/user.js";

const router = express.Router();

router.post("/register", registerValidator, validateRequest, register);

export default router;
