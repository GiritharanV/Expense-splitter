import pool from "../config/db.js";

export const getExpensesplits = async (req, res) => {
  const { expense_id } = req.params;

  if (!expense_id) {
    return res.status(400).json({ error: "Expense ID is required" });
  }

  try {
    const result = await pool.query(
      `SELECT * FROM expense_splits WHERE expense_id = $1`,
      [expense_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "No splits found for this expense" });
    }

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching splits:", err.message);
    res.status(500).json({ error: "Failed to fetch splits" });
  }
};
