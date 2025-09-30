import express from "express";
import {  getExpensesplits } from "../controllers/SplitController.js";

const router = express.Router();

router.get("/:expense_id", getExpensesplits);

export default router;
