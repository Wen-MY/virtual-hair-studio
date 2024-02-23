const express = require('express');
const router = express.Router();
const database = require('../../../db-config');


//get all with pagination
router.get('/retrieve',async (req,res) => {
    try{
        let baseQuery;
        let countQuery;
        let queryParams = [];
        baseQuery = `
        SELECT 
        salons.*, 
        ROUND(AVG(CAST(reviews.rating AS FLOAT)), 1) AS average_rating
        FROM salons
        LEFT JOIN services ON salons.id = services.salon_id
        LEFT JOIN reviews ON services.id = reviews.service_id
        GROUP BY salons.id;
        `;
        countQuery = `
        SELECT COUNT(salons.id) as total
        FROM salons
        `

        // Add filter conditions dynamically
        const { searchFilter, locationFilter, limit = 16, currentPage = 1 } = req.query;

        if (searchFilter) {
            baseQuery += ` AND (salons.name LIKE '%${searchFilter}%'`;
            countQuery += ` AND (salons.name LIKE '%${searchFilter}%'`;
        }
        
        if (locationFilter) {
            baseQuery += ` AND salons.state = ${locationFilter}`;
            countQuery += ` AND salons.state = ${locationFilter}`;
        }

        // Query for count first to obtain total appointment
        const [countResult] = await database.poolInfo.execute(countQuery, queryParams);
        const totalResults = countResult[0].total;

        // Pagination query 
        baseQuery += ` LIMIT ${limit} OFFSET ${((currentPage) - 1) * limit}`;
        //queryParams.push(limit, ((currentPage) - 1) * limit);
        const [results, fields] = await database.poolInfo.execute(baseQuery, queryParams);
        if (results.length > 0) {
            res.status(200).json({ message: 'Salon retrieve sucessfully', results: results, totalResults: totalResults });
        }
        else {
            res.status(200).json({ message: 'Salon appointment retrieve sucessfully, no result', totalResults: totalResults });
        }
    } catch (error) {
        console.error('Error during get salon info:', error);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
})

//get all information related to the salon
router.get('/get/:salonId',async (req,res) => {
    try{
        const {salonId} = req.params;
        if(!salonId){
            return res.status(400).json({message: 'Invalid request, salon id required'});
        }
        const [salonResult] = await database.poolInfo.execute(`SELECT salons.id,salons.name,salons.address, salons.state,salons.contact_number,salons.business_hour FROM salons WHERE id = ?`,[salonId]);
        console.log(salonId ,':' ,salonResult);
        if(salonResult.length > 0){
            res.status(200).json({ message: 'Salon details queried successfully!' , result: salonResult[0]})
        }else{
            res.status(404).json({ message: 'Failed to retrieve salon details. Salon not found'})
        }
    }catch (error) {
        console.error('Error during get salon info:', error);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
})

//update , check for user Id for its relevant salon, else unauthorized
router.put('/update/:salonId', async (req, res) => {
    try {
        const { salonId } = req.params;
        const userId = req.userId;
        const { name, address, state, contact_number, business_hour } = req.body;

        // Check if salon exists and belongs to the logged-in user
        const [salonResult] = await database.poolInfo.execute(`SELECT * FROM salons WHERE id = ? AND user_id = ?`, [salonId, userId]);
        
        if (salonResult.length === 0) {
            return res.status(401).json({ message: 'Unauthorized. Salon not found or does not belong to the user.' });
        }

        // Check if required fields are provided
        if (!name || !address || !state || !business_hour) {
            return res.status(400).json({ message: 'Name, address, state, and business_hour are required fields.' });
        }

        // Update salon information
        const [updateResult] = await database.poolInfo.execute(
            `UPDATE salons SET name = ?, address = ?, state = ?, contact_number = ?, business_hour = ? WHERE id = ?`,
            [name, address, state, contact_number, business_hour, salonId]
        );

        if (updateResult.affectedRows > 0) {
            res.status(200).json({ message: 'Salon updated successfully!' });
        } else {
            res.status(500).json({ message: 'Failed to update salon.' });
        }
    } catch (error) {
        console.error('Error during salon update:', error);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
});

//owner single use to create his/her salon
router.post('/create', async (req, res) => {
    try {
        const userId = req.userId;
        const { name, address, state, contact_number, business_hour } = req.body;

        // Check if required fields are provided
        if (!name || !address || !state || !business_hour) {
            return res.status(400).json({ message: 'Name, address, state, and business_hour are required fields.' });
        }

        // Create new salon
        const [createResult] = await database.poolInfo.execute(
            `INSERT INTO salons (user_id, name, address, state, contact_number, business_hour) VALUES (?, ?, ?, ?, ?, ?)`,
            [userId, name, address, state, contact_number, business_hour]
        );

        if (createResult.affectedRows > 0) {
            res.status(200).json({ message: 'Salon created successfully!' });
        } else {
            res.status(500).json({ message: 'Failed to create salon.' });
        }
    } catch (error) {
        console.error('Error during salon creation:', error);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
});

module.exports = router;