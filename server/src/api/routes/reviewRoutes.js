const express = require('express');
const router = express.Router();
const database = require('../../../db-config');


router.get('/retrieve', async (req, res) => {
    try {
        const { salonId, limit, offset } = req.body;
        const query = `
            SELECT 
                r.*, s.*
            FROM 
                reviews AS r
            JOIN 
                services AS s ON r.service_id = s.id
            WHERE 
                s.salon_id = ? 
            LIMIT 
                ? OFFSET ?;
        `;
        const [results, fields] = await database.poolInfo.execute(query, [salonId, limit, offset]);
        res.status(200).json({ message: 'Reviews retrieved successfully', results });
    } catch (error) {
        console.error('Error retrieving reviews:', error);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
});

router.post('/create', async (req, res) => {
    try {
        const { serviceId, rating, comment} = req.body;
        if(!serviceId || !rating){
            return res.status(400).json({ message: 'Service id or rating not provided'});
        }
        const query = `
            INSERT INTO reviews (service_id, rating, comment)
            VALUES (?, ?, ?);
        `;
        const [result] = await database.poolInfo.execute(query, [serviceId, rating, comment, createdAt]);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Review created successfully!' });
        } else {
            res.status(500).json({ message: 'Failed to create review.' });
        }
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
});

module.exports = router;