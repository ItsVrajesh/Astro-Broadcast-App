import React, { useState } from "react";
import { Trash2 } from "lucide-react";

export default function Sidebar({
  chats,
  selectChat,
  selectedChat,
  currentUser,
  createChat,
  handleLogout,
  deleteChat, // <-- Added deleteChat here
}) {
  // 1. Define your state inside the actual component
  const [isDragOverBin, setIsDragOverBin] = useState(false);

  return (
    <div className="w-80 glass-dark rounded-3xl flex flex-col overflow-hidden text-white">
      {/* Header Profile Area */}
      <div className="p-5 border-b border-white/10 flex justify-between items-center bg-white/5">
        <div className="flex items-center gap-3">
          <img
            src={currentUser?.photoURL}
            alt="User"
            className="w-10 h-10 rounded-full border border-white/20"
          />
          <div className="font-semibold text-sm truncate w-32">
            {currentUser?.displayName}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs bg-white/10 hover:bg-red-500/80 px-3 py-1.5 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Controls */}
      <div className="p-4">
        <button
          onClick={createChat}
          className="w-full flex items-center justify-center gap-2 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-purple-500/20"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            ></path>
          </svg>
          New Broadcast
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto space-y-2 p-4">
        {chats.map((chat) => (
          <div
            key={chat.id}
            // Make the item draggable
            draggable={true}
            // Store the chat ID in the dataTransfer object when dragging starts
            onDragStart={(e) => {
              e.dataTransfer.setData("chatId", chat.id);
            }}
            onClick={() => selectChat(chat)}
            className={`p-3 rounded-xl cursor-pointer transition-colors ${
              selectedChat?.id === chat.id
                ? "bg-[#4b4e6d]"
                : "bg-[#2a2d3d] hover:bg-[#34374b]"
            }`}
          >
            <div className="font-medium text-white">{chat.name}</div>
          </div>
        ))}
      </div>
      
      {/* The Bin Drop Zone */}
      <div
        // Required to allow dropping
        onDragOver={(e) => e.preventDefault()}
        // Visual feedback when dragged item enters the bin area
        onDragEnter={() => setIsDragOverBin(true)}
        // Revert visual feedback when item leaves
        onDragLeave={() => setIsDragOverBin(false)}
        // Handle the actual drop
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOverBin(false); // Reset visual state

          // Retrieve the ID we set in onDragStart
          const chatIdToDelete = e.dataTransfer.getData("chatId");

          if (chatIdToDelete) {
            // Trigger a confirmation or delete it directly
            if (
              window.confirm("Are you sure you want to delete this broadcast?")
            ) {
              // Call your delete function here (e.g., Firestore deleteDoc)
              deleteChat(chatIdToDelete);
            }
          }
        }}
        className={`h-20 border-t border-gray-700/50 flex flex-col items-center justify-center transition-all duration-200 ${
          isDragOverBin
            ? "bg-red-500/20 text-red-500 border-red-500/50" // Highlighted state
            : "text-gray-500 hover:text-gray-400" // Normal state
        }`}
      >
        <Trash2
          className={`w-6 h-6 mb-1 ${isDragOverBin ? "animate-bounce" : ""}`}
        />
        <span className="text-xs font-semibold uppercase tracking-wider">
          {isDragOverBin ? "Drop to Delete" : "Drag here to delete"}
        </span>
      </div>
    </div>
  );
}