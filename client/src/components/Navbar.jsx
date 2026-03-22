import { FaHeart, FaInbox } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import socket from "../socket";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [openDropdown, setOpenDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [chatNotification, setChatNotification] = useState(false);
  const [bookingNotification, setBookingNotification] = useState(false);

  // 🔹 Owner pending bookings
  const fetchPendingCount = async () => {
    if (!user || user.role !== "owner") return;

    try {
      const res = await API.get("/bookings/owner/pending-count");
      setPendingCount(res.data.pendingCount);
    } catch (error) {
      console.error("Error fetching pending count:", error);
    }
  };

  useEffect(() => {
    if (user?.role === "owner") {
      fetchPendingCount();
    } else {
      setPendingCount(0);
    }
  }, [user]);

  // 🔹 Socket real-time notifications
  useEffect(() => {
  if (!user) return;

  socket.emit("joinUserRoom", user._id);

  socket.on("newNotification", () => {
    setChatNotification(true);
  });

  socket.on("newBookingNotification", () => {
    setBookingNotification(true);
    if (user.role === "owner") {
      fetchPendingCount();
    }
  });

  socket.on("bookingStatusUpdated", () => {
    setBookingNotification(true);
  });

  return () => {
    socket.off("newNotification");
    socket.off("newBookingNotification");
    socket.off("bookingStatusUpdated");
  };
}, [user]);

  const handleLogout = () => {
    logout();
    setOpenDropdown(false);
    setMenuOpen(false);
    setChatNotification(false);
    navigate("/login");
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setOpenDropdown(false);
    setChatNotification(false);
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        
        {/* Logo */}
        <Link to="/" className="logo" onClick={closeMenu}>
          Roomy
        </Link>

        {/* Mobile Menu */}
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>

        {/* Nav */}
        <nav className={`nav-links ${menuOpen ? "active" : ""}`}>
          <Link to="/" onClick={closeMenu}>Home</Link>
          <Link to="/listings" onClick={closeMenu}>Listings</Link>

          {!user ? (
            <>
              <Link to="/login" onClick={closeMenu}>Login</Link>
              <Link to="/register" onClick={closeMenu}>Register</Link>
            </>
          ) : (
            <>
              <Link to="/bookings" onClick={closeMenu}>Bookings</Link>

              {/* Wishlist Icon ❤️ */}
              <Link to="/wishlist" onClick={closeMenu} className="wishlist-link">
                <FaHeart className="wishlist-icon" />
              </Link>

              {/* Inbox with notification 🔔 */}
              <Link to="/inbox" onClick={closeMenu} className="inbox-link">
                <div className="inbox-icon-wrapper">
                  <FaInbox className="inbox-icon" />
                  {chatNotification && <span className="inbox-dot"></span>}
                </div>
              </Link>

              {/* Owner */}
              {user.role === "owner" && (
                <>
                  <Link to="/owner" onClick={closeMenu}>Dashboard</Link>

                 <Link to="/owner-bookings" onClick={closeMenu}>
  Bookings
  {(pendingCount > 0 || bookingNotification) && (
    <span className="notification-badge">
      {pendingCount > 0 ? pendingCount : "!"}
    </span>
  )}
</Link>

                  <Link to="/owner-analytics" onClick={closeMenu}>
                    Analytics
                  </Link>
                </>
              )}

              {/* Profile */}
              <div className="profile-menu">
                <div
                  className="profile-trigger"
                  onClick={() => setOpenDropdown(!openDropdown)}
                >
                  <img
                    src={
                      user.photo && user.photo.trim() !== ""
                        ? user.photo
                        : "https://dummyimage.com/40x40/e2e8f0/334155&text=U"
                    }
                    alt={user.name}
                    className="navbar-profile-image"
                  />
                  <span>{user.name}</span>
                </div>

                {openDropdown && (
                  <div className="dropdown">
                    <Link to="/profile" onClick={closeMenu}>
                      My Profile
                    </Link>

                    <button onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;