import {FaHeart} from "react-icons/fa";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [openDropdown, setOpenDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

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

  const handleLogout = () => {
    logout();
    setOpenDropdown(false);
    setMenuOpen(false);
    navigate("/login");
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setOpenDropdown(false);
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="logo" onClick={closeMenu}>
          Roomy
        </Link>

        <div
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </div>

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
             <Link to="/wishlist" onClick={closeMenu} className="wishlist-link">
  <FaHeart className="wishlist-icon" />
</Link>

              {user.role === "owner" && (
                <>
                  <Link to="/owner" onClick={closeMenu}>Owner Dashboard</Link>

                  <Link to="/owner-bookings" onClick={closeMenu}>
                    Owner Bookings
                    {pendingCount > 0 && (
                      <span className="notification-badge">{pendingCount}</span>
                    )}
                  </Link>

                  <Link to="/owner-analytics" onClick={closeMenu}>Analytics</Link>
                </>
              )}

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
                    onError={(e) => {
                      e.target.src =
                        "https://dummyimage.com/40x40/e2e8f0/334155&text=U";
                    }}
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

// import { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import API from "../services/api";

// function Navbar() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const [openDropdown, setOpenDropdown] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [pendingCount, setPendingCount] = useState(0);

//   const fetchPendingCount = async () => {
//     if (!user || user.role !== "owner") return;

//     try {
//       const res = await API.get("/bookings/owner/pending-count");
//       setPendingCount(res.data.pendingCount);
//     } catch (error) {
//       console.error("Error fetching pending count:", error);
//     }
//   };

//   useEffect(() => {
//     fetchPendingCount();
//   }, [user]);

//   const handleLogout = () => {
//     logout();
//     setOpenDropdown(false);
//     setMenuOpen(false);
//     navigate("/login");
//   };

//   const closeMenu = () => {
//     setMenuOpen(false);
//     setOpenDropdown(false);
//   };

//   return (
//     <header className="navbar">
//       <div className="container navbar-inner">
//         <Link to="/" className="logo" onClick={closeMenu}>
//           Roomy
//         </Link>

//         <div
//           className="hamburger"
//           onClick={() => setMenuOpen(!menuOpen)}
//         >
//           ☰
//         </div>

//         <nav className={`nav-links ${menuOpen ? "active" : ""}`}>
//           <Link to="/" onClick={closeMenu}>Home</Link>
//           <Link to="/listings" onClick={closeMenu}>Listings</Link>

//           {!user ? (
//             <>
//               <Link to="/login" onClick={closeMenu}>Login</Link>
//               <Link to="/register" onClick={closeMenu}>Register</Link>
//             </>
//           ) : (
//             <>
//               <Link to="/bookings" onClick={closeMenu}>Bookings</Link>
//               <Link to="/wishlist" onClick={closeMenu}>Wishlist</Link>

//               {user.role === "owner" && (
//                 <>
//                   <Link to="/owner" onClick={closeMenu}>Owner Dashboard</Link>

//                   <Link to="/owner-bookings" onClick={closeMenu}>
//                     Owner Bookings
//                     {pendingCount > 0 && (
//                       <span className="notification-badge">{pendingCount}</span>
//                     )}
//                   </Link>

//                   <Link to="/owner-analytics" onClick={closeMenu}>Analytics</Link>
//                 </>
//               )}

//               <div className="profile-menu">
//                 <div
//                   className="profile-trigger"
//                   onClick={() => setOpenDropdown(!openDropdown)}
//                 >
//                   <img
//                     src={
//                       user.photo && user.photo.trim() !== ""
//                         ? user.photo
//                         : "https://dummyimage.com/40x40/e2e8f0/334155&text=U"
//                     }
//                     alt={user.name}
//                     className="navbar-profile-image"
//                     onError={(e) => {
//                       e.target.src =
//                         "https://dummyimage.com/40x40/e2e8f0/334155&text=U";
//                     }}
//                   />
//                   <span>{user.name}</span>
//                 </div>

//                 {openDropdown && (
//                   <div className="dropdown">
//                     <Link to="/profile" onClick={closeMenu}>
//                       My Profile
//                     </Link>

//                     <button onClick={handleLogout}>
//                       Logout
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </>
//           )}
//         </nav>
//       </div>
//     </header>
//   );
// }

// export default Navbar;