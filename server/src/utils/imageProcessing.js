const { spawn } = require('child_process');

const imageProcessingUtils = {
    hairSegmenter: (inputFileName, outputFileName, callback) => {
        const pythonProcess = spawn('python', ['../scripts/hair_segmentation.py', `../resources/temp/${inputFileName}`, `../resources/temp/${outputFileName}`]);

        pythonProcess.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });
    
        pythonProcess.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });
    
        pythonProcess.on('close', (code) => {
            if (code === 0) {
                callback(null, 'Image processed successfully.');
            } else {
                callback(new Error('Error processing image.'));
            }
        });
    }
};

module.exports = {imageProcessingUtils};
