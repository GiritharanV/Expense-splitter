import pool from '../config/db.js';

export const getUsers = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY id DESC");
    const totalCount = (await pool.query("SELECT COUNT(*) FROM users")).rows[0].count;

    res.status(200).json({
      success: true,
      message: "User data fetched successfully.",
      data: result.rows,
      totalCountOfUsers: parseInt(totalCount, 10),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: `Data fetch failed: ${err.message}`,
    });
  }
};

export const addUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "name, email, and password are required.",
      });
    }

    const existing = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already exists. Please use a different email.",
      });
    }

    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, password]
    );

    res.status(201).json({
      success: true,
      message: "User added successfully.",
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: `Problem adding user: ${err.message}`,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: "User ID required" });
    }

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required for update.",
      });
    }

    const checkEmail = await pool.query("SELECT * FROM users WHERE email = $1 AND id <> $2", [email, id]);
    if (checkEmail.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already exists. Please use a different email.",
      });
    }

    const result = await pool.query(
      "UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *",
      [name, email, password, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: `Error updating user: ${err.message}`,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User id required",
      });
    }

    const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);

    console.log(result.rows);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error deleting user",
    });
  }
};
