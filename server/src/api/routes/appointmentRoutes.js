const express = require('express');
const router = express.Router();
const database = require('../../../db-config');

router.get('/retrieve', async (req, res) => {
    try{
        // check session expiration
        const userId = req.session.user?.id;
        if(!userId) return res.status(401).json({ message: 'Failed to retrieve user account. Session expired' });
        
        // check user role
        const [userGroup] = await database.poolUM.execute('SELECT group_id FROM user_group WHERE user_id = ?', [userId]);
        const userGroupId = userGroup.length > 0 ? userGroup[0].group_id : null;
        // Define base query and parameters
        let baseQuery;
        let countQuery;
        let queryParams = [];

        if (userGroupId === 3 || userGroupId === 2) { //temp OR statment for development purpose
            // Customer
            baseQuery = `
                SELECT appointments.*, services.service_name
                FROM appointments
                JOIN services ON appointments.service_id = services.id
                WHERE appointments.customer_id = ?`;
            countQuery = `
                SELECT COUNT(appointments.id) as total
                FROM appointments
                JOIN services ON appointments.service_id = services.id
                WHERE appointments.customer_id = ?`;
            queryParams.push(userId);
        } else if (userGroupId === 4) {
            // Owner
            baseQuery = `
                SELECT appointments.*, services.service_name
                FROM appointments
                JOIN services ON appointments.service_id = services.id
                WHERE services.salon_id = ?`;
            countQuery = `
                SELECT COUNT(appointments.id) as total
                FROM appointments
                JOIN services ON appointments.service_id = services.id
                WHERE services.salon_id = ?`;
            queryParams.push(userId);
        } else {
            // Unauthorized user
            return res.status(403).json({ message: 'Unauthorized access' });
        }
        // Add filter conditions dynamically
        const { status,searchTerm, limit = 10, currentPage = 1 } = req.query;

        if (status) {
            baseQuery += ' AND appointments.status = ?';
            countQuery += ' AND appointments.status = ?';
            queryParams.push(status);
        }
        if (searchTerm) {
            baseQuery += ` AND (services.service_name LIKE '%${searchTerm}%' OR appointments.salon_name LIKE '%${searchTerm}%')`;
            countQuery += ` AND (services.service_name LIKE '%${searchTerm}%' OR appointments.salon_name LIKE '%${searchTerm}%')`;
        }
        /*
        if (fromDate) {
            baseQuery += ' AND appointments.booking_datetime >= ?';
            queryParams.push(fromDate);
        }

        if (toDate) {
            baseQuery += ' AND appointments.booking_datetime <= ?';
            queryParams.push(toDate);
        }
        */
        // Query for count first to obtain total appointment
        const [countResult] = await database.poolInfo.execute(countQuery, queryParams);
        const totalResults = countResult[0].total;

        // Pagination query 
        baseQuery += ` LIMIT ${limit} OFFSET ${((currentPage) - 1) * limit}`;
        //queryParams.push(limit, ((currentPage) - 1) * limit);
        const [results, fields] = await database.poolInfo.execute(baseQuery, queryParams);
        if(results.length > 0){
            res.status(200).json({message: 'User\'s appointment retrieve sucessfully', results: results, totalResults: totalResults});
        } 
        else {
            res.status(200).json({message: 'User\'s appointment retrieve sucessfully, no result', totalResults: totalResults});
        }
    } catch (error) {
        console.error('Error during get user\'s appointment info:', error);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
});

router.post('/create', async (req, res) => {
    try {
        // Check session expiration
        const userId = req.session.user?.id;
        if (!userId) return res.status(401).json({ message: 'Failed to retrieve user account. Session expired' });

        const { serviceId, bookingDateTime, remarks } = req.body;

        if (serviceId && bookingDateTime) {
            // Check service availability
            const [serviceAvailability] = await database.poolInfo.execute('SELECT availability FROM services WHERE id = ?', [serviceId]);

            if (serviceAvailability.length > 0 && serviceAvailability[0].availability > 0) {
                // Service is available, proceed with appointment creation
                const result = await database.poolInfo.execute(
                    'INSERT INTO appointments (customer_id, service_id, booking_datetime, status, remarks) VALUES (?,?,?,?,?)',
                    [userId, serviceId, bookingDateTime, 'PENDING', remarks ? remarks : null]
                );

                if (result.affectedRows > 0) {
                    // Appointment made successfully
                    res.status(200).json({ message: 'Appointment made successfully!' });
                } else {
                    // Failed to make appointment
                    res.status(500).json({ message: 'Failed to make appointment.' });
                }
            } else {
                // Service is not available
                res.status(400).json({ message: 'Service is currently not available.' });
            }
        } else {
            // Invalid request
            res.status(400).json({ message: 'Invalid request. Please provide service and booking date time.' });
        }
    } catch (error) {
        console.error('Error during create user\'s appointment info:', error);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
});
router.get('/get/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Check session expiration
        const userId = req.session.user?.id;
        if (!userId) return res.status(401).json({ message: 'Failed to retrieve user account. Session expired' });

        // Check if the appointment exists and belongs to the current user
        if (checkAppointmentOwnership(userId,id)) {
            // Build the base update query
            const [appointmentResults] = await database.poolInfo.execute(
                `SELECT appointments.*, services.*
                    FROM appointments
                    JOIN services ON appointments.service_id = services.id
                    WHERE appointments.id = ?`,
                [id]
            );
            if (appointmentResults.length > 0) {
                res.status(200).json({ message: 'Appointment details queried successfully!', result: appointmentResults[0] });
            } else {
                res.status(500).json({ message: 'Failed to retrieve appointment details.' });
            }
        } else {
            res.status(401).json({ message: 'Invalid request. Appointment not found or does not belong to the current user.' });
        }
    } catch (error) {
        console.error('Error during getting user\'s appointment info:', error);
        res.status(500).json({ message: 'Internal Server Error.'});
    }
});
router.post('/update/:id', async (req, res) => {
    try {
        // Check session expiration
        const userId = req.session.user?.id;
        if (!userId) return res.status(401).json({ message: 'Failed to retrieve user account. Session expired' });

        const { id } = req.params;

        // Check if the appointment exists and belongs to the current client or owner 
        if (checkAppointmentOwnership(userId,id))
            {
            // Build the base update query
            let updateQuery = 'UPDATE appointments SET ';

            // Parameters for the query
            const queryParams = [];

            // Check for fields in the request body and add them to the query dynamically
            if (req.body.bookingDateTime) {
                updateQuery += 'bookingDateTime = ?, ';
                queryParams.push(req.body.bookingDateTime);
            }

            if (req.body.status) {
                updateQuery += 'status = ?, ';
                queryParams.push(req.body.status);
            }

            if (req.body.remarks) {
                updateQuery += 'remarks = ?, ';
                queryParams.push(req.body.remarks);
            }

            // Remove the trailing comma and space
            updateQuery = updateQuery.slice(0, -2);

            // Add the WHERE clause
            updateQuery += ' WHERE id = ?';
            queryParams.push(id);

            // Execute the update query
            const updateResult = await database.poolInfo.execute(updateQuery, queryParams);

            if (updateResult.affectedRows > 0) {
                res.status(200).json({ message: 'Appointment updated successfully!' });
            } else {
                res.status(500).json({ message: 'Failed to update appointment.' });
            }
        } else {
            res.status(400).json({ message: 'Invalid request. Appointment not found or does not belong to the current user.' });
        }
    } catch (error) {
        console.error('Error during update user\'s appointment info:', error);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
});

const checkAppointmentOwnership = async (userId,appointmentId) => { 
    const [ownershipCheckClient] = await database.poolInfo.execute(
        'SELECT customer_id FROM appointments WHERE id = ?',
        [appointmentId]
    );
    const [ownershipCheckOwner] = await database.poolInfo.execute(
        'SELECT services.salon_id FROM services JOIN appointments ON services.id = appointments.service_id WHERE appointments.id = ?',
        [appointmentId]
    );
    return(
        ownershipCheckClient.length > 0 && ownershipCheckClient[0].customer_id === userId
        ||
        ownershipCheckOwner.length > 0 && ownershipCheckOwner[0].salon_id === userId
    )
}
module.exports = router;