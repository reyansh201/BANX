// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js";
// import { getFirestore, doc, getDoc, setDoc, collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";

// // Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyAxyqS37V2TVwAZdszNBfPOJbA0I3Iu0z8",
//     authDomain: "ftcfinder-f2e06.firebaseapp.com",
//     projectId: "ftcfinder-f2e06",
//     storageBucket: "ftcfinder-f2e06.appspot.com",
//     messagingSenderId: "975921021643",
//     appId: "1:975921021643:web:e0f0f5ff29d4376fe9114e"
//   };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// const userId = "YOUR_USER_ID";  // Replace with the current user's ID
// const recipientId = "RECIPIENT_USER_ID";  // Replace with the ID of the user you're sending a message to
// const conversationId = `${userId}_${recipientId}`;  // Unique ID based on userId and recipientId

// // Function to load conversation messages
// async function loadMessages() {
//   try {
//     const messagesRef = collection(db, "conversations", conversationId, "messages");
//     const messagesSnapshot = await getDocs(messagesRef);
//     const messagesContainer = document.getElementById("messagesContainer");

//     messagesContainer.innerHTML = ""; // Clear existing messages

//     messagesSnapshot.forEach((doc) => {
//       const message = doc.data();
//       const messageElement = document.createElement("div");
//       messageElement.classList.add(message.senderId === userId ? "sent" : "received");
//       messageElement.textContent = `${message.senderId}: ${message.text}`;
//       messagesContainer.appendChild(messageElement);
//     });
//   } catch (error) {
//     console.error("Error loading messages:", error);
//   }
// }

// // Function to send a message
// async function sendMessage() {
//   const messageInput = document.getElementById("messageInput");
//   const messageText = messageInput.value.trim();
  
//   if (messageText) {
//     try {
//       const messagesRef = collection(db, "conversations", conversationId, "messages");
//       const newMessageRef = await addDoc(messagesRef, {
//         senderId: userId,
//         recipientId: recipientId,
//         text: messageText,
//         timestamp: new Date().toISOString()
//       });

//       console.log("Message sent with ID: ", newMessageRef.id);
//       loadMessages(); // Reload messages after sending
//       messageInput.value = ""; // Clear input field
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   }
// }

// // Load messages when the page is loaded
// loadMessages();

// // Event listener for the send message button
// document.getElementById("sendMessageButton").addEventListener("click", sendMessage);
