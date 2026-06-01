import React from "react";

export default function Header({ user, handleLogout, chatName }) {
  return (
    <header className="bg-white border-bottom shadow-sm px-4 py-2 d-flex align-items-center justify-content-between">
      <div className="d-flex align-items-center">
        <div className="bg-blue-600 p-2 rounded-lg me-2 flex items-center justify-center">
          <i className="bi bi-chat-fill text-white"></i>
        </div>
        <h5 className="m-0 fw-bold text-gray-800 tracking-tight">
          {chatName || "SyncChat"}
        </h5>
      </div>

      {user && (
        <div className="d-flex align-items-center gap-3">
          <div className="d-none d-md-block text-end">
            <p className="m-0 small fw-bold">{user.displayName}</p>
            <p className="m-0 text-muted" style={{ fontSize: '0.7rem' }}>{user.email}</p>
          </div>
          <button 
            className="btn btn-outline-danger btn-sm rounded-pill px-3 transition-all hover:bg-red-50" 
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right me-1"></i> Logout
          </button>
        </div>
      )}
    </header>
  );
}