import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Chatbot from "./components/Chatbot";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Listings from "./pages/Listings";
import PgDetails from "./pages/PgDetails";
import Bookings from "./pages/Bookings";
import OwnerDashboard from "./pages/OwnerDashboard";
import NotFound from "./pages/NotFound";
import OwnerBookings from "./pages/OwnerBookings";
import OwnerAnalytics from "./pages/OwnerAnalytics";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/pg/:id" element={<PgDetails />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/owner" element={<OwnerDashboard />} />
        <Route path="/owner-bookings" element={<OwnerBookings />} />
        <Route path="/owner-analytics" element={<OwnerAnalytics />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

       <Chatbot />
    </BrowserRouter>
  );
}

export default App;