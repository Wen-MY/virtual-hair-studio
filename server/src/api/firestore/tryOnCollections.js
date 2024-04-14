//HairstylistCollections.js
const { storage, firestore } = require('../../../firebase-config');

const getTryOnMedia = async (transaction_id) => {
    try {
      const pictureRef = firestore.ref(storage,`/try-on-generated/media/${transaction_id}.jpg`);
      if(pictureRef){
        const pictureUrl = await firestore.getDownloadURL(pictureRef);
        return pictureUrl;
      }else return null;
    } catch (error) {
      console.error('Error getting try-on generated picture URL:', error);
      return null; // Return null if no profile picture is found
    }
};

const saveTryOnMedia = async (transaction_id , index, fileBuffer) => {
    try {
      const pictureRef = firestore.ref(storage,`/try-on-generated/media/${transaction_id}/${index}.jpg`);
      console.log(`Uploading a try-on generated picture to /try-on-generated/media/${transaction_id}/${index}.jpg`);
      // Upload the file to Firebase Storage
      await firestore.uploadBytes(pictureRef,fileBuffer).then((snapshot) => {
        console.log(`Uploaded a try-on generated picture`);
    });
  
      // Get the download URL for the uploaded file
      const pictureUrl = await firestore.getDownloadURL(pictureRef);
  
      // return the profile picture URL 
      return pictureUrl;
    } catch (error) {
      console.error('Error saving try-on generated picture to cloud firestore:', error);
      return null;
    }
};

module.exports = { getTryOnMedia, saveTryOnMedia };