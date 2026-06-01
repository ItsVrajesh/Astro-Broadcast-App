import React, { useState } from "react";
import { Trash2 } from "lucide-react";

export default function Sidebar({
  chats,
  selectChat,
  selectedChat,
  currentUser,
  createChat,
  handleLogout,
  deleteChat,
}) {
  const [isDragOverBin, setIsDragOverBin] = useState(false);

  return (
    <div className="w-80 glass-dark rounded-3xl flex flex-col overflow-hidden text-white p-4">
      
      {/* --- USER PROFILE SECTION --- */}
      <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-3 mb-4 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <img
            src={currentUser?.photoURL || "/default-avatar.png"}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover shrink-0 border-2 border-[#8b5cf6]/50"
          />
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-white truncate w-full capitalize">
              {currentUser?.displayName || "User"}
            </span>
            <span className="text-[10px] text-[#8b5cf6] font-medium tracking-wide uppercase">
              Online
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="shrink-0 p-2 ml-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-all duration-200"
          title="Logout"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </button>
      </div>

      {/* --- CHANNELS SECTION --- */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* New Broadcast Button */}
        <button
          onClick={createChat}
          className="w-full shrink-0 flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-[#8b5cf6] to-[#4f46e5] rounded-xl text-white font-medium text-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:scale-[1.02] active:scale-[0.98]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Broadcast
        </button>

        {/* Section Header */}
        <div className="mt-6 mb-3 px-1 flex items-center justify-between shrink-0">
          <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Active Channels</h3>
          <span className="text-[10px] text-[#8b5cf6] bg-[#8b5cf6]/10 px-2 py-0.5 rounded-full font-medium border border-[#8b5cf6]/20">
            {chats?.length || 0}
          </span>
        </div>

        {/* Chat List (Scrollable) */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 pb-2 scrollbar-hide">
          {chats?.map((chat) => (
            <div
              key={chat.id}
              draggable={true}
              onDragStart={(e) => {
                e.dataTransfer.setData("chatId", chat.id);
              }}
              onClick={() => selectChat(chat)}
              className={`group relative flex items-center p-3 rounded-xl cursor-pointer transition-all duration-200 border ${
                selectedChat?.id === chat.id
                  ? 'bg-[#8b5cf6]/20 border-[#8b5cf6]/50 shadow-[inset_0_0_20px_rgba(139,92,246,0.1)]'
                  : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
              }`}
            >
              <div className={`p-2 rounded-lg mr-3 transition-colors ${
                selectedChat?.id === chat.id ? 'bg-[#8b5cf6]/30 text-[#c4b5fd]' : 'bg-black/20 text-gray-400 group-hover:text-gray-300'
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              
              <span className={`text-sm font-medium truncate ${
                selectedChat?.id === chat.id ? 'text-white' : 'text-gray-300'
              }`}>
                {chat.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* --- DELETE ZONE --- */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={() => setIsDragOverBin(true)}
        onDragLeave={() => setIsDragOverBin(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOverBin(false);
          const chatIdToDelete = e.dataTransfer.getData("chatId");
          if (chatIdToDelete) {
            if (window.confirm("Are you sure you want to delete this broadcast?")) {
              deleteChat(chatIdToDelete);
            }
          }
        }}
        className={`mt-2 shrink-0 py-4 rounded-xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center cursor-pointer ${
          isDragOverBin
            ? "border-red-500 bg-red-500/20 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
            : "border-gray-600/40 bg-black/20 text-gray-500 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
        }`}
      >
        <Trash2 className={`w-5 h-5 mb-1 transition-all ${isDragOverBin ? "animate-bounce" : "opacity-70 group-hover:opacity-100"}`} />
        <span className="text-[10px] font-bold tracking-widest uppercase">
          {isDragOverBin ? "Drop to Delete" : "Drag here to delete"}
        </span>
      </div>

    </div>
  );
}