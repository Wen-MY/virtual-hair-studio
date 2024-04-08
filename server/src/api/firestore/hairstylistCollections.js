//HairstylistCollections.js
const { storage, firestore } = require('../../../firebase-config');

const getHairstylistThumbnail = async (hairstylistId) => {
    try {
      const thumbnailRef = firestore.ref(storage,`/hairstylists/${hairstylistId}/media/profile/thumbnail.jpg`);
      if(thumbnailRef){
        const thumbnailUrl = await firestore.getDownloadURL(thumbnailRef);
        return thumbnailUrl;
      }else return null;
    } catch (error) {
      console.error('Error getting hairstylist thumbnail picture URL:', error);
      return null; // Return null if no profile picture is found
    }
};

const saveHairstylistThumbnail = async (hairstylistId, fileBuffer) => {
    try {
      const thumbnailRef = firestore.ref(storage,`/hairstylists/${hairstylistId}/media/profile/thumbnail.jpg`);
      console.log(`Uploading a hairstylist thumbnail picture to /Hairstylists/${hairstylistId}/media/profile/thumbnail.jpg`);
      // Upload the file to Firebase Storage
      await firestore.uploadBytes(thumbnailRef,fileBuffer).then((snapshot) => {
        console.log(`Uploaded a hairstylist thumbnail picture for Hairstylist ${hairstylistId}`);
    });
  
      // Get the download URL for the uploaded file
      const thumbnailUrl = await firestore.getDownloadURL(thumbnailRef);
  
      // return the profile picture URL 
      return thumbnailUrl;
    } catch (error) {
      console.error('Error saving hairstylist thumbnail picture to cloud firestore:', error);
      return null;
    }
};

module.exports = { getHairstylistThumbnail, saveHairstylistThumbnail };