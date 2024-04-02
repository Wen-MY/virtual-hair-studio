const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const imageProcessingUtils = {
    hairSegmenter: (inputFileName, outputFileName, iteration) => {
        return new Promise((resolve, reject) => {
            const pythonProcess = spawn('python', 
            ['../server/src/scripts/hair_segmentation.py', 
            `../server/src/resources/temp/${inputFileName}`,
            `../server/src/resources/temp/${outputFileName}`,
            `${iteration}` //dilate_iterations
            ]);

            pythonProcess.stdout.on('data', (data) => {
                console.log(`stdout: ${data}`);
            });

            pythonProcess.stderr.on('data', (data) => {
                console.error(`stderr: ${data}`);
            });

            pythonProcess.on('close', (code) => {
                if (code === 0) {
                    resolve('Image processed successfully.');
                } else {
                    reject(new Error('Error processing image.'));
                }
            });
        });
    },
    saveUrlImageToTemp: (id, userId, imageUrl, callback) => {
        const fileName = id + '_' + userId + '_' + Date.now() + '.png';
        const tempFilePath = path.join(__dirname, '..', 'resources', 'temp', fileName);
        const https = require('https');
        const fileStream = fs.createWriteStream(tempFilePath);
        https.get(imageUrl, (response) => {
            // Pipe the response to the file stream
            response.pipe(fileStream);

            // Handle stream events
            fileStream.on('finish', () => {
                fileStream.close(callback(null, tempFilePath));
            });

            fileStream.on('error', (err) => {
                fs.unlink(tempFilePath, () => { }); // Delete the file asynchronously
                callback(err);
            });
        }).on('error', (err) => {
            fs.unlink(tempFilePath, () => { }); // Delete the file asynchronously
            callback(err);
        });
    }
};

module.exports = { imageProcessingUtils };
