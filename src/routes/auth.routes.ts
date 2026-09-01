import expres from "express";
import {
  signUp,
  login,
  getMe,
  protect,
  logout,
} from "../controllers/auth.controller.js";
import validateInput from "../middlewares/zodValidator.js";
import { signUpSchema, loginSchema } from "../zodSchema/auth.schema.js";

const router = expres.Router();

router.post("/signUp", validateInput(signUpSchema), signUp);
router.post("/login", validateInput(loginSchema), login);
router.get("/me", protect, getMe);
router.post("/logout", logout);
export default router;
