import express from "express";
const router = express.Router();
import Controller from "../controllers/frontController.js";
import { isAuth } from "../middlewares/auth.js";

const FrontController = new Controller();

router.get("/", FrontController.index);
router.get("/login", FrontController.login);
router.get("/dashboard", isAuth, FrontController.dashboard);

export default router;
