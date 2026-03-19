import { useEffect, useState } from "react";
import API from "../services/api";

function OwnerAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const res = await API.get("/bookings/owner/analytics");
      setAnalytics(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <h2 className="page-title">Loading analytics...</h2>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="container">
        <h2 className="page-title">Analytics not available</h2>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="page-title">Owner Analytics Dashboard</h2>

      <div className="card-grid">
        <div className="card">
          <h3>Total PGs</h3>
          <p>{analytics.totalPgs}</p>
        </div>

        <div className="card">
          <h3>Total Bookings</h3>
          <p>{analytics.totalBookings}</p>
        </div>

        <div className="card">
          <h3>Pending Bookings</h3>
          <p>{analytics.pendingBookings}</p>
        </div>

        <div className="card">
          <h3>Confirmed Bookings</h3>
          <p>{analytics.confirmedBookings}</p>
        </div>

        <div className="card">
          <h3>Rejected Bookings</h3>
          <p>{analytics.rejectedBookings}</p>
        </div>

        <div className="card">
          <h3>Available Rooms</h3>
          <p>{analytics.totalAvailableRooms}</p>
        </div>

        <div className="card">
          <h3>Booked Rooms</h3>
          <p>{analytics.totalBookedRooms}</p>
        </div>
      </div>
    </div>
  );
}

export default OwnerAnalytics;