import expres from "express";
import { signUp } from "../controllers/auth.controller";
import validateInput from "../middlewares/zodValidator";
import { signUpSchema, loginSchema } from "../zodSchema/auth.schema";

const router = expres.Router();

router.post("/signUp", validateInput(signUpSchema), signUp);

export default router;
