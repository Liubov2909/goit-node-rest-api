import express from "express";
import { currentUser, loginUser, logoutUser, registerUser, resendVerifyEmail, updateAvatars, verifyEmail } from "../controllers/authControler.js";
import { authSchema, emailSchema } from "../schemas/usersSchemas.js";
import validateBody  from "../helpers/validateBody.js";
import { authenticate } from "../middlewares/authenticate.js";
import { upload } from "../middlewares/upload.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(authSchema), registerUser);
authRouter.get("/verify/:verificationToken", verifyEmail);
authRouter.post("/verify", validateBody(emailSchema), resendVerifyEmail);
authRouter.post("/login", validateBody(authSchema),loginUser);
authRouter.post("/logout", authenticate, logoutUser);
authRouter.get("/current", authenticate, currentUser);
authRouter.patch("/avatars", authenticate, upload.single("avatar"), updateAvatars);


export default authRouter;