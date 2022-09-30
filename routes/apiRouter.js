import express from "express";
const router = express.Router();
import Controller from "../controllers/apiController.js";
import { isAuth } from "../middlewares/auth.js";

const ApiController = new Controller();

router.post("/register", ApiController.register);
router.post("/login", ApiController.login);
router.get("/logout", isAuth, ApiController.logout);

export default router;
