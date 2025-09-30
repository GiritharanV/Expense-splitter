import pool from '../config/db.js';

export const createGroup = async (req, res) => {
  try {
    const { name, created_by, memberIds } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Group name is required.",
      });
    }

    const groupResult = await pool.query(
      `INSERT INTO groups (name, created_by, created_at) 
       VALUES ($1, $2, NOW()) 
       RETURNING group_id, name, created_by, created_at`,
      [name, created_by]
    );

    const groupId = groupResult.rows[0].group_id;

    if (memberIds && memberIds.length > 0) {
      for (let userId of memberIds) {
        await pool.query(
          `INSERT INTO group_members (group_id, user_id, joined_at) 
           VALUES ($1, $2, NOW())`,
          [groupId, userId]
        );
      }
    }

    res.status(201).json({
      success: true,
      message: "Group created successfully.",
      data: groupResult.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: `Failed to create group: ${err.message}`,
    });
  }
};

export const getGroups = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT g.group_id, g.name, g.created_by, g.created_at,
       array_agg(gm.user_id)  AS members
       FROM groups g
       LEFT JOIN group_members gm ON g.group_id = gm.group_id
       GROUP BY g.group_id, g.name, g.created_by, g.created_at
       ORDER BY g.group_id DESC`
    );

    const totalCount = (await pool.query("SELECT COUNT(*) FROM groups")).rows[0].count;

    res.status(200).json({
      success: true,
      message: "Groups fetched successfully.",
      data: result.rows,
      totalCountOfGroups: parseInt(totalCount, 10),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: `Failed to fetch groups: ${err.message}`,
    });
  }
};
