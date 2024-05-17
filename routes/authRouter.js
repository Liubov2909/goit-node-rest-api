import express from "express";
import { currentUser, loginUser, logoutUser, registerUser, updateAvatars } from "../controllers/authControler.js";
import { authSchema } from "../schemas/usersSchemas.js";
import validateBody  from "../helpers/validateBody.js";
import { authenticate } from "../middlewares/authenticate.js";
import { upload } from "../middlewares/upload.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(authSchema), registerUser);
authRouter.post("/login", validateBody(authSchema),loginUser);
authRouter.post("/logout", authenticate, logoutUser);
authRouter.get("/current", authenticate, currentUser);
authRouter.patch("/avatars", authenticate, upload.single("avatar"),updateAvatars);

export default authRouter;