import pool from '../config/db.js';
export const getUsers = async (req, res) => {  
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const addUser = async (req, res) => {
    const{name,email,password}= req.body;
    try{
        const result = await pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *', [ name, email, password]);
        res.status(201).json(result.rows[0]);
    }catch(error){
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, password } = req.body;
    try {
        const result = await pool.query(
            'UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *',
            [name, email, password, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query("delete from users where id=$1",[id])
        console.log("Deleted user with id:", id);
    }catch(error){
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
    res.status(204).send([id]);
}