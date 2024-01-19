import firebase from 'firebase/app';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDEQ6aehqAg32heF6PnYav6_F4oozz5vSg",
    authDomain: "virtual-hair-studio.firebaseapp.com",
    projectId: "virtual-hair-studio",
    storageBucket: "virtual-hair-studio.appspot.com",
    messagingSenderId: "260751415958",
    appId: "1:260751415958:web:1145324cc43d502e8440b7"
  };

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export { storage, firebase as default };
