//salonCollections.js
const { storage, firestore } = require('../../../firebase-config');

const getSalonThumbnail = async (salonId) => {
    try {
      const thumbnailRef = firestore.ref(storage,`/salons/${salonId}/media/profile/thumbnail.jpg`);
      if(thumbnailRef){
        const thumbnailUrl = await firestore.getDownloadURL(thumbnailRef);
        return thumbnailUrl;
      }else return null;
    } catch (error) {
      console.error('Error getting salon thumbnail picture URL:', error);
      return null; // Return null if no profile picture is found
    }
};

const saveSalonThumbnail = async (salonId, fileBuffer) => {
    try {
      const thumbnailRef = firestore.ref(storage,`/salons/${salonId}/media/profile/thumbnail.jpg`);
      console.log(`Uploading a salon thumbnail picture to /salons/${salonId}/media/profile/thumbnail.jpg`);
      // Upload the file to Firebase Storage
      await firestore.uploadBytes(thumbnailRef,fileBuffer).then((snapshot) => {
        console.log(`Uploaded a salon thumbnail picture for salon ${salonId}`);
    });
  
      // Get the download URL for the uploaded file
      const thumbnailUrl = await firestore.getDownloadURL(thumbnailRef);
  
      // return the profile picture URL 
      return thumbnailUrl;
    } catch (error) {
      console.error('Error saving salon thumbnail picture to cloud firestore:', error);
      return null;
    }
};

module.exports = { getSalonThumbnail, saveSalonThumbnail };