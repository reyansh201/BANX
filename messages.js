import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";
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
const db = getFirestore(app);
const auth = getAuth(app);

let allEntries = [];
let currentUserId = null;

function renderEntries(entries) {
  const entriesContainer = document.getElementById("entriesContainer");
  entriesContainer.innerHTML = "";

  entries.forEach((entry) => {
    const entryDiv = document.createElement("div");
    entryDiv.classList.add("entry-box");
    entryDiv.dataset.entryId = entry.entryId;

    entryDiv.innerHTML = `
      <h3>Item: ${entry.itemNumber}</h3>
      <p><strong>Team Number:</strong> ${entry.teamNumber}</p>
      <p><strong>Price:</strong> $${entry.price}</p>
      <p><strong>Quantity:</strong> ${entry.quantity}</p>
      <p><strong>Zip Code:</strong> ${entry.zipCode}</p>
      <p><strong>Email:</strong> ${entry.email}</p>
    `;

    // Add event listener to show popup when item box is clicked
    entryDiv.addEventListener("click", () => {
      showPopup(entry);
    });

    entriesContainer.appendChild(entryDiv);
  });
}

// Function to display the item details in a larger popup
function showPopup(entry) {
  const popup = document.getElementById("popup");
  const popupContent = document.getElementById("popupContent");

  // Populate the popup with item details
  popupContent.innerHTML = `
    <h3>Item: ${entry.itemNumber}</h3>
    <p><strong>Team Number:</strong> ${entry.teamNumber}</p>
    <p><strong>Price:</strong> $${entry.price}</p>
    <p><strong>Quantity:</strong> ${entry.quantity}</p>
    <p><strong>Zip Code:</strong> ${entry.zipCode}</p>
    <p><strong>Email:</strong> ${entry.email}</p>
  `;

  // Show the popup
  popup.style.display = "block";

  // Close the popup when clicked outside
  window.addEventListener("click", (e) => {
    if (e.target === popup) {
      popup.style.display = "none";
    }
  });
}

async function fetchEntries() {
  const entriesContainer = document.getElementById("entriesContainer");
  entriesContainer.innerHTML = "";

  try {
    const usersRef = collection(db, "users");
    const usersSnapshot = await getDocs(usersRef);

    allEntries = [];

    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const entriesRef = collection(db, `users/${userId}/entries`);
      const entriesSnapshot = await getDocs(entriesRef);

      entriesSnapshot.forEach((entryDoc) => {
        allEntries.push({ userId, entryId: entryDoc.id, ...entryDoc.data() });
      });
    }

    const filteredEntries = allEntries.filter((entry) => entry.userId !== currentUserId);

    renderEntries(filteredEntries);
  } catch (error) {
    console.error("Error fetching entries:", error);
  }
}

function filterEntries() {
  const itemSearchTerm = document.getElementById("itemSearchInput").value.toLowerCase();
  const zipSearchTerm = document.getElementById("zipSearchInput").value.toLowerCase();

  const filteredEntries = allEntries
    .filter((entry) => entry.userId !== currentUserId)
    .filter((entry) => {
      const matchesItem = entry.itemNumber && entry.itemNumber.toLowerCase().includes(itemSearchTerm);
      const matchesZip = entry.zipCode && entry.zipCode.toLowerCase().includes(zipSearchTerm);
      return matchesItem && matchesZip;
    });

  renderEntries(filteredEntries);
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUserId = user.uid;
    fetchEntries();

    const profileBtn = document.getElementById("profileContainer");
    const userProfilePic = user.photoURL ? user.photoURL : "default-profile-pic.jpg";
    const profilePicElement = document.getElementById("profilePic");
    profilePicElement.src = userProfilePic;

    const overlay = document.getElementById("overlay");
    const signOutPopup = document.getElementById("signOutPopup");
    const signOutButton = document.getElementById("signOutButton");

    // Profile button click to show sign-out popup
    profileBtn.addEventListener("click", () => {
      overlay.style.display = "block";
      signOutPopup.style.display = "block";
    });

    // Close the sign-out popup if overlay is clicked
    overlay.addEventListener("click", () => {
      overlay.style.display = "none";
      signOutPopup.style.display = "none";
    });

    // Sign out button logic
    signOutButton.addEventListener("click", async () => {
      try {
        await signOut(auth);
        window.location.href = "login.html"; // Redirect to login page
      } catch (error) {
        console.error("Error signing out:", error.message);
      }
    });

    // No button logic: Close the sign-out popup and overlay to stay on the current page
    document.getElementById("cancelButton").addEventListener("click", () => {
      const overlay = document.getElementById("overlay");
      const signOutPopup = document.getElementById("signOutPopup");

      // Hide the popup and overlay
      overlay.style.display = "none";
      signOutPopup.style.display = "none";
    });
  } else {
    document.getElementById("entriesContainer").innerHTML = "Please log in to view entries.";
  }
});

// Search filtering by item number or zip code
document.getElementById("itemSearchInput").addEventListener("input", filterEntries);
document.getElementById("zipSearchInput").addEventListener("input", filterEntries);
