import expres from "express";
import { signUp, login } from "../controllers/auth.controller";
import validateInput from "../middlewares/zodValidator";
import { signUpSchema, loginSchema } from "../zodSchema/auth.schema";

const router = expres.Router();

router.post("/signUp", validateInput(signUpSchema), signUp);
router.post("/login", validateInput(loginSchema), login);
export default router;
