import React, { useState, useEffect, useRef } from "react";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export default function ChatWindow({ chat, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    if (!chat?.id) return;
    const q = query(collection(db, "chats", chat.id, "messages"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [chat]);

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
        timestamp: serverTimestamp()
      });
      setText("");
    } catch (err) {
      console.error(err);
    }
  };

  if (!chat) {
    return (
      <div className="flex-1 glass-dark rounded-3xl flex items-center justify-center text-white/50">
        <div className="text-center">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
          <p>Select a transmission channel to begin</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 glass-dark rounded-3xl flex flex-col overflow-hidden relative">
      {/* Chat Header */}
      <div className="p-5 border-b border-white/10 bg-white/5 backdrop-blur-md flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold text-white shadow-md">
          {chat.name.charAt(0).toUpperCase()}
        </div>
        <h3 className="font-bold text-white text-lg">{chat.name}</h3>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map(msg => {
          const isSent = msg.senderId === currentUser.uid;
          return (
            <div key={msg.id} className={`flex gap-3 ${isSent ? "justify-end" : "justify-start"}`}>
              {!isSent && <img src={msg.senderPhoto} alt="User" className="w-8 h-8 rounded-full border border-white/20" />}
              <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm shadow-md ${
                isSent ? "bg-[#8b5cf6] text-white rounded-tr-none" : "bg-white/10 text-white rounded-tl-none border border-white/5"
              }`}>
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-black/20 border-t border-white/5">
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8b5cf6] transition-colors placeholder-white/30"
          />
          <button type="submit" className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-6 py-3 rounded-xl font-medium transition-colors">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}