import React, { useState, useEffect, useRef } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

export default function ChatWindow({ chat, currentUser, selectChat }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const endRef = useRef(null);

  const isFirstLoad = useRef(true);
  
  // --- 1. REPLACED new Audio() WITH A REACT REF ---
  const audioRef = useRef(null);
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  // --- 2. THE MOBILE UNLOCK TRICK ---
  const unlockAudio = () => {
    if (!audioUnlocked && audioRef.current) {
      // Play silently on the first tap to get browser permission
      audioRef.current.volume = 0; 
      audioRef.current.play().then(() => {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.volume = 1; // Turn volume back up for real messages
        setAudioUnlocked(true);
      }).catch(err => console.log("Unlock failed:", err));
    }
  };

  useEffect(() => {
    if (!chat?.id) return;
    
    isFirstLoad.current = true;

    const q = query(
      collection(db, "chats", chat.id, "messages"),
      orderBy("timestamp", "asc")
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

      if (!isFirstLoad.current) {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const newMessage = change.doc.data();
            if (newMessage.senderId !== currentUser.uid) {
              
              // --- 3. TRIGGER THE DOM AUDIO REF ---
              if (audioRef.current) {
                audioRef.current.play().catch((err) => {
                  console.log("Browser blocked autoplay:", err);
                });
              }

            }
          }
        });
      }

      isFirstLoad.current = false;
    });
    
    return () => unsubscribe();
  }, [chat, currentUser.uid]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() || !chat?.id) return;
    try {
      await addDoc(collection(db, "chats", chat.id, "messages"), {
        text,
        senderId: currentUser.uid,
        senderPhoto: currentUser.photoURL,
        displayName: currentUser.displayName,
        timestamp: serverTimestamp(),
      });
      setText("");
    } catch (err) {
      console.error(err);
    }
  };

  if (!chat) {
    return (
      <div className="flex-1 glass-dark rounded-3xl hidden md:flex items-center justify-center text-white/50">
        <div className="text-center">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
          <p>Select a transmission channel to begin</p>
        </div>
      </div>
    );
  }

  return (
    // --- 4. ATTACHED UNLOCK TRIGGER TO THE ENTIRE CHAT WINDOW ---
    <div 
      onClick={unlockAudio} 
      onTouchStart={unlockAudio}
      className="flex-1 glass-dark rounded-3xl flex flex-col overflow-hidden relative w-full shadow-2xl"
    >
      
      {/* --- HIDDEN AUDIO TAG IN THE DOM --- */}
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />

      {/* --- POLISHED CHAT HEADER --- */}
      <div className="p-4 sm:p-5 border-b border-white/5 bg-white/5 backdrop-blur-xl flex items-center gap-3 z-10">
        <button
          onClick={() => selectChat(null)}
          className="md:hidden p-2 -ml-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#4f46e5] flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(139,92,246,0.3)] shrink-0">
          {chat.name.charAt(0).toUpperCase()}
        </div>
        <h3 className="font-bold text-white text-lg tracking-wide">
          {chat.name}
        </h3>
      </div>

      {/* --- POLISHED MESSAGES AREA --- */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 scrollbar-hide">
        {messages.map((msg) => {
          const isSent = msg.senderId === currentUser.uid;
          return (
            <div key={msg.id} className={`flex gap-3 ${isSent ? "justify-end" : "justify-start"}`}>
              {!isSent && (
                <img
                  src={msg.senderPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.displayName || "U")}&background=374151&color=fff`}
                  alt="User"
                  className="w-8 h-8 rounded-full border border-white/10 object-cover bg-gray-800 shrink-0 mt-auto"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://ui-avatars.com/api/?name=U&background=374151&color=fff";
                  }}
                />
              )}

              <div className={`flex flex-col ${isSent ? "items-end" : "items-start"} max-w-[75%] sm:max-w-[70%]`}>
                {!isSent && (
                  <span className="text-[11px] text-white/40 font-semibold mb-1 ml-1 tracking-wider uppercase truncate max-w-full">
                    {msg.displayName || "Unknown User"}
                  </span>
                )}

                <div className={`px-4 py-2.5 text-[15px] shadow-sm leading-relaxed w-full ${isSent ? "bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] text-white rounded-2xl rounded-br-sm shadow-[0_4px_15px_rgba(139,92,246,0.2)]" : "bg-white/10 backdrop-blur-md text-gray-100 rounded-2xl rounded-bl-sm border border-white/5"}`}>
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={endRef} className="h-2" />
      </div>

      {/* --- SLEEK PILL-SHAPED INPUT AREA --- */}
      <div className="p-3 sm:p-4 bg-black/20 border-t border-white/5 backdrop-blur-md w-full overflow-hidden">
        <form onSubmit={sendMessage} className="flex gap-2 max-w-4xl mx-auto w-full relative">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 min-w-0 w-full bg-white/5 border border-white/10 rounded-full px-4 sm:px-5 py-3 text-white text-sm focus:outline-none focus:border-[#8b5cf6] focus:bg-white/10 transition-all placeholder-white/30 shadow-inner"
          />
          <button type="submit" disabled={!text.trim()} className="bg-[#8b5cf6] hover:bg-[#7c3aed] disabled:opacity-50 disabled:hover:bg-[#8b5cf6] text-white px-5 sm:px-8 py-3 rounded-full font-semibold transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] active:scale-95 shrink-0">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}