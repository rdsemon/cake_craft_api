import express from "express";

const router = express.Router();

import { getAllCakes } from "../controllers/cake.controller";

router.get("/cake", getAllCakes);

export default router;
