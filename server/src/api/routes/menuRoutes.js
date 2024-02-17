const express = require('express');
const router = express.Router();
const database = require('../../../db-config');

//get menu by user's authorization
router.get('/', async (req, res) => {
    const userId = req.userId;
    try {   
        //use user id to find the group it belong to
        const [rows, fields] = await database.poolUM.execute('SELECT group_id FROM user_group WHERE user_id = ?', [userId]);
        if (rows.length > 0) {
            //user's group found
            const groupId = rows[0].group_id;
            const [results, fields] = await database.poolUM.execute('SELECT * FROM features JOIN authorities ON features.id = authorities.feature_id WHERE group_id = ? AND show_in_navigation = ?', [groupId,1]);
            //console.log(results);
            if (results.length > 0) {
                //authorities found
                res.status(200).json({ message: 'Successful!', results: results });
            } else {
                res.status(404).json({ message: 'No Authorities Found.' });
            }
        } else {
            res.status(404).json({ message: 'No User Group Found.' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
});

module.exports = router;