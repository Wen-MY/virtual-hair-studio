const express = require('express');
const router = express.Router();
const database = require('../../../db-config');
//add more necessary config

//
router.post('/url', async (req, res) => {
    //map request to local var
    const { params1, params2 } = req.body;

    //logic 
    
    //start db query
    try {
        const [rows, fields] = await database.poolUM.execute('SELECT * FROM table_name WHERE column_name = ?', [params1]);

        if (rows.length > 0) {
            if (match) {
                //reply with response
                res.status(200).json({ message: 'Successful!', user: userData });
            } else {
                res.status(401).json({ message: 'Unauthorized.' });
            }
        } else {
            res.status(404).json({ message: 'Not Found message.' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
});