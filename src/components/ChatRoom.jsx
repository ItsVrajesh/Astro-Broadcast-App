import { useEffect, useState, useRef } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

export default function ChatRoom() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef();

  // Listen to messages in real-time
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    });
    return () => unsubscribe();
  }, []);

  // Send a new message
  const sendMessage = async (e) => {
    if (!auth.currentUser) {
      alert("Please login first");
      return;
    }

    e.preventDefault();
    if (!input) return;

    await addDoc(collection(db, "messages"), {
      text: input,
      uid: auth.currentUser.uid,
      photoURL: auth.currentUser.photoURL,
      displayName: auth.currentUser.displayName,
      timestamp: serverTimestamp(),
    });

    setInput("");
  };

  return (
    <div className="container my-4" style={{ maxWidth: "700px" }}>
      <div className="card shadow-lg">
        {/* Chat Header */}
        <div className="card-header bg-primary text-white text-center fs-5">
          Chat Room
        </div>

        {/* Chat Messages */}
        <div
          className="card-body overflow-auto"
          style={{ height: "60vh", backgroundColor: "#f8f9fa" }}
        >
          {messages.map((msg) => {
            const isOwn = msg.uid === auth.currentUser.uid;
            return (
              <div
                key={msg.id}
                className={`d-flex mb-3 ${
                  isOwn ? "justify-content-end" : "justify-content-start"
                }`}
              >
                {!isOwn && (
                  <img
                    src={msg.photoURL}
                    alt={msg.displayName}
                    className="rounded-circle me-2"
                    style={{ width: "40px", height: "40px" }}
                  />
                )}
                <div>
                  <div
                    className={`p-2 rounded px-3`}
                    style={{
                      maxWidth: "300px",
                      backgroundColor: isOwn ? "#0d6efd" : "#e9ecef",
                      color: isOwn ? "white" : "black",
                    }}
                  >
                    {msg.text}
                  </div>
                  <div className="text-muted text-end small mt-1">
                    {msg.timestamp?.seconds
                      ? new Date(
                          msg.timestamp.seconds * 1000
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </div>
                </div>
                {isOwn && (
                  <img
                    src={msg.photoURL}
                    alt={msg.displayName}
                    className="rounded-circle ms-2"
                    style={{ width: "40px", height: "40px" }}
                  />
                )}
              </div>
            );
          })}
          <div ref={bottomRef}></div>
        </div>

        {/* Input Area */}
        <form className="card-footer d-flex p-2" onSubmit={sendMessage}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="form-control me-2 rounded-pill"
          />
          <button type="submit" className="btn btn-primary rounded-pill px-4">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}


