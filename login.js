import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
const firebaseConfig = {
  apiKey: "AIzaSyAxyqS37V2TVwAZdszNBfPOJbA0I3Iu0z8",
  authDomain: "ftcfinder-f2e06.firebaseapp.com",
  projectId: "ftcfinder-f2e06",
  storageBucket: "ftcfinder-f2e06.appspot.com",
  messagingSenderId: "975921021643",
  appId: "1:975921021643:web:e0f0f5ff29d4376fe9114e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
auth.languageCode ='en'
const provider = new GoogleAuthProvider();
const googleLogin = document.getElementById("loginBtn");
googleLogin.addEventListener("click", function(){
    signInWithPopup(auth, provider)
    .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const user = result.user;
        console.log(user);
        window.location.href = "loggedin.html";
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        
      });
})

