const express = require('express');
const router = express.Router();
const database = require('../../../db-config');


//by salon id
router.get('/all/:salonId', async (req, res) => {
    try {
        const { salonId } = req.params;
        const { status } = req.query;

        if (!salonId) {
            return res.status(400).json({ message: 'Bad request, salon Id not provided' });
        }

        let sqlQuery = 'SELECT services.*, categories.name AS category FROM services JOIN categories ON services.category_id = categories.id WHERE salon_id = ?';
        const sqlParams = [salonId];

        if (status !== undefined) {
            if (status !== '0' && status !== '1') {
                return res.status(400).json({ message: 'Bad request, status should be 0 or 1' });
            }
            sqlQuery += ' AND availability = ?';
            sqlParams.push(status);
        }

        const [serviceResults] = await database.poolInfo.execute(sqlQuery, sqlParams);

        if (serviceResults.length > 0) {
            return res.status(200).json({
                message: 'Services of salon retrieved successfully',
                result: serviceResults
            });
        } else {
            return res.status(200).json({
                message: 'No services found in salon',
            });
        }
    } catch (error) {
        console.error(`Error retrieving services of salon id: ${salonId} `, error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});


//get service by service id
router.get('/get/:serviceId', async (req, res) => {
    try {
        const { serviceId } = req.params;

        // Query to retrieve service information
        const [serviceResult] = await database.poolInfo.execute(
            'SELECT * FROM services WHERE id = ?',
            [serviceId]
        );

        if (serviceResult.length === 0) {
            return res.status(404).json({ message: 'Service not found' });
        }

        // Query to retrieve hairstylists assigned to the service
        const [hairstylistResult] = await database.poolInfo.execute(
            `SELECT hairstylists.id, hairstylists.name
            FROM hairstylists
            INNER JOIN hairstylist_scopes ON hairstylists.id = hairstylist_scopes.hairstylist_id
            WHERE hairstylist_scopes.service_id = ?`,
            [serviceId]
        );

        // Separate service information and hairstylist list into different results
        const serviceInfo = serviceResult[0];
        const hairstylistList = hairstylistResult;

        // Return the results
        res.status(200).json({ service: serviceInfo, hairstylists: hairstylistList });
    } catch (error) {
        console.error('Error fetching service information:', error);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
});


router.post('/add:salonId', async (req,res) =>{
    try{
        const {salonId} = req.params;
        if(!salonId)
            return res.status(400).json({message: 'Bad request , salon Id not provided'})
        const {serviceName, categoryId, duration,hairstylists, desc} = req.body;
        if(!serviceName || !categoryId || !duration)
            return res.status(400).json({ message: 'Bad request, service name , category or duration is not provided'});
        
        //check salon ownership
        const [ownershipResults] = await database.poolInfo.execute(
            'SELECT user_id FROM salons WHERE id = ?', [salonId]
        );
        const userIds = ownershipResults.map(result => result.user_id);
        const userExists = userIds.some(id => id === req.userId);

        if(userExists){
            const [serviceCreation] = await database.poolInfo.execute('INSERT INTO services (salon_id,service_name,category_id,duration,desc) VALUES(?,?,?,?,?)',[salonId,serviceName,categoryId,duration,desc]);

            
            if (serviceCreation.affectedRows > 0) {
                // Extract the new service ID
                const newServiceId = serviceCreation.insertId;
    
                // Insert records into hairstylist_scope table for each hairstylist
                if (hairstylists && Array.isArray(hairstylists) && hairstylists.length > 0) {
                    for (const hairstylistId of hairstylists) {
                        await database.poolInfo.execute(
                            'INSERT INTO hairstylist_scope (hairstylist_id, service_id) VALUES (?, ?)',
                            [hairstylistId, newServiceId]
                        );
                    }
                }
    
                res.status(201).json({ message: 'Service added successfully.' });
            } else {
                res.status(500).json({ message: 'Failed to create service.' });
            }
        }else{
            return res.status(401).json({message: 'Unauthorized, the user did not own the salon'});
        }
    }catch{
        console.error('Error during service addition: ' ,error);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
});

// delete service 
router.delete('/delete/:serviceId',async(req,res)=>{
    try{
        const {serviceId} = req.params;

        //check for usage 
        const [appointmentResult] = await database.poolInfo.execute(
            'SELECT COUNT(*) AS appointmentCount FROM appointments WHERE service_id = ? AND status NOT IN (?, ?)',
            [serviceId, 'CANCELLED', 'COMPLETED']
        );
        if (appointmentResult[0].appointmentCount > 0) {
            // Service is still in use in active appointments, cannot be deleted
            return res.status(400).json({ message: 'Service is still in use and cannot be deleted.' });
        }
        else{
            const [result] = await database.poolInfo.execute('DELETE FROM services WHERE id = ?', [serviceId]);
            if(result.affectedRows > 0)
                res.status(200).json({message: 'Service deleted successfully'});
            else
                res.status(404).json({message: 'Service not found'});
        }
    }catch (error) {
        console.error('Error during service deletion:', error);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
});

// update service
router.put('/update/:serviceId', async (req, res) => {
    try {
        const { serviceId } = req.params;
        const { serviceName, categoryId, duration, desc, availability, hairstylists } = req.body;
        
        // Initialize SQL query and parameters array
        let sqlQuery = 'UPDATE services SET ';
        const params = [];

        if (serviceName) {
            sqlQuery += 'service_name = ?, ';
            params.push(serviceName);
        }
        if (categoryId) {
            sqlQuery += 'category_id = ?, ';
            params.push(categoryId);
        }
        if (duration) {
            sqlQuery += 'duration = ?, ';
            params.push(duration);
        }
        if (desc) {
            sqlQuery += 'desc = ?, ';
            params.push(desc);
        }
        if (availability !== undefined && availability !== null) {
            sqlQuery += 'availability = ?, ';
            params.push(availability);
        }
        
        // Remove the trailing comma and space
        sqlQuery = sqlQuery.slice(0, -2);

        sqlQuery += ' WHERE id = ?';
        params.push(serviceId);

        const [results] = await database.poolInfo.execute(sqlQuery, params);

        if (results.affectedRows > 0) {
            //update scope 
            if (hairstylists && Array.isArray(hairstylists) && hairstylists.length > 0) {
                const deleteQuery = 'DELETE FROM hairstylist_scope WHERE service_id = ?';
                await database.poolInfo.execute(deleteQuery, [serviceId]); // Delete existing records
                
                const insertQuery = 'INSERT INTO hairstylist_scope (hairstylist_id, service_id) VALUES (?, ?)';
                for (const hairstylistId of hairstylists) {
                    await database.poolInfo.execute(insertQuery, [hairstylistId, serviceId]);
                }
            }
            res.status(200).json({ message: 'Service updated successfully.' });
        } else {
            res.status(404).json({ message: 'Service not found.' });
        }
    } catch (error) {
        console.error('Error updating service:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

router.get('/categorties', async (req,res) => {
    try{
        const [results] = await database.poolInfo.execute('SELECT * FROM categories',[]);
        if(results.length > 0){
            res.status(200).json({ message: 'Service categories retrieve successfully', result: results});
        }else{
            res.status(404).json({ message: 'Not service categories found'});
        }
    }catch( error) {
        console.error('Error retriving service categories:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }

})
module.exports = router;
