const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const database = require('../../../db-config');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');
const FormData = require('form-data');
const {openai} = require('../../../open-ai-config')
const { imageProcessingUtils } = require('../../utils/imageProcessing');
const { promptGeneratorUtils } = require('../../utils/promptGenerator');
const upload = multer({
    storage: multer.memoryStorage(), // Store file in memory before uploading to Firebase
  });

router.post('/generate', upload.single('tryOnImage'), async (req, res) => {
    try {
        const transactionId = uuidv4();
        // Check if a file is provided in the request
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }
        const feedbackId = req.query.feedbackId || null;
        if(feedbackId){
            const [feedbackResult] = await database.poolTryOn.execute('INSERT INTO feedbacks (feedback_type,user_id,transaction_id) VALUES (?,?,?)',[feedbackId,req.userId,transactionId]);
            if(!feedbackResult.affectedRows > 0){
                return res.status(500).json({ message: 'Failed to regenerate result.' });
            }
        }
        // extract options from request body
        const options = JSON.parse(req.body.options);
        //console.log(options);
        //----------------------- Image Processing -----------------------
        // Crop image file received if neccesary , target : 1024 x 1024 / 512 x 512
        const originalImage = req.file;
        //here cropping it

        // Save the original image file
        const originalImageName = `input_${Date.now()}.png`;
        const originalImagePath = path.join(__dirname, '../../', 'resources', 'temp', originalImageName);
        fs.writeFileSync(originalImagePath, originalImage.buffer);
        console.log('Original Image size:', originalImage.buffer.length / (1024 * 1024), 'MB');

        // Define the processed image file name
        const processedImageName = `output_${Date.now()}.png`;
        const processedImagePath = path.join(__dirname, '../../', 'resources', 'temp', processedImageName);

        const defaultIteration = 3;
        //Image Processing : Hair Segmentation
        await imageProcessingUtils.hairSegmenter(originalImageName, processedImageName, defaultIteration, (error, message) => {
            if (error) {
                console.error(error.message);
                return res.status(500).json({ message: 'Image processing Error' });
            } else {
                console.log(message);
            }
        });
        console.log(originalImagePath);
        console.log(processedImagePath);
        //----------------------- Prompt Processing ----------------------- 

        const prompt = promptGeneratorUtils.generate('enhanced', options);
        console.log('Prompt Generated :' + prompt);
        //----------------------- to OpenAPI endpoint -----------------------
         console.log("Sending image to open ai dalle 2 endpoint");
        const form = new FormData();
        form.append('image', fs.createReadStream(originalImagePath), { contentType: 'image/png' }),
        form.append('mask', fs.createReadStream(processedImagePath), { contentType: 'image/png' }),
        form.append('model', 'dall-e-2');
        form.append('prompt', prompt);
        form.append('n', '3');
        form.append('size', '512x512');
        const response = await fetch('https://api.openai.com/v1/images/edits', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${openai.apiKey}`,
                'OpenAI-Organization': `${openai.organization}`,
                'Content-Type': 'multipart/form-data',
                ...form.getHeaders(),
            },
            body: form,
        });

        const responseData = await response.json();
        console.log(responseData);
        const images_url = responseData.data;
        images_url.map(image =>
        imageProcessingUtils.saveUrlImageToTemp(1,1,image.url,(error, message) => {
            if (error) {
                console.error(error.message);
                return res.status(500).json({ message: 'Image processing Error' });
            } else {
                console.log(message);
            }
        }));
        // Send the image path to the frontend
        return res.json({ result: images_url });
    } catch (error) {
        console.error('Error generate try on:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/options',async (req,res) => {
    const {enabled,categoryId} = req.query;
    try{
        const sqlParams = []
        let sqlQuery = `SELECT id, name, category_id, remarks from options`;
        if(enabled){
            sqlQuery+= ` WHERE enabled = ?`
            sqlParams.push(enabled);
        }
        if(categoryId){
            sqlQuery+= ` WHERE category_id = ?`
            sqlParams.push(categoryId);
        }
        const [optionResults] = await database.poolTryOn.execute(sqlQuery,sqlParams);
        if(optionResults.length > 0) {
            return res.status(200).json({
                message: 'Options of try-on retrieved successfully',
                result: optionResults
            });
        }else {
            return res.status(404).json({
                message: 'No options found for try on',
            });
        }
    }catch(error){
        console.error(`Error retrieving try-on options`, error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
})

router.get('/categories',async (req,res) => {
    try {
        const [results] = await database.poolTryOn.execute('SELECT * FROM options_categories', []);
        if (results.length > 0) {
            return res.status(200).json({ message: 'Option categories retrieve successfully', result: results });
        } else {
            return res.status(404).json({ message: 'Not option categories found' });
        }
    } catch (error) {
        console.error('Error retriving service categories:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
})

// Route to save the user's acceptance of terms and conditions
router.post('/term/accept', (req, res) => {
    // Save user's acceptance status in session or cookies
    req.session.acceptedTerms = true; // Example: Storing in session

    return res.status(200).send('Terms and conditions accepted successfully.');
});

// Route to check if the user has accepted the terms and conditions
router.get('/term/check', (req, res) => {
    // Check if the user has accepted terms and conditions
    const hasAcceptedTerms = req.session.acceptedTerms || false; // Example: Retrieving from session

    if (hasAcceptedTerms) {
        return res.status(200).send('User has accepted terms and conditions.');
    } else {
        return res.status(403).send('User has not accepted terms and conditions.');
    }
});

router.get('/feedback/options',async (req,res)=> {
    try {
        const [results] = await database.poolTryOn.execute('SELECT * FROM feedback_types', []);
        if (results.length > 0) {
            return res.status(200).json({ message: 'Option for feedback retrieve successfully', result: results });
        } else {
            return res.status(404).json({ message: 'Not feedback option found' });
        }
    } catch (error) {
        console.error('Error retriving feedback options:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
})
module.exports = router;