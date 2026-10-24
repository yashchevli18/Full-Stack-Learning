const db = require('../config/db');

// CREATE USER
const createUser = async (req, res) => {
    try {
        const { name, email, phone, gender, status } = req.body;

        const sql = `INSERT INTO users (name, email, phone, gender, status) VALUES (?, ?, ?, ?, ?)`;
        const [result] = await db.execute(sql, [
            name,
            email,
            phone,
            gender,
            status || 'Active'
        ]);

        const [users] = await db.execute("SELECT * FROM users WHERE id = ?", [result.insertId]);
        res.status(201).json({
            message: "User created successfully",
            user: users[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const getUsers = async (req, res) => {
    try {
        const sql = "SELECT * FROM users";

        const [users] = await db.execute(sql);
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const sql = "SELECT * FROM users WHERE id = ?";
        const [users] = await db.execute(sql, [id]);

        if (users.length === 0) {
            return res.status(400).json({ message: "User not found" });
        }
        res.status(200).json(users[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        const { name, email, phone, gender, status } = req.body;

        const [existingUser] = await db.execute("SELECT * FROM users WHERE id = ?", [id]);
        if (existingUser.length === 0) {
            return res.status(400).json({ message: "User not found" });
        }

        const sql = `UPDATE users SET name = ?, email = ?, phone = ?, gender = ?, status = ? WHERE id = ?`;
        await db.execute(sql, [name, email, phone, gender, status, id]);

        const [updatedUser] = await db.execute("SELECT * FROM users WHERE id = ?", [id]);
        res.status(200).json({
            message: "User updated successfully",
            user: updatedUser[0]
        });
    } catch (error) {
        console.error(error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: "Email already exists" });
        }
        res.status(500).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const sql = "DELETE FROM users WHERE id = ?";
        const [result] = await db.execute(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
};

