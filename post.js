import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  addDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";

// Firebase config
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

document.addEventListener("DOMContentLoaded", () => {
  const postButton = document.getElementById("submitButton");
  const requestButton = document.getElementById("requestButton");
  const entriesContainer = document.getElementById("entriesContainer");

  // Monitor authentication state
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User authenticated:", user.uid); // Debug log

      // Set up profile picture and login details
      displayProfileInfo(user);

      // Attach event listener for posting
      postButton.addEventListener("click", () => handlePost(user.uid));
      requestButton.addEventListener("click", () => handleRequest(user.uid));

      // Fetch and display user entries
      fetchEntries(user.uid);
      fetchRequests(user.uid);
    } else {
      console.error("User not authenticated");
      entriesContainer.textContent = "Please log in to view and post entries.";
    }
  });
});

// Function to display profile information (including picture)
function displayProfileInfo(user) {
  const profilePic = document.getElementById("profilePic");
  const profileContainer = document.getElementById("profileContainer");

  if (user.photoURL) {
    profilePic.src = user.photoURL;
    profilePic.alt = "Profile Picture";
  } else {
    profilePic.src = "default-profile-pic.jpg"; // Placeholder image if no photoURL
    profilePic.alt = "Default Profile Picture";
  }

  // Open the sign-out popup when the profile picture is clicked
  profileContainer.addEventListener("click", () => {
    document.getElementById("overlay").style.display = "block";
    document.getElementById("signOutPopup").style.display = "block";
  });

  // Attach the sign-out button functionality
  document.getElementById("signOutButton").addEventListener("click", () => {
    signOut(auth).then(() => {
      console.log("User signed out");
      window.location.href = "home.html"; // Redirect after sign-out
    }).catch((error) => {
      console.error("Sign-out error:", error);
      alert("Failed to sign out. Please try again.");
    });
  });

  // Close the sign-out popup if the overlay is clicked
  document.getElementById("overlay").addEventListener("click", () => {
    document.getElementById("overlay").style.display = "none";
    document.getElementById("signOutPopup").style.display = "none";
  });

  // Handle the cancel button click in the popup
  document.getElementById("cancelButton").addEventListener("click", () => {
    document.getElementById("overlay").style.display = "none";
    document.getElementById("signOutPopup").style.display = "none";
  });
}

// Function to handle posting a new item
async function handlePost(userId) {
  const itemNumber = document.getElementById("itemNumber").value.trim();
  const teamNumber = document.getElementById("teamNumber").value.trim();
  const zipCode = document.getElementById("zipCode").value.trim();
  const price = document.getElementById("price").value.trim();
  const quantity = document.getElementById("quantity").value.trim();
  const email = document.getElementById("email").value.trim();
  // Validate input fields
  if (!itemNumber || !teamNumber || !zipCode || !price || !quantity || !email) {
    alert("Please fill out all fields before submitting.");
    return;
  }

  try {
    // Add the entry to Firestore
    const entry = {
      itemNumber,
      teamNumber,
      zipCode,
      price: parseFloat(price),
      quantity: parseInt(quantity, 10),
      email,
      timestamp: new Date(), // Optional: Add a timestamp
    };

    console.log("Posting entry:", entry); // Debug log
    const userEntriesRef = collection(db, `users/${userId}/entries`);
    await addDoc(userEntriesRef, entry);
    alert("Item posted successfully!");

    // Optionally clear the form
    document.getElementById("itemNumber").value = "";
    document.getElementById("teamNumber").value = "";
    document.getElementById("zipCode").value = "";
    document.getElementById("price").value = "";
    document.getElementById("quantity").value = "";
    document.getElementById("email").value = "";

    // Refresh the list of user entries
    fetchEntries(userId);
  } catch (error) {
    console.error("Error posting entry:", error.message);
    alert("Failed to post item. Please try again.");
  }
}

// Function to handle posting a new request
async function handleRequest(userId) {
  const requestItem = document.getElementById("requestItem").value.trim();
  const requestQuantity = document.getElementById("requestQuantity").value.trim();
  const requestEmail = document.getElementById("requestEmail").value.trim();

  // Validate input fields
  if (!requestItem || !requestQuantity || !requestEmail) {
    alert("Please fill out all fields before submitting.");
    return;
  }

  try {
    // Add the request to Firestore
    const request = {
      requestItem,
      requestQuantity: parseInt(requestQuantity, 10),
      requestEmail,
      timestamp: new Date(), // Optional: Add a timestamp
    };

    console.log("Posting request:", request); // Debug log
    const userRequestsRef = collection(db, `users/${userId}/requests`);
    await addDoc(userRequestsRef, request);
    alert("Request posted successfully!");

    // Optionally clear the form
    document.getElementById("requestItem").value = "";
    document.getElementById("requestQuantity").value = "";
    document.getElementById("requestEmail").value = "";

    // Refresh the list of user requests
    fetchRequests(userId);
  } catch (error) {
    console.error("Error posting request:", error.message);
    alert("Failed to post request. Please try again.");
  }
}

// Function to fetch and display user entries
async function fetchEntries(userId) {
  const entriesContainer = document.getElementById("entriesContainer");
  let itemsFound = false;
  entriesContainer.innerHTML = ""; // Clear the container before loading new entries

  try {
    console.log(`Fetching entries from path: users/${userId}/entries`);
    const userEntriesRef = collection(db, `users/${userId}/entries`);
    const entriesSnapshot = await getDocs(userEntriesRef);

    entriesSnapshot.forEach((entryDoc) => {
      itemsFound = true;
      const entry = entryDoc.data();
      const entryId = entryDoc.id; // Get the document ID

      const entryDiv = document.createElement("div");
      entryDiv.classList.add("entry");
      entryDiv.innerHTML = `
        <p><strong>Item Number:</strong> ${entry.itemNumber}</p>
        <p><strong>Team Number:</strong> ${entry.teamNumber}</p>
        <p><strong>ZIP Code:</strong> ${entry.zipCode}</p>
        <p><strong>Price:</strong> $${entry.price}</p>
        <p><strong>Quantity:</strong> ${entry.quantity}</p>
        <p><strong>Email:</strong> ${entry.email}</p>
        <button class="delete-btn" data-id="${entryId}">Delete</button>
      `;

      entriesContainer.appendChild(entryDiv);
    });

    if (!itemsFound) {
      entriesContainer.textContent = "No entries found.";
    }

    // Attach delete functionality to each delete button
    attachDeleteHandlers(userId);
  } catch (error) {
    console.error("Error fetching entries:", error.message);
    entriesContainer.textContent =
      "Failed to load entries. " + error.message;
  }
}

// Function to fetch and display user requests
async function fetchRequests(userId) {
  const requestsContainer = document.getElementById("requestsContainer");
  let requestsFound = false;
  requestsContainer.innerHTML = ""; // Clear the container before loading new requests

  try {
    console.log(`Fetching requests from path: users/${userId}/requests`);
    const userRequestsRef = collection(db, `users/${userId}/requests`);
    const requestsSnapshot = await getDocs(userRequestsRef);

    requestsSnapshot.forEach((requestDoc) => {
      requestsFound = true;
      const request = requestDoc.data();
      const requestId = requestDoc.id; // Get the document ID

      const requestDiv = document.createElement("div");
      requestDiv.classList.add("request");
      requestDiv.innerHTML = `
        <p><strong>Requested Item:</strong> ${request.requestItem}</p>
        <p><strong>Requested Quantity:</strong> ${request.requestQuantity}</p>
        <p><strong>Email:</strong> ${request.requestEmail}</p>
        <button class="delete-btn" data-id="${requestId}">Delete</button>
      `;

      requestsContainer.appendChild(requestDiv);
    });

    if (!requestsFound) {
      requestsContainer.textContent = "No requests found.";
    }

    // Attach delete functionality to each delete button
    attachDeleteHandlers(userId, "requests");
  } catch (error) {
    console.error("Error fetching requests:", error.message);
    requestsContainer.textContent =
      "Failed to load requests. " + error.message;
  }
}

// Attach delete handlers to buttons
function attachDeleteHandlers(userId, type = "entries") {
  const deleteButtons = document.querySelectorAll(".delete-btn");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const documentId = button.getAttribute("data-id");
      const confirmDelete = confirm("Are you sure you want to delete this post?");

      if (confirmDelete) {
        try {
          const docRef = doc(db, `users/${userId}/${type}/${documentId}`);
          await deleteDoc(docRef);
          alert("Post deleted successfully!");
          // Refresh the list of entries or requests
          if (type === "entries") fetchEntries(userId);
          else fetchRequests(userId);
        } catch (error) {
          console.error("Error deleting post:", error.message);
          alert("Failed to delete the post. Please try again.");
        }
      }
    });
  });
}
