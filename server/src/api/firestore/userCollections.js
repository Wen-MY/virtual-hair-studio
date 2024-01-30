//userCollections.js
const { storage, firestore } = require('../../../firebase-config');

const getProfilePicture = async (userId) => {
    try {
      const profilePictureRef = firestore.ref(storage,`/users/${userId}/media/profile.jpg`);
      if(profilePictureRef){
        const profilePictureUrl = await firestore.getDownloadURL(profilePictureRef);
        return profilePictureUrl;
      }else return null;
    } catch (error) {
      console.error('Error getting profile picture URL:', error);
      return null; // Return null if no profile picture is found
    }
};

const saveProfilePicture = async (userId, fileBuffer) => {
    try {
      const profilePictureRef = firestore.ref(storage,`/users/${userId}/media/profile.jpg`);
      console.log(`Uploading a profile picture to /users/${userId}/media/profile.jpg`);
      // Upload the file to Firebase Storage
      await firestore.uploadBytes(profilePictureRef,fileBuffer).then((snapshot) => {
        console.log(`Uploaded a profile picture for user ${userId}`);
    });
  
      // Get the download URL for the uploaded file
      const profilePictureUrl = await firestore.getDownloadURL(profilePictureRef);
  
      // return the profile picture URL 
      return profilePictureUrl;
    } catch (error) {
      console.error('Error saving profile picture to cloud firestore:', error);
      return null;
    }
};

module.exports = { getProfilePicture, saveProfilePicture };