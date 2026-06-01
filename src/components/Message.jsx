import React from "react";

export default function Message({ message, currentUser }) {
  const isSent = message.senderId === currentUser.uid;

  return (
    <div className={`d-flex mb-3 ${isSent ? "justify-content-end" : "justify-content-start"}`}>
      {/* Received Message Avatar */}
      {!isSent && (
        <img
          src={message.senderPhoto || "https://ui-avatars.com/api/?name=User"}
          alt="Avatar"
          className="rounded-full me-2 self-end shadow-sm"
          style={{ width: "28px", height: "28px" }}
        />
      )}

      <div className="d-flex flex-column" style={{ maxWidth: "70%" }}>
        {/* Name for Group Chats (Optional) */}
        {!isSent && (
          <span className="text-muted mb-1 ms-1" style={{ fontSize: "0.7rem" }}>
            {message.senderName}
          </span>
        )}

        {/* Message Bubble */}
        <div
          className={`px-3 py-2 shadow-sm transition-all duration-200 ${
            isSent
              ? "bg-blue-600 text-white rounded-t-2xl rounded-bl-2xl"
              : "bg-white text-gray-800 rounded-t-2xl rounded-br-2xl border border-gray-100"
          }`}
        >
          <p className="m-0 leading-relaxed" style={{ fontSize: "0.95rem" }}>
            {message.text}
          </p>
          
          {/* Timestamp */}
          <div 
            className={`text-end mt-1 opacity-70`} 
            style={{ fontSize: "0.65rem" }}
          >
            {message.time}
          </div>
        </div>
      </div>

      {/* Sent Message Avatar (Optional - often omitted for clean look) */}
      {isSent && (
        <img
          src={message.senderPhoto}
          alt="Me"
          className="rounded-full ms-2 self-end shadow-sm border border-white"
          style={{ width: "28px", height: "28px" }}
        />
      )}
    </div>
  );
}