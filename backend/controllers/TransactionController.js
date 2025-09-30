import pool from "../config/db.js";

// ✅ Get balances for each user in a group
export const getBalances = async (req, res) => {
  const { group_id } = req.params;
  try {
    const result = await pool.query(
      `SELECT s.user_id,
              SUM(s.share) AS total_owed,
              COALESCE(SUM(CASE WHEN e.paid_by = s.user_id THEN e.amount ELSE 0 END), 0) AS total_paid
       FROM expenses e
       JOIN splits s ON e.id = s.expense_id
       WHERE e.group_id = $1
       GROUP BY s.user_id`,
      [group_id]
    );

    const balances = result.rows.map(r => ({
      user_id: r.user_id,
      balance: Number(r.total_owed) - Number(r.total_paid) // +ve = owes, -ve = gets back
    }));

    res.json(balances);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch balances" });
  }
};

// ✅ Record a settlement transaction
export const settleUp = async (req, res) => {
  const { group_id } = req.params;
  const { from_user, to_user, amount } = req.body;

  try {
    // Record settlement in transactions table
    const result = await pool.query(
      `INSERT INTO transactions (group_id, from_user, to_user, amount, settled_at)
       VALUES ($1, $2, $3, $4, NOW()) RETURNING *`,
      [group_id, from_user, to_user, amount]
    );

    res.status(201).json({ message: "Settlement recorded", transaction: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to settle up" });
  }
};

// ✅ Get all settlement transactions in a group
export const getSettlements = async (req, res) => {
  const { group_id } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM transactions WHERE group_id = $1 ORDER BY settled_at DESC`,
      [group_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch settlements" });
  }
};
