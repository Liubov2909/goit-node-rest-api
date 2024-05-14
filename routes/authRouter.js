import express from "express";
import { currentUser, loginUser, logoutUser, registerUser } from "../controllers/authControler.js";
import { authSchema } from "../schemas/usersSchemas.js";
import validateBody  from "../helpers/validateBody.js";
import { authenticate } from "../middlewares/authenticate.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(authSchema), registerUser);
authRouter.post("/login", validateBody(authSchema),loginUser);
authRouter.post("/logout", authenticate, logoutUser);
authRouter.get("/current", authenticate, currentUser)

export default authRouter;