import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAkaW58Gq4_mEinZi8ZXmT_2ik3KY07CG4",
  authDomain: "parapharma-153db.firebaseapp.com",
  databaseURL: "https://parapharma-153db-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "parapharma-153db",
  storageBucket: "parapharma-153db.firebasestorage.app",
  messagingSenderId: "564194433866",
  appId: "1:564194433866:web:d1d1105994223f7938bfb3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//inputs
const email = document.getElementById('email').value;
const password = document.getElementById('password').value;

//submit button
const submit = document.getElementById('submit');
submit.addEventListener("click", function(event) {
    event.preventDefault();
    alert(5);
});