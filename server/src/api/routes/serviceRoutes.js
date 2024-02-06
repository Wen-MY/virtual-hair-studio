const express = require('express');
const router = express.Router();
const database = require('../../../db-config');

router.get('/all/:salonId', async (req,res) =>{
    try{
        const {salonId} = req.params;
        const [serviceResults] = await database.poolInfo.execute(
            ``
        )
    }catch{

    }
})