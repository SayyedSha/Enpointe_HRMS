import { Router } from "express";
import { addEmplyee, login } from "../controllers/user.controller.js";

const userRoutes = Router();

userRoutes.route("/register").post(addEmplyee);
userRoutes.route("/login").post(login);

export default userRoutes