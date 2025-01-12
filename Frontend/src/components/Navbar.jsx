import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, LogOut, User, Menu, X } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

function Navbar() {
  const { authUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    const success = await logout();

    if (success === true) {
      navigate('/login');
      setIsMobileMenuOpen(false);
    }
    
  };

  return (
    <div className="navbar bg-base-100 shadow-lg sticky top-0 z-50">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </label>
          {isMobileMenuOpen && (
            <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
              {authUser ? (
                <>
                  <div className="px-4 py-2 border-b border-base-200">
                    <div className="flex items-center space-x-3">
                      <div className="avatar placeholder">
                        <div className="w-8 rounded-full bg-secondary text-secondary-content">
                          <span>{authUser.name.charAt(0)}</span>
                        </div>
                      </div>
                      <span className="text-sm font-medium">{authUser.name}</span>
                    </div>
                  </div>
                  <li>
                    <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/createevent" onClick={() => setIsMobileMenuOpen(false)}>
                      Create Event
                    </Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="flex items-center">
                      <LogOut className="w-4 h-4 mr-2" /> Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center">
                      <User className="w-4 h-4 mr-2" /> Login
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          )}
        </div>
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          <Calendar className="mr-2" />
          EventHub
        </Link>
      </div>

      <div className="navbar-end hidden md:flex">
        {authUser ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar placeholder">
              <div className="w-10 rounded-full bg-secondary text-secondary-content">
                <span>{authUser.name.charAt(0)}</span>
              </div>
            </label>
            <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/createevent">Create Event</Link>
              </li>
              <li>
                <button onClick={handleLogout} className="flex items-center">
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="btn btn-ghost btn-sm normal-case flex items-center">
              <User className="w-4 h-4 mr-2" /> Login
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm normal-case">
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;