const express = require('express');
const router = express.Router();
const database = require('../../../db-config');
const DateUtils = require('../../utils/sqlDateFormatter')

// retrieve all appointment by current user ownership
router.get('/retrieve', async (req, res) => {
    try {
        // check user role
        const [userGroup] = await database.poolUM.execute('SELECT group_id FROM user_group WHERE user_id = ?', [req.userId]);
        const userGroupId = userGroup.length > 0 ? userGroup[0].group_id : null;
        // Define base query and parameters
        let baseQuery;
        let countQuery;
        let queryParams = [];

        if (userGroupId === 3) { //temp OR statment for development purpose
            // Customer
            baseQuery = `
                SELECT appointments.*, services.service_name, services.duration , salons.name
                FROM appointments
                JOIN services ON appointments.service_id = services.id
                JOIN salons ON services.salon_id = salons.id
                WHERE appointments.customer_id = ?`;
            countQuery = `
                SELECT COUNT(appointments.id) as total
                FROM appointments
                JOIN services ON appointments.service_id = services.id
                JOIN salons ON services.salon_id = salons.id
                WHERE appointments.customer_id = ?`;
            queryParams.push(req.userId);
        } else if (userGroupId === 4 || userGroupId === 2) {
            // Owner
            baseQuery = `
                SELECT appointments.*, services.service_name, services.duration
                FROM appointments
                JOIN services ON appointments.service_id = services.id
                JOIN salons ON services.salon_id = salons.id
                WHERE salons.user_id = ?`;
            countQuery = `
                SELECT COUNT(appointments.id) as total
                FROM appointments
                JOIN services ON appointments.service_id = services.id
                JOIN salons ON services.salon_id = salons.id
                WHERE salons.user_id = ?`;
            queryParams.push(req.userId);
        } else {
            // Unauthorized user
            return res.status(403).json({ message: 'Unauthorized access' });
        }
        // Add filter conditions dynamically
        const { status, searchTerm, limit, currentPage, range } = req.query;

        if (status) {
            baseQuery += ' AND appointments.status = ?';
            countQuery += ' AND appointments.status = ?';
            queryParams.push(status);
        }
        if (searchTerm) {
            baseQuery += ` AND (services.service_name LIKE '%${searchTerm}%' OR salons.name LIKE '%${searchTerm}%')`;
            countQuery += ` AND (services.service_name LIKE '%${searchTerm}%' OR salons.name LIKE '%${searchTerm}%')`;
        }
        if (range) {
            const startDate = range.split('_')[0];
            const endDate = range.split('_')[1];
            baseQuery += ' AND DATE(appointments.booking_datetime) BETWEEN ? AND ?';
            countQuery += ' AND DATE(appointments.booking_datetime) BETWEEN ? AND ?';
            queryParams.push(DateUtils.getDateOnly(startDate), DateUtils.getDateOnly(endDate));
        }
        // Query for count first to obtain total appointment
        const [countResult] = await database.poolInfo.execute(countQuery, queryParams);
        const totalResults = countResult[0].total;

        // Pagination query 
        if (limit && currentPage)
            baseQuery += ` LIMIT ${limit} OFFSET ${((currentPage) - 1) * limit}`;

        //queryParams.push(limit, ((currentPage) - 1) * limit);
        //console.log(baseQuery);
        const [results, fields] = await database.poolInfo.execute(baseQuery, queryParams);
        if (results.length > 0) {
            const appointmentIdList = results.map(appointment => appointment.id);
            const updatedAppointments = await UpdateAppointmentStatus(appointmentIdList);
            const [updatedResults, fields] = await database.poolInfo.execute(baseQuery, queryParams); //requery the updated data
            const customerIds = updatedResults.map(result => result.customer_id);

            if (userGroupId === 4 || userGroupId === 2) {
                const customerData = await getAppointmentCustomer(customerIds);
                // Append customer information to the appointment results
                updatedResults.forEach(appointment => {
                    const customer = customerData.find(customer => customer.id === appointment.customer_id);
                    if (customer) {
                        appointment.customer_username = customer.username;
                        appointment.customer_first_name = customer.first_name;
                        appointment.customer_last_name = customer.last_name;
                        appointment.customer_image_url = customer.image_url;
                    }
                });
            }
            res.status(200).json({ message: 'User\'s appointment retrieve sucessfully', results: updatedResults, totalResults: totalResults });
        }
        else {
            res.status(200).json({ message: 'User\'s appointment retrieve sucessfully, no result', totalResults: totalResults });
        }
    } catch (error) {
        console.error('Error during get user\'s appointment info:', error);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
});
// create appointment
router.post('/create', async (req, res) => {
    try {
        const { serviceId, bookingDateTime, hairstylistId, remarks } = req.body;

        if (serviceId && bookingDateTime && hairstylistId) {
            // Check service availability
            const [serviceAvailability] = await database.poolInfo.execute('SELECT availability FROM services WHERE id = ?', [serviceId]);

            if (serviceAvailability.length > 0 && serviceAvailability[0].availability > 0) {
                // Service is available, proceed with appointment creation
                const result = await database.poolInfo.execute(
                    'INSERT INTO appointments (customer_id, service_id,hairstylist_id, booking_datetime, status, remarks) VALUES (?,?,?,?,?,?)',
                    [req.userId, serviceId, hairstylistId, bookingDateTime, 'PENDING', remarks ? remarks : null]
                );
                //console.log(result);
                if (result[0].affectedRows > 0) {
                    // Appointment made successfully
                    res.status(201).json({ message: 'Appointment made successfully!' });
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
        console.error('Error during create user\'s appointment:', error);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
});
// get appointment details by appointmentId
router.get('/get/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Check if the appointment exists and belongs to the current user
        if (checkAppointmentOwnership(req.userId, id)) {
            // Build the base update query
            const [appointmentResults] = await database.poolInfo.execute(
                `SELECT 
                appointments.*, 
                services.service_name, services.desc, services.duration ,
                hairstylists.name as hairstylist_name,hairstylists.position as hairstylist_position,hairstylists.image_url as hairstylist_image,
                salons.name, salons.address, salons.image_url as salon_image
                    FROM appointments
                    JOIN services ON appointments.service_id = services.id
                    JOIN hairstylists ON appointments.hairstylist_id = hairstylists.id
                    JOIN salons ON services.salon_id = salons.id
                    WHERE appointments.id = ?`,
                [id]
            );
            const customerData = await getAppointmentCustomer([appointmentResults[0].customer_id]);
            // Assuming getAppointmentCustomer returns an array of customers
            const appointment = appointmentResults[0];

            // Check if customerData has at least one customer
            if (customerData.length > 0) {
                const customer = customerData.find(customer => customer.id === appointment.customer_id);
                if (customer) {
                    // Update appointment properties
                    appointment.customer_username = customer.username;
                    appointment.customer_first_name = customer.first_name;
                    appointment.customer_last_name = customer.last_name;
                    appointment.customer_image_url = customer.image_url;
                    appointment.customer_email = customer.email;
                    appointment.customer_gender = customer.gender;
                }
            }
            if (appointmentResults.length > 0) {
                res.status(200).json({ message: 'Appointment details queried successfully!', result: appointment });
            } else {
                res.status(404).json({ message: 'Failed to retrieve appointment details. Appointment not found' });
            }
        } else {
            res.status(401).json({ message: 'Invalid request. Appointment not found or does not belong to the current user.' });
        }
    } catch (error) {
        console.error('Error during getting user\'s appointment info:', error);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
});
// get appointment details by appointmentId
router.post('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the appointment exists and belongs to the current client or owner 
        if (checkAppointmentOwnership(req.userId, id)) {
            // Build the base update query
            let updateQuery = 'UPDATE appointments SET ';

            // Parameters for the query
            const queryParams = [];

            // Check for fields in the request body and add them to the query dynamically
            if (req.body.bookingDateTime) {
                updateQuery += 'booking_datetime = ?, ';
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
            if (updateResult[0].affectedRows > 0) {
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
// get timeslot available for selected datetime
router.get('/timeslots', async (req, res) => {
    try {
        const { serviceId, appointmentDate } = req.query;
        if (!serviceId || !appointmentDate)
            return res.status(400).json({ message: 'Bad request, service id , appointment date is not provided' });

        // Get salon id and duration of the service
        const [serviceInfo] = await database.poolInfo.execute('SELECT salon_id, duration FROM services WHERE id = ?', [serviceId]);
        if (serviceInfo.length === 0)
            return res.status(404).json({ message: 'Service not found' });
        const { salon_id, duration } = serviceInfo[0];

        // Get salon business hour
        const [salonInfo] = await database.poolInfo.execute('SELECT business_hour FROM salons WHERE id = ?', [salon_id]);
        if (salonInfo.length === 0)
            return res.status(404).json({ message: 'Salon not found' });

        const { business_hour } = salonInfo[0];
        const [businessDay, businessHour] = business_hour.split('/');
        const [businessStartDay, businessEndDay] = businessDay.split('-');
        const [businessStartHour, businessEndHour] = businessHour.split('-');
        //check salon operate day 
        const appointmentDay = new Date(appointmentDate).getDay();
        if (appointmentDay < businessStartDay || appointmentDay > businessEndDay) {
            return res.status(400).json({ message: 'Salon is closed on the selected day' });
        }

        // Get appointments for the given salon and appointment date
        const [appointmentResults] = await database.poolInfo.execute(
            `SELECT a.*, s.duration
            FROM appointments AS a
            INNER JOIN services AS s ON a.service_id = s.id
            WHERE s.salon_id = ? 
            AND DATE(a.booking_datetime) = ?
            AND a.status NOT IN ('CANCELLED', 'COMPLETED')`,
            [salon_id, appointmentDate]
        );

        // Calculate occupied time slots
        const occupiedTimeSlots = [];
        appointmentResults.forEach(appointment => {
            const startDateTime = new Date(appointment.booking_datetime);
            const endDateTime = new Date(startDateTime.getTime() + (appointment.duration * 60000)); // Convert duration to milliseconds
            occupiedTimeSlots.push({ start: startDateTime, end: endDateTime });
        });
        //console.log(occupiedTimeSlots);
        // Generate unoccupied time slots based on salon business hours and occupied time slots
        const unoccupiedTimeSlots = [];

        // Parse business start and end hours with minutes to minutes only
        const [businessStartHourInt, businessStartMinute] = businessStartHour.split(':').map(str => parseInt(str));
        const [businessEndHourInt, businessEndMinute] = businessEndHour.split(':').map(str => parseInt(str));

        const businessStartTime = businessStartHourInt * 60 + businessStartMinute;
        const businessEndTime = businessEndHourInt * 60 + businessEndMinute;

        //console.log(businessStartTime);
        //console.log(businessEndTime);
        // Iterate over each hour within the business hours
        for (let slot = businessStartTime; slot <= businessEndTime; slot += duration) {
            // Set start and end time for the current hour
            const startTime = new Date(appointmentDate);
            startTime.setHours(Math.floor(slot / 60), slot % 60, 0, 0);

            const endTime = new Date(appointmentDate);
            endTime.setHours(Math.floor((slot + duration) / 60), (slot + duration) % 60, 0, 0);
            //console.log(startTime , ' to ',endTime);
            // Check if the time slot is occupied
            const isOccupied = occupiedTimeSlots.some(slot_occupied => {
                return (startTime >= slot_occupied.start && startTime < slot_occupied.end) || (endTime > slot_occupied.start && endTime <= slot_occupied.end);
            });

            // If the time slot is not occupied, add it to the unoccupiedTimeSlots array
            if (!isOccupied) {
                unoccupiedTimeSlots.push({ start: startTime, end: endTime });
            }
        }

        //console.log(unoccupiedTimeSlots);


        res.json(unoccupiedTimeSlots);
    } catch (error) {
        console.error('Error during retrive available timeslot:', error);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
});
// get next appointment upcoming (owner use only , client user will not get result)
router.get('/getNext', async (req, res) => {
    try {
        const userId = req.userId;
        const appointmentResults = await database.poolInfo.execute(
            `SELECT a.id, 
            a.customer_id, 
            TIME_FORMAT(a.booking_datetime, '%H:%i') AS booking_time, 
            s.service_name
            FROM appointments AS a
            INNER JOIN services AS s ON a.service_id = s.id
            INNER JOIN salons AS sl ON s.salon_id = sl.id
            WHERE sl.user_id = ?
            AND a.booking_datetime > CURRENT_TIMESTAMP
            AND a.status NOT IN ('CANCELLED', 'COMPLETED')
            ORDER BY a.booking_datetime
            LIMIT 1`,  //select next upcoming appointment
            [userId] // Pass userId as a bind parameter
        );
        if (appointmentResults[0].length > 0) {
            const { id, customer_id, booking_datetime, service_name } = appointmentResults[0][0];
            const customerName = await database.poolUM.execute(
                `SELECT username , first_name , last_name , image_url
                FROM users 
                WHERE id = ?`,
                [customer_id]
            );
            if (appointmentResults) {
                const results = [appointmentResults[0][0], customerName[0][0]];
                return res.status(200).json(results);
            }
        } else
            return res.status(404).json({ message: 'No upcoming appointment found.' })

    } catch (error) {
        console.error('Error during get upcoming appointment of current salon:', error);
        return res.status(500).json({ message: 'Internal Server Error.' });
    }
});
// get all active appointment (owner use only , active appointment : confirmed , cancelled , pending)
router.get('/getActive', async (req, res) => {
    try {
        const userId = req.userId;
        const [appointmentResults] = await database.poolInfo.execute(
            `SELECT a.*
            FROM appointments AS a
            INNER JOIN services AS s ON a.service_id = s.id
            INNER JOIN salons AS sl ON s.salon_id = sl.id
            WHERE sl.user_id = ?
            AND a.booking_datetime > CURRENT_TIMESTAMP
            AND a.status NOT IN ('COMPLETED')
            ORDER BY a.booking_datetime`
            ,  //select all active upcoming appointment
            [userId]
        );
        if (appointmentResults.length > 0) {
            return res.status(200).json(appointmentResults);
        } else
            return res.status(404).json({ message: 'No active upcoming appointment found.' })

    } catch (error) {
        console.error('Error during get active appointment of current salon:', error);
        return res.status(500).json({ message: 'Internal Server Error.' });
    }
})

//----------------------------------------
// Function to check appointment ownership
const checkAppointmentOwnership = async (userId, appointmentId) => {
    const [ownershipCheckClient] = await database.poolInfo.execute(
        'SELECT customer_id FROM appointments WHERE id = ?',
        [appointmentId]
    );
    const [ownershipCheckOwner] = await database.poolInfo.execute(
        `SELECT salons.user_id FROM salons  
        JOIN services ON salons.id = services.salon_id 
        JOIN appointments ON services.id = appointments.service_id
        WHERE appointments.id = ?`,
        [appointmentId]
    );
    return (
        ownershipCheckClient.length > 0 && ownershipCheckClient[0].customer_id === userId
        ||
        ownershipCheckOwner.length > 0 && ownershipCheckOwner[0].user_id === userId
    )
}
// Function to update appointment statuses
const UpdateAppointmentStatus = async (appointmentIdList) => {
    try {
        const overdueDate = new Date();
        overdueDate.setDate(overdueDate.getDate() - 1);
        const appointmentIds = appointmentIdList.join(',');
        // Update appointment statuses for confirmed appointments
        const updateQuery = `
            UPDATE appointments
            SET status = 'COMPLETED'
            WHERE id IN (${appointmentIds}) 
            AND status = 'CONFIRMED' 
            AND DATE(booking_datetime) <= ?`;

        const [updateResult] = await database.poolInfo.execute(updateQuery, [overdueDate]);
        // Return the updated appointments or any other necessary data
        return updateResult;
    } catch (error) {
        console.error('Error updating appointment statuses:', error);
        throw error;
    }
}
// Function to get all appointment customer by array of customerIds
const getAppointmentCustomer = async (customerIds) => {
    const uniqueCustomerIds = [...new Set(customerIds)];
    const query = `
            SELECT id , username, first_name, email , last_name , image_url , gender FROM users WHERE id IN (${uniqueCustomerIds.join(', ')})`;
    //console.log(query);
    try {
        const [result] = await database.poolUM.execute(query);
        return result;
    }
    catch (error) {
        console.error('Error getting customer name : ', error);
        throw error;
    }
}
//
//------------------------------------------
module.exports = router;