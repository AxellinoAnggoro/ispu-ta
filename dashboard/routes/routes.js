import express from "express";
import { dashboard, forecasting, history } from "../controllers/controller.js";

const router = express.Router();

router.get("/", dashboard);
router.get("/forecasting", forecasting);
router.get("/history", history);

export default router;
