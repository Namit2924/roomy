import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Wishlist() {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchWishlist = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const res = await API.get("/wishlist");
      setWishlist(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  const handleRemove = async (pgId) => {
    try {
      const res = await API.delete(`/wishlist/${pgId}`);
      setMessage(res.data.message);
      fetchWishlist();
    } catch (error) {
      setMessage(error.response?.data?.message || "Remove failed");
    }
  };

  if (!user) {
    return (
      <div className="container">
        <h2 className="page-title">Please login to view wishlist</h2>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container">
        <h2 className="page-title">Loading wishlist...</h2>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="page-title">My Wishlist</h2>

      {message && <p className="success-message">{message}</p>}

      {wishlist.length === 0 ? (
        <div className="detail-box empty-state">
          <h3>No saved PGs</h3>
          <p>Add some PGs to wishlist and view them here later.</p>
        </div>
      ) : (
        <div className="card-grid">
          {wishlist.map((item) => (
            <div className="card" key={item._id}>
              <img
                src={
                  item.pg?.images && item.pg.images.length > 0
                    ? item.pg.images[0]
                    : "https://dummyimage.com/400x220/e2e8f0/334155&text=No+Image"
                }
                alt={item.pg?.title}
                className="pg-card-image"
                onError={(e) => {
                  e.target.src =
                    "https://dummyimage.com/400x220/e2e8f0/334155&text=Image+Not+Available";
                }}
              />

              <h3>{item.pg?.title}</h3>
              <p><strong>City:</strong> {item.pg?.city}</p>
              <p><strong>Location:</strong> {item.pg?.location}</p>
              <p><strong>Price:</strong> ₹{item.pg?.price}</p>
              <p><strong>Gender:</strong> {item.pg?.gender}</p>
              <p><strong>Available Rooms:</strong> {item.pg?.availableRooms}</p>

              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <Link to={`/pg/${item.pg?._id}`}>
                  <button className="btn">View</button>
                </Link>

                <button
                  className="btn btn-danger"
                  onClick={() => handleRemove(item.pg?._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;