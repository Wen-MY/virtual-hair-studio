const express = require('express');
const router = express.Router();
const database = require('../../../db-config');


router.get('/retrieve', async (req, res) => {
    try {
        const { salonId, limit, offset } = req.query;
        
        // Query to retrieve reviews from poolInfo database
        let reviewQuery = `
            SELECT 
                r.*, s.*
            FROM 
                reviews AS r
            JOIN 
                services AS s ON r.service_id = s.id
            WHERE 
                s.salon_id = ? 
        `;
        if(limit && offset){
            reviewQuery += ` LIMIT ${limit} OFFSET ${((offset)) * limit}`
        }
        const [reviewResults, reviewFields] = await database.poolInfo.execute(reviewQuery, [salonId]);
        if(reviewResults.length > 0){
        // Extract customer IDs from review results
        const customerIds = reviewResults.map(review => review.customer_id);

        // Query to retrieve usernames from poolUM database
        const userQuery = `
            SELECT 
                id, username, image_url
            FROM 
                users
            WHERE
                id IN (${customerIds.join(', ')});
        `;
        const [userResults] = await database.poolUM.execute(userQuery);
        console.log(userResults);
        // Map user IDs to usernames
        const userIdToUsername = {};
        userResults.forEach(user => {
            userIdToUsername[user.id] = user.username;
        });

        // Append usernames to review results
        const reviewsWithUsernames = reviewResults.map(review => ({
            ...review,
            username: userIdToUsername[review.customer_id]
        }));

        res.status(200).json({ message: 'Reviews retrieved successfully', results: reviewsWithUsernames });
    } else {
        res.status(404).json({message : 'No review found for the salon'})
    }
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