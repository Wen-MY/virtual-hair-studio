const express = require('express');
const router = express.Router();
const database = require('../../../db-config');
const session = require('express-session');
//add more necessary config

//get menu by user's authorization
router.get('/menu', async (req, res) => {
    //console.log('Session in /menu route:',req.session);
    const userData = req.session.user;
    if (!userData) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const userId = userData.id;
    try {   
        //use user id to find the group it belong to
        const [rows, fields] = await database.poolUM.execute('SELECT group_id FROM user_group WHERE user_id = ?', [userId]);
        if (rows.length > 0) {
            //user's group found
            const groupId = rows[0].group_id;
            const [results, fields] = await database.poolUM.execute('SELECT * FROM features JOIN authorities ON features.id = authorities.feature_id WHERE group_id = ? AND show_in_navigation = ?', [groupId,1]);
            console.log(results);
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
router.get('/',(req,res) =>{
    try {
        if (req.session.user) {
            console.log(req.session.user.username);
            res.status(200).json({ login: true, message: 'Logged in' });
        } else {
            console.log("Guest Accessing");
            res.status(200).json({ login: false, message: 'Not logged in' });
        }
      } catch (error) {
        console.error('Error during login status check:', error);
        res.status(500).json({ login: null, message: 'Internal Server Error' });
    }
})
module.exports = router;