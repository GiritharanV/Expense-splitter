import pool from '../config/db.js';

export const addGroupmember = async (req, res) => {
  try {
    const { group_id, user_id } = req.body;

    if (!group_id || !user_id) {
      return res.status(400).json({
        success: false,
        message: "Group ID and User ID are required.",
      });
    }

    const result = await pool.query(
      `INSERT INTO group_members (group_id, user_id, joined_at) 
       VALUES ($1, $2, NOW()) RETURNING *`,
      [group_id, user_id]
    );

    res.status(201).json({
      success: true,
      message: "Member added to group successfully.",
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: `Failed to add member to group: ${err.message}`,
    });
  }
};

export const removeGroupmember = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Group member ID required.",
      });
    }

    const result = await pool.query(
      `DELETE FROM group_members WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Member not found in group.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Member removed from group successfully.",
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: `Failed to remove member from group: ${err.message}`,
    });
  }
};

export const getGroupmembers = async (req, res) => {
  try {
    const { group_id } = req.params;

    if (!group_id) {
      return res.status(400).json({
        success: false,
        message: "Group ID required.",
      });
    }

    const result = await pool.query(
      `SELECT gm.id, gm.user_id, u.name, u.email
       FROM group_members gm
       JOIN users u ON gm.user_id = u.id
       WHERE gm.group_id = $1`,
      [group_id]
    );

    res.status(200).json({
      success: true,
      message: "Group members fetched successfully.",
      data: result.rows,
      totalCountOfMembers: result.rows.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: `Failed to fetch group members: ${err.message}`,
    });
  }
};
