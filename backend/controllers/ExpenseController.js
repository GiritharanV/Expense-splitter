import pool from "../config/db.js";

export const addExpense = async (req, res) => {
  const { group_id, paid_by, amount, description, splits } = req.body;

  if (!group_id || !paid_by || !amount || !splits ) {
    return res.status(400).json({ error: "group_id, paid_by, amount and valid splits are required" });
  }
  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: "amount must be a positive number" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO expenses (group_id, paid_by, amount, description, created_at)
       VALUES ($1, $2, $3, $4, NOW()) RETURNING id`,
      [group_id, paid_by, amount, description]
    );

    const expenseId = result.rows[0].id;

    for (const s of splits) {
      if (!s.user_id || isNaN(s.share_amount)) {
        return res.status(400).json({ error: "Each split must have user_id and numeric share_amount" });
      }
      await pool.query(
        `INSERT INTO expense_splits (expense_id, user_id, share_amount, paid) 
         VALUES ($1, $2, $3, $4)`,
        [expenseId, s.user_id, s.share_amount, s.paid || false]
      );
    }

    res.status(201).json({ message: "Expense created", expenseId });
  } catch (err) {
    console.error("Error creating expense:", err.message);
    res.status(500).json({ error: "Failed to create expense" });
  }
};

export const getgroupExpenses = async (req, res) => {
  const { group_id } = req.params;

  if (!group_id) {
    return res.status(400).json({ error: "Group ID is required" });
  }

  try {
    const result = await pool.query(
      `SELECT e.id, e.description, e.amount, e.paid_by, e.created_at,
              array_agg('user_id', s.user_id, 'share_amount', s.share_amount, 'paid', s.paid) AS splits
       FROM expenses e
       LEFT JOIN expense_splits s ON e.id = s.expense_id
       WHERE e.group_id = $1
       GROUP BY e.id
       ORDER BY e.created_at DESC`,
      [group_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "No expenses found for this group" });
    }

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching group expenses:", err.message);
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
};

export const deleteExpense = async (req, res) => {
  const { expense_id } = req.params;

  if (!expense_id) {
    return res.status(400).json({ error: "Expense ID is required" });
  }

  try {
    const result = await pool.query(
      `DELETE FROM expenses WHERE id = $1 RETURNING *`,
      [expense_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.json({ message: "Expense deleted", expense: result.rows[0] });
  } catch (err) {
    console.error("Error deleting expense:", err.message);
    res.status(500).json({ error: "Failed to delete expense" });
  }
};

export const getExpensebyId = async (req, res) => {
  const { expense_id } = req.params;

  if (!expense_id) {
    return res.status(400).json({ error: "Expense ID is required" });
  }

  try {
    const result = await pool.query(
      `SELECT e.id, e.description, e.amount, e.paid_by, e.created_at,
              array_agg('user_id', s.user_id, 'share_amount', s.share_amount, 'paid', s.paid) AS splits
       FROM expenses e
       LEFT JOIN expense_splits s ON e.id = s.expense_id
       WHERE e.id = $1
       GROUP BY e.id`,
      [expense_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching expense:", err.message);
    res.status(500).json({ error: "Failed to fetch expense" });
  }
};
