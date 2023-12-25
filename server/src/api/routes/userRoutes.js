const express = require('express');
const router = express.Router();
const database = require('../../../db-config');
const bcrypt = require('bcrypt'); // for password hashing


// Sign In
router.post('/signin', async (req, res) => {
    const { username, password } = req.body;

    // More logic to prevent SQL injection
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    try {
        const [rows, fields] = await database.poolUM.execute('SELECT * FROM users WHERE username = ?', [username]);

        if (rows.length > 0) {
            const user = rows[0];
            const match = await bcrypt.compare(password, user.password);

            if (match) {
                // Store user information in the session
                req.session.user = {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    gender: user.gender
                };
                res.status(200).json({ message: 'Signin successful!' });
            } else {
                res.status(401).json({ message: 'Invalid credentials.' });
            }
        } else {
            res.status(404).json({ message: 'User not found.' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
});

router.get('/validate/email/:email', async (req, res) => {
    try {
        const { email } = req.params;

        const [rows, fields] = await database.poolUM.execute('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length > 0) {
            res.status(200).json({ valid: false, message: 'Email already exists.' });
        } else {
            res.status(200).json({ valid: true, message: 'Email is available.' });
        }
    } catch (error) {
        console.error('Error during email validation:', error);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
});
router.get('/validate/username/:username', async (req, res) => {
    try {
        const { username } = req.params;

        const [rows, fields] = await database.poolUM.execute('SELECT * FROM users WHERE username = ?', [username]);

        if (rows.length > 0) {
            res.status(200).json({ valid: false, message: 'Username already exists.' });
        } else {
            res.status(200).json({ valid: true, message: 'Username is available.' });
        }
    } catch (error) {
        console.error('Error during username validation:', error);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
});

// Create User
router.post('/create', async (req, res) => {
    try {
        const { first_name ,last_name ,email, password,} = req.body;

        if (!email || !password || !first_name || !last_name) {
            return res.status(400).json({ message: 'Username/Email and password are required.' });
        }

        // Hash the password before storing it in the database
        const hash = await bcrypt.hash(password, 10);

        const [rows, fields] = await database.poolUM.execute('INSERT INTO users (username, password, email, first_name,last_name) VALUES (?, ?, ?, ?, ?)', [email, hash, email,first_name,last_name]);

        res.status(201).json({ message: 'User created successfully!' });
    } catch (error) {
        console.error('Error during user creation:', error);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
});

// Delete User
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [results, fields] = await database.poolUM.execute('DELETE FROM users WHERE id = ?', [id]);

        if (results.affectedRows > 0) {
            res.status(200).json({ message: 'User deleted successfully!' });
        } else {
            res.status(404).json({ message: 'User not found.' });
        }
    } catch (error) {
        console.error('Error during user deletion:', error);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
});

module.exports = router;