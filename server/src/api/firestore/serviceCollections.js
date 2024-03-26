//serviceCollections.js
const { storage, firestore } = require('../../../firebase-config');

const getServiceThumnail = async (serviceId) => {
    try {
      const thumbnailRef = firestore.ref(storage,`/services/${serviceId}/media/thumbnail.jpg`);
      if(thumbnailRef){
        const thumbnailUrl = await firestore.getDownloadURL(thumbnailRef);
        return thumbnailUrl;
      }else return null;
    } catch (error) {
      console.error('Error getting service thumbnail URL:', error);
      return null; // Return null if no profile picture is found
    }
};

const saveServiceThumnail = async (serviceId, fileBuffer) => {
    try {
      const thumbnailRef = firestore.ref(storage,`/services/${serviceId}/media/thumbnail.jpg`);
      console.log(`Uploading a service thumbnail picture to /services/${serviceId}/media/thumbnail.jpg`);
      // Upload the file to Firebase Storage
      await firestore.uploadBytes(thumbnailRef,fileBuffer).then((snapshot) => {
        console.log(`Uploaded a service thumbnail picture for service ${serviceId}`);
    });
  
      // Get the download URL for the uploaded file
      const thumbnailUrl = await firestore.getDownloadURL(thumbnailRef);
  
      // return the profile picture URL 
      return thumbnailUrl;
    } catch (error) {
      console.error('Error saving service thumbnail picture to cloud firestore:', error);
      return null;
    }
};

const getServiceDefaultThumnail = async (categoryId) => {
    try {
        const thumbnailRef = firestore.ref(storage,`/services/media/services-default-${categoryId}.jpg`);
        if(thumbnailRef){
          const thumbnailUrl = await firestore.getDownloadURL(thumbnailRef);
          return thumbnailUrl;
        }else return null;
      } catch (error) {
        console.error('Error getting service thumbnail picture URL:', error);
        return null; // Return null if no profile picture is found
      }
}

module.exports = { getServiceThumnail, saveServiceThumnail, getServiceDefaultThumnail };