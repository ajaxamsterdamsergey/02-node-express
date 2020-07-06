import { Router } from "express";
import { userValidateMiddleware } from "../contacts/contact.validator";
import {
  registrationController,
  loginController,
  /* verifyController, */
} from "./auth.controller";

const authRouter = Router();

authRouter.post("/register", userValidateMiddleware, registrationController);
authRouter.post("/login", loginController);
/* authRouter.get('/verify/:token', verifyController);
 */
/* export default authRouter; */
module.exports = authRouter;
