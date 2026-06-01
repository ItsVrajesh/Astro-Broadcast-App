import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, onSnapshot, addDoc, serverTimestamp, doc, deleteDoc } from "firebase/firestore";
import VantaHaloBackground from './components/VantaHaloBackground';
import VantaCellsBackground from "./components/VantaCellsBackground";

import Login from "./components/Login";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";

export default function App() {
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(collection(db, "chats"), (snapshot) => {
      setChats(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [user]);

  const createNewChat = async () => {
    const chatName = prompt("Enter new chat name:");
    if (!chatName) return;
    await addDoc(collection(db, "chats"), {
      name: chatName,
      createdAt: serverTimestamp(),
      lastMessage: "Say hello!",
    });
  };
  const handleDeleteChat = async (chatId) => {
  try {
    // Delete from Firestore
    await deleteDoc(doc(db, "chats", chatId));
    
    // Optional: If the user is currently looking at the chat they just deleted, clear it
    if (selectedChat?.id === chatId) {
      setSelectedChat(null);
    }
  } catch (error) {
    console.error("Error deleting chat: ", error);
  }
};

  const handleLogout = () => signOut(auth);

  return (
  <>
    {user ? (
      /* ------------------------------------------- */
      /* LOGGED IN: Normal Chat Dashboard Background */
      /* ------------------------------------------- */
      <VantaCellsBackground>
        <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 relative">
          
          {/* Subtle dark overlay so the chat interface pops */}
          <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>
          
          {/* Main Chat Layout */}
          <div className="relative z-10 flex w-full max-w-[1400px] h-[90vh] gap-4">
            <Sidebar 
              chats={chats} 
              selectedChat={selectedChat} 
              selectChat={setSelectedChat} 
              currentUser={user}
              createChat={createNewChat}
              handleLogout={handleLogout}
              deleteChat={handleDeleteChat}
            />
            <ChatWindow chat={selectedChat} currentUser={user} />
          </div>

        </div>
      </VantaCellsBackground>
    ) : (
      /* ------------------------------------------- */
      /* LOGGED OUT: Vanta Halo Background           */
      /* ------------------------------------------- */
      <VantaHaloBackground>
        <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 relative">
          
          {/* Subtle dark overlay for readability */}
          <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>

          <div className="relative z-10 w-full flex justify-center">
             <Login setUser={setUser} />
          </div>
          
        </div>
      </VantaHaloBackground>
    )}
  </>
);
}