import pool from "../config/db.js";

// ✅ Update a split
export const updateSplit = async (req, res) => {
  const { split_id } = req.params;
  const { share } = req.body;
  try {
    const result = await pool.query(
      `UPDATE splits SET share = $1 WHERE id = $2 RETURNING *`,
      [share, split_id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Split not found" });
    }
    res.json({ message: "Split updated", split: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update split" });
  }
};

// ✅ Delete a split
export const deleteSplit = async (req, res) => {
  const { split_id } = req.params;
  try {
    const result = await pool.query(
      `DELETE FROM splits WHERE id = $1 RETURNING *`,
      [split_id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Split not found" });
    }
    res.json({ message: "Split deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete split" });
  }
};
// ✅ Get splits for an expense
export const getExpenseSplits = async (req, res) => {
  const { expense_id } = req.params;            
    try {
        const result = await pool.query(

            `SELECT * FROM splits WHERE expense_id = $1`,
            [expense_id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch splits" });
    }       
};