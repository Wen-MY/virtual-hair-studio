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

// Try on hairstyle generation connect to DALL-E-2
router.post('/generate', upload.single('tryOnImage'), async (req, res) => {
    try {
        const transactionId = uuidv4();
        const userId = req.userId;
        // Check if a file is provided in the request
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }
        const feedbackId = req.query.feedbackId ?? null;
        let feedbackPrompt = null;
        if(feedbackId){
            const [feedbackResult] = await database.poolTryOn.execute('INSERT INTO feedbacks (feedback_type,user_id,transaction_id) VALUES (?,?,?)',[feedbackId,req.userId,transactionId]);
            if(!feedbackResult.affectedRows > 0){
                return res.status(500).json({ message: 'Failed to regenerate result.' });
            }
            const [feedback] = await database.poolTryOn.execute('SELECT improvement FROM feedback_types WHERE id = ?',[feedbackId]);
            if(feedback.length > 0) 
            {
                feedbackPrompt = feedback[0].improvement;
            }
        }
        // extract options from request body
        let options;
        if(req.body.options){
            options = JSON.parse(req.body.options);
        }
        const preset_id = req.query.presetId ?? null;
        //console.log(options);
        //----------------------- Image Processing -----------------------
        // Crop image file received if neccesary , target : 1024 x 1024 / 512 x 512
        const originalImage = req.file;
        const originalImageProcessed = await imageProcessingUtils.imageResize(originalImage);
        //here cropping it

        // Save the original image file
        const originalImageName = `input_${Date.now()}.png`;
        const originalImagePath = path.join(__dirname, '../../', 'resources', 'temp', originalImageName);
        fs.writeFileSync(originalImagePath, originalImageProcessed.buffer);
        console.log('Original Image size:', originalImageProcessed.buffer.length / (1024 * 1024), 'MB');

        // Define the processed image file name
        const processedImageName = `output_${Date.now()}.png`;
        const processedImagePath = path.join(__dirname, '../../', 'resources', 'temp', processedImageName);

        const defaultIteration = 6;
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
        let prompt;
        let prompt_generated;
        if(!preset_id){
            prompt_generated = await promptGeneratorUtils.generate_with_GPT(options);
            prompt = prompt_generated.prompt + feedbackPrompt??"";
        }
        else{
            const [recommendation] = await database.poolTryOn.execute('SELECT * FROM prompt_presets WHERE id = ?',[preset_id]);
            prompt = recommendation[0].prompt;
        }
        //const prompt = `Transform the subject's hair in the image to a blonde color with the specific tone of a natural blonde. Ensure the hairstyle is a bowl cut : A bowl cut is a simple haircut where the front hair is cut with a straight fringe and the rest of the hair is left longer, the same length all the way around, or else the sides and back are cut to the same short length., a simple and casual style that curves around the shape of the head. The hair should be straight in texture for a sleek and smooth finish. It should have a middle parting which is a classic style where the hair is divided in the center of the forehead. Please take note that the integration of these changes must be executed realistically - as if the subject is naturally having this hairstyle and hair color in both appearance and texture.`
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
        //saving to server local and firestore
        const saveImagePromises = images_url.map(async (image, index) => {
            try {
                const message = await imageProcessingUtils.saveUrlImageToTemp(transactionId, index, image.url);
                return message;
            } catch (error) {
                console.error(error.message);
                throw new Error('Image processing Error');
            }
        });
        try {
            const mediaURLsArray = await Promise.all(saveImagePromises);
            const mediaURLs = mediaURLsArray.join(',');
            const completionTokens = prompt_generated.completion_tokens !== undefined ? prompt_generated.completion_tokens : 0;
            const [result] = await database.poolTryOn.execute('INSERT INTO `try-on_attempts` (transaction_id,user_id,media_URLS,prompt,completion_token,sample_id) VALUES (?,?,?,?,?,?)',[transactionId,userId,mediaURLs,prompt,completionTokens,preset_id?null:prompt_generated.sample_id]);
            if(result.affectedRows <= 0){
                console.error('Error saving try-on attempts to database');
            }
            const promptId = result.insertId;
            return res.json({ result:{
                'images_url' : images_url,
                'prompt_id' : promptId 
            }});
        } catch (error) {
            console.error(error.message);
            throw new Error('Image processing Error');
        }
        
        // Send the image path to the frontend
        
    } catch (error) {
        console.error('Error generate try on:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
// get all try on hairstyle options
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
// get all try on hairstyle option categories
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
// get all try on hairstyle option presets
router.get('/recommendation',async (req,res) => {
    try{
        const sqlParams = []
        let sqlQuery = `SELECT * from prompt_presets LIMIT 4`;
        const [recommendationResults] = await database.poolTryOn.execute(sqlQuery,sqlParams);
        if(recommendationResults.length > 0) {
            return res.status(200).json({
                message: 'Recommendation of try-on retrieved successfully',
                result: recommendationResults
            });
        }else {
            return res.status(404).json({
                message: 'No recommendation found for try on',
            });
        }
    }catch(error){
        console.error(`Error retrieving try-on recommendations`, error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
})
// route to save the user's acceptance of terms and conditions (session based)
router.post('/term/accept', (req, res) => {
    // Save user's acceptance status in session or cookies
    req.session.acceptedTerms = true; // Example: Storing in session

    return res.status(200).send('Terms and conditions accepted successfully.');
});
// route to check if the user has accepted the terms and conditions
router.get('/term/check', (req, res) => {
    // Check if the user has accepted terms and conditions
    const hasAcceptedTerms = req.session.acceptedTerms || false; // Example: Retrieving from session

    if (hasAcceptedTerms) {
        return res.status(200).send('User has accepted terms and conditions.');
    } else {
        return res.status(403).send('User has not accepted terms and conditions.');
    }
});
// get all try on hairstyle regenerate feedback options
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
// save user rating on generations
router.post('/rate',async (req,res)=> {
    try {
        const {rating, try_on_id} = req.body;
        const [sampleIdRows] = await database.poolTryOn.execute('SELECT sample_id FROM `try-on_attempts` WHERE id = ?',[try_on_id]);
        if(sampleIdRows.length > 0)
        {
            const sampleId = JSON.parse(sampleIdRows[0].sample_id);
            const [updateSamplePrompt] = await database.poolTryOn.execute('UPDATE `try-on_attempts` SET score = score + ? WHERE id = ?', [rating,sampleId]);
        }
        return res.status(201).json({ message: 'Rated virtual hairstyle successfully'});
    } catch (error) {
        console.error('Error retriving feedback options:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
})
// get user's try-on attempt medias
router.post('/attempts-media',async (req,res) =>{
    
})
module.exports = router;