const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { getTryOnMedia,saveTryOnMedia } = require('../api/firestore/tryOnCollections');

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
    saveUrlImageToTemp: async(id, index, imageUrl, callback) => {
        const fileName = id + '_' + index + '_' + Date.now() + '.png';
        const tempFilePath = path.join(__dirname, '..', 'resources', 'temp', fileName);
        const https = require('https');
        const fileStream = fs.createWriteStream(tempFilePath);
        /*
        https.get(imageUrl, (response) => {
            // Pipe the response to the file stream
            response.pipe(fileStream);

            // Handle stream events
            fileStream.on('finish', async () => {
                const fileBuffer = fs.readFileSync(tempFilePath);
                const pictureUrl = await saveTryOnMedia(id,index, fileBuffer);
                if (typeof callback === 'function') {
                    fileStream.close(() => callback(null, pictureUrl)); // Close the stream and invoke the callback
                }
            });

            fileStream.on('error', (err) => {
                fs.unlink(tempFilePath, () => { }); // Delete the file asynchronously
                callback(err);
            });
        }).on('error', (err) => {
            fs.unlink(tempFilePath, () => { }); // Delete the file asynchronously
            callback(err);
        });
        */
        return new Promise((resolve, reject) => {
            https.get(imageUrl, (response) => {
                // Pipe the response to the file stream
                response.pipe(fileStream);
    
                // Handle stream events
                fileStream.on('finish', async () => {
                    try {
                        const fileBuffer = fs.readFileSync(tempFilePath);
                        const pictureUrl = await saveTryOnMedia(id, index, fileBuffer);
                        resolve(pictureUrl);
                    } catch (error) {
                        reject(error);
                    }
                });
    
                fileStream.on('error', (err) => {
                    fs.unlink(tempFilePath, () => { }); // Delete the file asynchronously
                    reject(err);
                });
            }).on('error', (err) => {
                fs.unlink(tempFilePath, () => { }); // Delete the file asynchronously
                reject(err);
            });
        });
    },
    imageResize : async (originalImageFile) => {
        try {
          // Resize the image to fit within 512x512 pixels
          const resizedImageBuffer = await sharp(originalImageFile.buffer)
            .resize({
              width: 512,
              height: 512,
              fit: 'inside', // Maintain aspect ratio, fit within dimensions
              withoutEnlargement: false // enlarge if smaller than 512x512
            })
            .toFormat('png') // Convert to PNG format
            .toBuffer();
      
          // Return the processed image buffer
          return {
            buffer: resizedImageBuffer,
            originalName: originalImageFile.originalname, // Retain original filename
            mimetype: 'image/png' // Set mimetype to PNG
          };
        } catch (error) {
          console.error('Error processing image:', error);
          throw error;
        }
      }
};

module.exports = { imageProcessingUtils };
