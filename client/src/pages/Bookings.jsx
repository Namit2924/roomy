import { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

function Bookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const res = await API.get("/bookings/user");
      setBookings(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setLoading(false);
    }
  };

  const handlePayment = async (bookingId) => {
    const confirmPay = window.confirm("Do you want to continue payment?");
    if (!confirmPay) return;

    try {
      const res = await API.post("/payments/pay", { bookingId });
      alert(res.data.message);
      fetchBookings();
    } catch (error) {
      alert(error.response?.data?.message || "Payment failed");
    }
  };

  useEffect(() => {
  const interval = setInterval(() => {
    fetchBookings();
  }, 5000); // every 5 sec

  return () => clearInterval(interval);
}, [user]);

  if (!user) {
    return (
      <div className="container">
        <h2 className="page-title">Please login to view your bookings</h2>
      </div>
    );
  }

  // if (loading) {
  //   return (
  //     <div className="container">
  //       <h2 className="page-title">Loading your bookings...</h2>
  //     </div>
  //   );
  // }
  if (loading) {
  return (
    <div className="container card-grid">
      {[...Array(6)].map((_, i) => (
        <div className="skeleton-card" key={i}></div>
      ))}
    </div>
  );
}

  return (
    <div className="container">
      <h2 className="page-title">My Bookings</h2>

      {bookings.length === 0 ? (
        <div className="empty-state">
  <h2>No PGs found 😔</h2>
  <p>Try searching in another city</p>
</div>
      ) : (
        <div className="card-grid">
          {bookings.map((booking) => (
            <div className="card" key={booking._id}>
              <img
                src={
                  booking.pg?.images && booking.pg.images.length > 0
                    ? booking.pg.images[0]
                    : "https://dummyimage.com/400x220/e2e8f0/334155&text=No+Image"
                }
                alt={booking.pg?.title || "PG Image"}
                className="pg-card-image"
                onError={(e) => {
                  e.target.src =
                    "https://dummyimage.com/400x220/e2e8f0/334155&text=Image+Not+Available";
                }}
              />

              <h3>{booking.pg?.title}</h3>
              <p><strong>City:</strong> {booking.pg?.city}</p>
              <p><strong>Location:</strong> {booking.pg?.location}</p>
              <p><strong>Price:</strong> ₹{booking.pg?.price}</p>
              <p>
                <strong>Check-In Date:</strong>{" "}
                {new Date(booking.checkInDate).toLocaleDateString()}
              </p>
              <p><strong>Duration:</strong> {booking.duration} months</p>
              <p><strong>Quantity:</strong> {booking.quantity}</p>
              <p><strong>Status:</strong> {booking.status}</p>
              <p><strong>Payment:</strong> {booking.paymentStatus}</p>

              {booking.paymentStatus !== "paid" && (
                <button
                  className="btn"
                  onClick={() => handlePayment(booking._id)}
                  style={{ marginTop: "10px" }}
                >
                  Pay Now
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Bookings;