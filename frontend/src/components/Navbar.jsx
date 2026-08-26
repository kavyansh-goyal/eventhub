import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="text-xl font-bold text-primary-600">
          Event<span className="text-gray-900">Hub</span>
        </Link>
        <div className="flex items-center gap-4 text-sm font-medium">
          <Link to="/" className="hover:text-primary-600">Events</Link>
          {user && (
            <Link to="/my-tickets" className="hover:text-primary-600">My Tickets</Link>
          )}
          {user && (user.role === "organizer" || user.role === "admin") && (
            <>
              <Link to="/dashboard" className="hover:text-primary-600">Dashboard</Link>
              <Link to="/create-event" className="hover:text-primary-600">Create Event</Link>
              <Link to="/attendance" className="hover:text-primary-600">Check-In</Link>
            </>
          )}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-gray-500">Hi, {user.name.split(" ")[0]}</span>
              <button
                onClick={handleLogout}
                className="bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="hover:text-primary-600">Login</Link>
              <Link
                to="/register"
                className="bg-primary-600 text-white px-3 py-1.5 rounded-lg hover:bg-primary-700"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
