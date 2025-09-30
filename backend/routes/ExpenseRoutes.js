import express from "express";
import { addExpense,getgroupExpenses,deleteExpense,getExpensebyId} from "../controllers/ExpenseController.js";

const router = express.Router();

router.post("/", addExpense);
router.get("/group/:group_id", getgroupExpenses);
router.get("/:expense_id", getExpensebyId);
router.delete("/:expense_id", deleteExpense);

export default router;
