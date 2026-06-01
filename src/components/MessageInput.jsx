import React, { useState } from "react";

export default function MessageInput({ sendMessage }) {
  const [text, setText] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendMessage(text);
    setText("");
  };

  return (
    <form className="d-flex p-3 border-top" onSubmit={handleSend}>
      <input
        type="text"
        className="form-control me-2"
        placeholder="Type a message"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit" className="btn btn-primary">Send</button>
    </form>
  );
}
