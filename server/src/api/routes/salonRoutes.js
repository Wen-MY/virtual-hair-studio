const express = require('express');
const router = express.Router();
const database = require('../../../db-config');


//get all with pagination
router.get('/retrieve',async (req,res) => {

})

//for get single , client must use salon id while owner will not   
router.get('/get:salonId',async (req,res) => {

})

//update , check for user Id for it relevant salon , else unauthorized
router.put('/update',async (req,res) => {

})

//owner single use to create his/her salon
router.post('/create',async (req,res) => {

})

module.exports = router;