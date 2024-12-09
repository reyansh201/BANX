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

let allRequests = [];
let currentUserId = null;

// Show a loading indicator
function showLoadingMessage() {
  const requestsContainer = document.getElementById("requestsContainer");
  requestsContainer.innerHTML = "<p>Loading requests...</p>";
}

// Render fetched requests into the DOM
function renderRequests(requests) {
  const requestsContainer = document.getElementById("requestsContainer");

  // Clear previous content
  requestsContainer.innerHTML = "";

  if (requests.length === 0) {
    requestsContainer.innerHTML = "<p>No requests found.</p>";
    return;
  }

  // Create cards for each request
  requests.forEach((request) => {
    const requestDiv = document.createElement("div");
    requestDiv.classList.add("entry-box");
    requestDiv.dataset.requestId = request.requestId;

    requestDiv.innerHTML = `
      <h3>Item: ${request.requestItem}</h3>
      <p><strong>Quantity:</strong> ${request.requestQuantity}</p>
      <p><strong>Email:</strong> ${request.requestEmail}</p>
    `;

    // Add event listener to show popup when request box is clicked
    requestDiv.addEventListener("click", () => {
      showPopup(request);
    });

    requestsContainer.appendChild(requestDiv);
  });
}

// Function to display the request details in a larger popup
function showPopup(request) {
  const popup = document.getElementById("popup");
  const popupContent = document.getElementById("popupContent");

  // Populate the popup with request details
  popupContent.innerHTML = `
    <h3>Item: ${request.requestItem}</h3>
    <p><strong>Quantity:</strong> ${request.requestQuantity}</p>
    <p><strong>Email:</strong> ${request.requestEmail}</p>
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

// Fetch requests from Firebase
async function fetchRequests() {
  showLoadingMessage(); // Show loading indicator

  try {
    const usersRef = collection(db, "users");
    const usersSnapshot = await getDocs(usersRef);

    allRequests = []; // Reset requests

    // Iterate through all users to get their requests
    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const requestsRef = collection(db, `users/${userId}/requests`);
      const requestsSnapshot = await getDocs(requestsRef);

      requestsSnapshot.forEach((requestDoc) => {
        allRequests.push({ userId, requestId: requestDoc.id, ...requestDoc.data() });
      });
    }

    // Filter out requests made by the current user
    const filteredRequests = allRequests.filter((request) => request.userId !== currentUserId);

    renderRequests(filteredRequests); // Render the requests
  } catch (error) {
    console.error("Error fetching requests:", error);
    document.getElementById("requestsContainer").innerHTML = "<p>Error loading requests.</p>";
  }
}

// Filter displayed requests based on search terms
function filterRequests() {
  const itemSearchTerm = document.getElementById("itemSearchInput").value.toLowerCase();

  const filteredRequests = allRequests
    .filter((request) => request.userId !== currentUserId)
    .filter((request) => {
      return (
        request.requestItem &&
        request.requestItem.toLowerCase().includes(itemSearchTerm)
      );
    });

  renderRequests(filteredRequests);
}

// Handle authentication state
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUserId = user.uid;
    fetchRequests();

    // Set user profile picture
    const profilePicElement = document.getElementById("profilePic");
    const userProfilePic = user.photoURL ? user.photoURL : "default-profile-pic.jpg";
    profilePicElement.src = userProfilePic;

    // Profile popup and sign-out
    const profileBtn = document.getElementById("profileContainer");
    const overlay = document.getElementById("overlay");
    const signOutPopup = document.getElementById("signOutPopup");
    const signOutButton = document.getElementById("signOutButton");
    const cancelButton = document.getElementById("cancelButton");

    profileBtn.addEventListener("click", () => {
      overlay.style.display = "block";
      signOutPopup.style.display = "block";
    });

    overlay.addEventListener("click", () => {
      overlay.style.display = "none";
      signOutPopup.style.display = "none";
    });

    cancelButton.addEventListener("click", () => {
      overlay.style.display = "none";
      signOutPopup.style.display = "none"; // Close the popup if 'No' is clicked
    });

    signOutButton.addEventListener("click", async () => {
      try {
        await signOut(auth);
        window.location.href = "home.html"; // Redirect to home.html after sign out
      } catch (error) {
        console.error("Error signing out:", error.message);
      }
    });
  } else {
    document.getElementById("requestsContainer").innerHTML = "<p>Please log in to view requests.</p>";
  }
});

// Add event listener to search input
document.getElementById("itemSearchInput").addEventListener("input", filterRequests);
