const express = require('express');
const router = express.Router();
const database = require('../../../db-config');
const bcrypt = require('bcrypt'); // for password hashing

router.get('/', async (req,res) =>{
    try {
        if (req.session.user) {
            const [role] = await database.poolUM.execute('SELECT groups.id FROM `groups` JOIN user_group ON user_group.group_id = groups.id WHERE user_group.user_id = ?',[req.session.user.id]);
            res.status(200).json({ login: true, message: 'Logged in', role: role[0] });
        } else {
            res.status(200).json({ login: false, message: 'Not logged in' });
        }
      } catch (error) {
        console.error('Error during login status check:', error);
        res.status(500).json({ login: null, message: 'Internal Server Error' });
    }
})

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
                const userData = {
                    id: user.id,
                    username: user.username,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    gender: user.gender
                };
                req.session.user = userData;
                res.status(200).json({ message: 'Signin successful!', userData: userData});
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

// Validate email existed (pending , wrong status send actually)
router.get('/validate/email/:email', async (req, res) => {
    try {
        const { email } = req.params;

        const [rows, fields] = await database.poolUM.execute('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length > 0) {
            res.status(422).json({ valid: false, message: 'Email already exists.' });
        } else {
            res.status(200).json({ valid: true, message: 'Email is available.' });
        }
    } catch (error) {
        console.error('Error during email validation:', error);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
});
// Validate username existed (pending , wrong status send actually)
router.get('/validate/username/:username', async (req, res) => {
    try {
        const { username } = req.params;

        const [rows, fields] = await database.poolUM.execute('SELECT * FROM users WHERE username = ?', [username]);

        if (rows.length > 0) {
            res.status(422).json({ valid: false, message: 'Username already exists.' });
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
        const { type , username, password} = req.body;

        if (!username || !password || !type) {
            return res.status(400).json({ message: 'Username and password are required.' });
        }
        // Hash the password before storing it in the database
        const hash = await bcrypt.hash(password, 10);
        //insert new user into user table
        const [rows, fields] = await database.poolUM.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash]);
        //get user id from user last query
        const userId = rows.insertId;
        //insert user to user_group table to assign authorities
        const [result,values] = await database.poolUM.execute('INSERT INTO user_group (user_id,group_id) VALUES (?,?)',[userId,type=="1"?3:4]);
        //create respective default salon for the owner type user
        if(result){
            const userData = {
                id: userId,
                username: username,
            };
            req.session.user = userData;
            console.log('userid :' , req.session.user.id);
            res.status(201).json({ message: 'User created successfully!' });
        }
        else
            res.status(400).json({ message: 'Failed to create user.' });
    } catch (error) {
        console.error('Error during user creation:', error);
        return res.status(500).json({ message: 'Internal Server Error.' });
    }
});

module.exports = router;