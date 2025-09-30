import pool from "../config/db.js";

// ✅ Add an expense with splits
export const addExpense = async (req, res) => {
  const { group_id, paid_by, amount, description, splits } = req.body;
  try {
    // Insert expense
    const result = await pool.query(
      `INSERT INTO expenses (group_id, paid_by, amount, description, created_at)
       VALUES ($1, $2, $3, $4, NOW()) RETURNING id`,
      [group_id, paid_by, amount, description]
    );
    const expenseId = result.rows[0].id;

    // Insert splits
    for (let s of splits) {
      await pool.query(
        `INSERT INTO splits (expense_id, user_id, share) VALUES ($1, $2, $3)`,
        [expenseId, s.user_id, s.share]
      );
    }

    res.status(201).json({ message: "Expense created", expenseId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create expense" });
  }
};

// ✅ Get all expenses in a group
export const getGroupExpenses = async (req, res) => {
  const { group_id } = req.params;
  try {
    const result = await pool.query(
      `SELECT e.id, e.description, e.amount, e.paid_by, e.created_at,
              json_agg(json_build_object('user_id', s.user_id, 'share', s.share)) AS splits
       FROM expenses e
       LEFT JOIN splits s ON e.id = s.expense_id
       WHERE e.group_id = $1
       GROUP BY e.id
       ORDER BY e.created_at DESC`,
      [group_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
};



// ✅ Delete an expense and its splits
export const deleteExpense = async (req, res) => {
  const { expense_id } = req.params;        
    try {
        const result = await pool.query(
            `DELETE FROM expenses WHERE id = $1 RETURNING *`,
            [expense_id]
        );  
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Expense not found" });
        }
        res.json({ message: "Expense deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete expense" });
    }

};

// ✅ Get a single expense by ID    