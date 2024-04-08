const express = require('express');
const router = express.Router();
const database = require('../../../db-config');
const bcrypt = require('bcrypt'); // for password hashing
const multer = require('multer');
const { getProfilePicture, saveProfilePicture } = require('../firestore/userCollections');
// Set up Multer storage
const upload = multer({
  storage: multer.memoryStorage(), // Store file in memory before uploading to Firebase
});


// Sign Out
router.post('/logout', (req, res) => {
  // Clear the session
  req.session.destroy((err) => {
    if (err) {
      console.error('Error during logout:', err);
      res.status(500).json({ message: 'Internal Server Error.' });
    } else {
      res.status(200).json({ message: 'Logout successful' });
    }
  });
});

// Delete User
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [results, fields] = await database.poolUM.execute('DELETE FROM users WHERE id = ?', [id]);

    if (results.affectedRows > 0) {
      res.status(200).json({ message: 'User deleted successfully!' });
    } else {
      res.status(404).json({ message: 'User not found.' });
    }
  } catch (error) {
    console.error('Error during user deletion:', error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
});

// Update User
router.post('/update', async (req, res) => {
  try {
    const { email, username, first_name, last_name, gender } = req.body;
    const [results, fields] = await database.poolUM.execute(
      'UPDATE users SET username = ?, first_name = ?, last_name = ?,gender = ? WHERE id = ?', [username, first_name, last_name, gender, req.userId]);
    if (results.affectedRows > 0) {
      res.status(200).json({ message: 'User account updated sucessfully!' });
    } else {
      res.status(404).json({ message: 'Failed to update user account.' });
    }
  } catch (error) {
    console.error('Error during user update:', error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
})

router.get('/retrieve', async (req, res) => {
  try {
    const [results, fields] = await database.poolUM.execute(
      'SELECT username, email, first_name, last_name, gender, image_url FROM users WHERE id = ?', [req.userId]);
    if (results.length > 0) {
      const userData = results[0];
      res.status(200).json({
        message: 'User account retrieved successfully!',
        results: { ...userData, profilePictureUrl : userData.image_url },
      });
    } else {
      res.status(404).json({ message: 'Failed to retrieve user account.' });
    }

  } catch (error) {
    console.error('Error during get user account info:', error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
})

router.post('/change-password', async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (oldPassword && newPassword) {
      // Check if the old password is correct
      const [userResults] = await database.poolUM.execute(
        'SELECT password FROM users WHERE id = ?',
        [req.userId]
      );

      if (userResults.length > 0) {
        const isPasswordMatch = await bcrypt.compare(oldPassword, userResults[0].password);

        if (isPasswordMatch) {
          // Hash the new password before updating the database
          const hashedNewPassword = await bcrypt.hash(newPassword, 10);

          // Update the password in the database
          const [updateResults] = await database.poolUM.execute(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedNewPassword, req.userId]
          );

          if (updateResults.affectedRows > 0) {
            res.status(200).json({ message: 'Password changed successfully!' });
          } else {
            res.status(500).json({ message: 'Failed to update password.' });
          }
        } else {
          res.status(401).json({ message: 'Old password is incorrect.' });
        }
      } else {
        res.status(404).json({ message: 'User not found.' });
      }
    } else {
      res.status(400).json({ message: 'Invalid request. Please provide oldPassword and newPassword.' });
    }
  } catch (error) {
    console.error('Error during password change:', error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
});
router.post('/update-profile-picture', upload.single('profilePicture'), async (req, res) => {
  try {

    // Check if a file is provided in the request
    if (!req.file) {
      return res.status(400).json({ message: 'No profile picture file provided' });
    }

    const fileBuffer = req.file.buffer;

    // Save the profile picture to storage and get the updated profile picture URL
    const profilePictureUrl = await saveProfilePicture(req.userId, fileBuffer);
    const [results, fields] = await database.poolUM.execute(
      'UPDATE users SET image_url = ? WHERE id = ?', [profilePictureUrl, req.userId]);
    if (results.affectedRows > 0) {
      return res.status(200).json({ message: 'Profile picture updated successfully', results: { profilePictureUrl } });
    } else {
      return res.status(500).json({ message: 'Failed to update profile picture' });
    }
  } catch (error) {
    console.error('Error updating profile picture:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});
module.exports = router;