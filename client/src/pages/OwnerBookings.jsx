import { useEffect, useState } from "react";
import API from "../services/api";

function OwnerBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookings/owner");
      setBookings(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching owner bookings:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await API.put(`/bookings/${id}/status`, { status });
      setMessage(res.data.message);
      fetchBookings();
    } catch (error) {
      setMessage(error.response?.data?.message || "Status update failed");
    }
  };

  if (loading) {
    return (
      <div className="container">
        <h2 className="page-title">Loading booking requests...</h2>
      </div>
    );
  }

  const pendingBookings = bookings.filter((booking) => booking.status === "pending");
  const processedBookings = bookings.filter((booking) => booking.status !== "pending");

  return (
    <div className="container">
      <h2 className="page-title">Owner Booking Requests</h2>

      {message && <p className="success-message">{message}</p>}

      <div className="section-space">
        <h3 style={{ marginBottom: "15px" }}>
          Pending Requests ({pendingBookings.length})
        </h3>

        {pendingBookings.length === 0 ? (
          <div className="detail-box empty-state">
            <h3>No pending requests</h3>
            <p>New user bookings will appear here.</p>
          </div>
        ) : (
          <div className="card-grid">
            {pendingBookings.map((booking) => (
              <div className="card" key={booking._id}>
                <h3>{booking.pg?.title}</h3>
                <p><strong>User:</strong> {booking.user?.name}</p>
                <p><strong>Email:</strong> {booking.user?.email}</p>
                <p><strong>City:</strong> {booking.pg?.city}</p>
                <p><strong>Location:</strong> {booking.pg?.location}</p>
                <p><strong>Quantity:</strong> {booking.quantity}</p>
                <p><strong>Duration:</strong> {booking.duration} months</p>
                <p>
                  <strong>Check-In:</strong>{" "}
                  {new Date(booking.checkInDate).toLocaleDateString()}
                </p>
                <p><strong>Status:</strong> {booking.status}</p>

                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  <button
                    className="btn"
                    onClick={() => updateStatus(booking._id, "confirmed")}
                  >
                    Confirm
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={() => updateStatus(booking._id, "rejected")}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="section-space">
        <h3 style={{ marginBottom: "15px" }}>Processed Requests</h3>

        {processedBookings.length === 0 ? (
          <div className="detail-box empty-state">
            <h3>No processed requests yet</h3>
          </div>
        ) : (
          <div className="card-grid">
            {processedBookings.map((booking) => (
              <div className="card" key={booking._id}>
                <h3>{booking.pg?.title}</h3>
                <p><strong>User:</strong> {booking.user?.name}</p>
                <p><strong>Email:</strong> {booking.user?.email}</p>
                <p><strong>Quantity:</strong> {booking.quantity}</p>
                <p><strong>Status:</strong> {booking.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OwnerBookings;