const express = require('express');
const router = express.Router();
const database = require('../../../db-config');
const path = require('path');
const fs = require('fs');
const openaiInstance = require('../../../open-ai-config');
const { imageProcessingUtils } = require('../../utils/imageProcessing');
const { promptGeneratorUtils } = require('../../utils/promptGenerator');

router.post('/generate', upload.single('tryOnImage'), async (req, res) => {
    try {

        // Check if a file is provided in the request
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }
        // extract options from request body
        const options = req.body;

        //----------------------- Image Processing -----------------------
        // Crop image file received if neccesary , target : 1024 x 1024
        const originalImage = req.file;
        //here cropping it

        // Save the original image file
        const originalImageName = `input_${Date.now()}.png`;
        const originalImagePath = path.join(__dirname, 'src', 'resources', 'temp', originalImageName);
        fs.writeFileSync(originalImagePath, originalImage.buffer('image/png'));
        console.log('Original Image size:', originalImage.buffer('image/png').length / (1024 * 1024), 'MB');

        // Define the processed image file name
        const processedImageName = `output_${Date.now()}.png`;
        const processedImagePath = path.join(__dirname, 'src', 'resources', 'temp', processedImageName);
        //Image Processing : Hair Segmentation
        imageProcessingUtils.hairSegmenter(originalImageName, processedImageName, (error, message) => {
            if (error) {
                console.error(error.message);
                return res.status(500).json({ message: 'Image processing Error' });
            } else {
                console.log(message);
            }
        });

        //----------------------- Prompt Processing ----------------------- 

        const prompt = promptGeneratorUtils.generate('simple', options);
        
        //----------------------- to OpenAPI endpoint -----------------------
         console.log("Sending image to open ai dalle 2 endpoint");
        const form = new FormData();
        form.append('image', fs.createReadStream(originalImagePath), { contentType: 'image/png' }),
            form.append('mask', fs.createReadStream(processedImagePath), { contentType: 'image/png' }),
            form.append('model', 'dall-e-2');
        form.append('prompt', prompt);
        form.append('n', '1');
        form.append('size', '1024x1024');

        const response = await fetch('https://api.openai.com/v1/images/edits', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'OpenAI-Organization': `${organization}`,
                'Content-Type': 'multipart/form-data',
                ...form.getHeaders(),
            },
            body: form,
        });

        const responseData = await response.json();
        console.log(responseData);
        const image_url = responseData.data[0].url;
        // Send the image path to the frontend
        res.json({ maskedImage: image_url });
    } catch (error) {
        console.error('Error generate try on:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
module.exports = router;