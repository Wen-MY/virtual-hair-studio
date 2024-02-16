const express = require('express');
const router = express.Router();
const database = require('../../../db-config');


router.get('/get/:salonId', async (req, res) => {
    try {
        const { salonId } = req.params;

        // Query to retrieve all hairstylists by salonId
        const [hairstylists] = await database.poolInfo.execute(
            'SELECT * FROM hairstylists WHERE salon_id = ?',
            [salonId]
        );
        res.status(200).json({ result : hairstylists });
    } catch (error) {
        console.error('Error fetching hairstylists:', error);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
});

router.post('/add', async (req, res) => {
    try {
        const { name, salonId, position } = req.body;

        // Check if all required fields are provided
        if (!name || !salonId || !position) {
            return res.status(400).json({ message: 'Name, salon id, and position are required.' });
        }

        // Insert the new hairstylist into the database
        const [result] = await database.poolInfo.execute(
            'INSERT INTO hairstylists (name, salon_id, position) VALUES (?, ?, ?)',
            [name, salonId, position]
        );

        if (result.affectedRows > 0) {
            res.status(201).json({ message: 'Hairstylist added successfully.' });
        } else {
            res.status(500).json({ message: 'Failed to add hairstylist.' });
        }
    } catch (error) {
        console.error('Error adding hairstylist:', error);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
});

module.exports = router;