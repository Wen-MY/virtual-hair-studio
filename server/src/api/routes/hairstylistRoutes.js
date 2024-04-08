const express = require('express');
const router = express.Router();
const database = require('../../../db-config');
const {getHairstylistThumbnail , saveHairstylistThumbnail} = require('../firestore/hairstylistCollections');
const multer = require('multer');
const upload = multer({
    storage: multer.memoryStorage(), // Store file in memory before uploading to Firebase
  });

router.get('/get/:salonId', async (req, res) => {
    try {
        const { salonId } = req.params;

        // Query to retrieve all hairstylists by salonId
        const [hairstylists] = await database.poolInfo.execute(
            'SELECT * FROM hairstylists WHERE salon_id = ? AND deleted_at IS NULL',
            [salonId]
        );
        res.status(200).json({ result: hairstylists });
    } catch (error) {
        console.error('Error fetching hairstylists:', error);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
});

router.post('/add/:salonId', upload.single('image'), async (req, res) => {
    try {
        const { salonId } = req.params;
        const { name, position } = req.body;
        const image = req.file.buffer;
        // Check if all required fields are provided
        if (!name || !salonId || !position) {
            return res.status(400).json({ message: 'Name, salon id, and position are required.' });
        }
        if (!image) {
            return res.status(400).json({ message: "Hairstylist's image are required." });
        }
        // Insert the new hairstylist into the database
        const [result] = await database.poolInfo.execute(
            'INSERT INTO hairstylists (name, salon_id, position) VALUES (?, ?, ?)',
            [name, salonId, position]
        );
        const hairstylistId = result.insertId;
        const hairstylistImageUrl = await saveHairstylistThumbnail(hairstylistId,image);
        const [results, fields] = await database.poolInfo.execute(
            'UPDATE hairstylists SET image_url = ? WHERE id = ?', [hairstylistImageUrl, hairstylistId]);
        if (results.affectedRows > 0) {
            res.status(201).json({ message: 'Hairstylist added successfully.' });
        } else {
            res.status(500).json({ message: 'Failed to add hairstylist.' });
        }
    } catch (error) {
        console.error('Error adding hairstylist:', error);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
});

router.delete('/delete/:hairstylistId', async (req, res) => {
    try {
        const { hairstylistId } = req.params;

        const [result] = await database.poolInfo.execute(
            `UPDATE hairstylists
                SET deleted_at = CURRENT_TIMESTAMP
                WHERE id = ?`
            , [serviceId]);
        if (result.affectedRows > 0)
            res.status(200).json({ message: 'Hairstylist deleted successfully' });
        else
            res.status(404).json({ message: 'Hairstylist not found' });
    } catch (error) {
        console.error('Error during service deletion:', error);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
});

module.exports = router;