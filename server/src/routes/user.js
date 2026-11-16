import express from "express";
import { login, logout, register } from "../controllers/user.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { loginValidator, registerValidator } from "../validators/user.js";

const router = express.Router();

router.post("/register", registerValidator, validateRequest, register);
router.post("/login", loginValidator, validateRequest, login);
router.post("/logout", logout);

export default router;
