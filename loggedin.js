import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAxyqS37V2TVwAZdszNBfPOJbA0I3Iu0z8",
  authDomain: "ftcfinder-f2e06.firebaseapp.com",
  projectId: "ftcfinder-f2e06",
  storageBucket: "ftcfinder-f2e06.appspot.com",
  messagingSenderId: "975921021643",
  appId: "1:975921021643:web:e0f0f5ff29d4376fe9114e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", () => {
  const profileBtn = document.getElementById("profileBtn");
  const overlay = document.getElementById("overlay");
  const popup = document.getElementById("popup");
  const signOutButton = document.getElementById("signOutButton");
  const cancelButton = document.getElementById("cancelButton");

  // Monitor the authentication state
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User is logged in:", user.email);

      // Set the profile picture
      const userProfilePic = user.photoURL ? user.photoURL : "default-profile-pic.jpg";
      profileBtn.innerHTML = `
        <img 
          src="${userProfilePic}" 
          alt="Profile" 
          style="width: 50px; height: 50px; border-radius: 50%; cursor: pointer;"
        >
      `;
    } else {
      console.log("No user is logged in. Redirecting to login...");
      window.location.href = "login.html"; // Redirect if not authenticated
    }
  });

  // Show the popup when the profile picture is clicked
  profileBtn.addEventListener("click", () => {
    overlay.style.display = "block";
    popup.style.display = "block";
  });

  // Handle sign-out button click
  signOutButton.addEventListener("click", async () => {
    try {
      await signOut(auth); // Firebase sign-out
      console.log("User signed out successfully.");
      overlay.style.display = "none";
      popup.style.display = "none";
      window.location.href = "home.html"; // Redirect to home page
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
  });

  // Handle cancel button click
  cancelButton.addEventListener("click", () => {
    overlay.style.display = "none";
    popup.style.display = "none";
  });

  // Hide the popup when the overlay is clicked
  overlay.addEventListener("click", () => {
    overlay.style.display = "none";
    popup.style.display = "none";
  });
});
