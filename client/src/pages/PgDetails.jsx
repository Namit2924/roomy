import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

function PgDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [pg, setPg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [bookingData, setBookingData] = useState({
    checkInDate: "",
    duration: "",
    quantity: 1,
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  const [wishlistMessage, setWishlistMessage] = useState("");
  const [wishlistMessageType, setWishlistMessageType] = useState("");
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const fetchPg = async () => {
    try {
      const res = await API.get(`/pgs/${id}`);
      setPg(res.data);
      setLoading(false);
      setCurrentImageIndex(0);
    } catch (error) {
      console.error("Error fetching PG:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPg();
  }, [id]);

  const handleChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBooking = async () => {
    if (!user) {
      setMessage("Please login first to book a PG");
      setMessageType("error");
      return;
    }

    if (
      !bookingData.checkInDate ||
      !bookingData.duration ||
      !bookingData.quantity
    ) {
      setMessage("Please fill check-in date, duration, and quantity");
      setMessageType("error");
      return;
    }

    try {
      setBookingLoading(true);

      const res = await API.post("/bookings", {
        pg: id,
        checkInDate: bookingData.checkInDate,
        duration: Number(bookingData.duration),
        quantity: Number(bookingData.quantity),
      });

      setMessage(
        `${res.data.message}${
          res.data.updatedAvailableRooms !== undefined
            ? `. Remaining rooms: ${res.data.updatedAvailableRooms}`
            : ""
        }`
      );
      setMessageType("success");

      setBookingData({
        checkInDate: "",
        duration: "",
        quantity: 1,
      });

      fetchPg();
    } catch (error) {
      setMessage(error.response?.data?.message || "Booking failed");
      setMessageType("error");
    } finally {
      setBookingLoading(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!user) {
      setWishlistMessage("Please login first to save this PG");
      setWishlistMessageType("error");
      return;
    }

    try {
      setWishlistLoading(true);
      const res = await API.post("/wishlist", { pgId: id });
      setWishlistMessage(res.data.message);
      setWishlistMessageType("success");
    } catch (error) {
      setWishlistMessage(
        error.response?.data?.message || "Failed to add to wishlist"
      );
      setWishlistMessageType("error");
    } finally {
      setWishlistLoading(false);
    }
  };

  const nextImage = () => {
    if (!pg?.images?.length) return;
    setCurrentImageIndex((prev) => (prev + 1) % pg.images.length);
  };

  const prevImage = () => {
    if (!pg?.images?.length) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? pg.images.length - 1 : prev - 1
    );
  };

  if (loading) {
    return (
      <div className="container">
        <h2 className="page-title">Loading PG details...</h2>
      </div>
    );
  }

  if (!pg) {
    return (
      <div className="container">
        <h2 className="page-title">PG not found</h2>
      </div>
    );
  }

  const hasImages = pg.images && pg.images.length > 0;
  const currentImage = hasImages
    ? pg.images[currentImageIndex]
    : "https://dummyimage.com/800x400/e2e8f0/334155&text=No+Image";

  return (
    <div className="container">
      <div className="detail-box">
        <div className="gallery-wrapper">
  <img
    src={currentImage}
    alt={pg.title}
    className="pg-detail-image"
    onError={(e) => {
      e.target.src =
        "https://dummyimage.com/800x400/e2e8f0/334155&text=Image+Not+Available";
    }}
  />

  {hasImages && pg.images.length > 1 && (
    <>
      <div className="gallery-controls">
        <button className="btn btn-secondary" onClick={prevImage}>
          Prev
        </button>
        <span className="gallery-counter">
          {currentImageIndex + 1} / {pg.images.length}
        </span>
        <button className="btn btn-secondary" onClick={nextImage}>
          Next
        </button>
      </div>

      <div className="thumbnail-row">
        {pg.images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Thumbnail ${index + 1}`}
            className={`thumbnail-image ${
              currentImageIndex === index ? "active-thumbnail" : ""
            }`}
            onClick={() => setCurrentImageIndex(index)}
          />
        ))}
      </div>
    </>
  )}
</div>

        <h2 className="page-title">{pg.title}</h2>

        <p><strong>Description:</strong> {pg.description}</p>
        <p><strong>City:</strong> {pg.city}</p>
        <p><strong>Area:</strong> {pg.area || "Not specified"}</p>
        <p><strong>Location:</strong> {pg.location}</p>
        <p><strong>Price:</strong> ₹{pg.price}</p>
        <p><strong>Gender:</strong> {pg.gender}</p>
        <p><strong>Available Rooms:</strong> {pg.availableRooms}</p>

        <div className="section-space">
          <h3>Facilities</h3>
          <ul className="facility-list">
            {pg.facilities.map((facility, index) => (
              <li key={index}>{facility}</li>
            ))}
          </ul>
        </div>

        <div className="section-space owner-contact-box">
          <h3>Owner Contact Details</h3>

          <div className="owner-contact-card">
            <img
              src={
                pg.owner?.photo && pg.owner.photo.trim() !== ""
                  ? pg.owner.photo
                  : "https://dummyimage.com/80x80/e2e8f0/334155&text=O"
              }
              alt={pg.owner?.name || "Owner"}
              className="owner-contact-image"
              onError={(e) => {
                e.target.src =
                  "https://dummyimage.com/80x80/e2e8f0/334155&text=O";
              }}
            />

            <div className="owner-contact-info">
              <p><strong>Name:</strong> {pg.owner?.name || "Not available"}</p>
              <p><strong>Email:</strong> {pg.owner?.email || "Not available"}</p>
              <p><strong>Phone:</strong> {pg.owner?.phone || "Not available"}</p>

              <div className="owner-contact-actions">
                {pg.owner?.phone && (
                  <a href={`tel:${pg.owner.phone}`} className="btn">
                    Call Owner
                  </a>
                )}

                {pg.owner?.email && (
                  <a
                    href={`mailto:${pg.owner.email}`}
                    className="btn btn-secondary"
                  >
                    Email Owner
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="section-space">
          <h3>Book This PG</h3>

          <div className="form-group">
            <input
              type="date"
              name="checkInDate"
              value={bookingData.checkInDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <input
              type="number"
              name="duration"
              placeholder="Duration in months"
              min="1"
              value={bookingData.duration}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <input
              type="number"
              name="quantity"
              placeholder="Number of rooms/beds"
              min="1"
              value={bookingData.quantity}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              className="btn btn-secondary"
              onClick={handleAddToWishlist}
              disabled={wishlistLoading}
            >
              {wishlistLoading ? "Saving..." : "Save to Wishlist"}
            </button>

            <button
              className="btn"
              onClick={handleBooking}
              disabled={bookingLoading}
            >
              {bookingLoading ? "Booking..." : "Confirm Booking"}
            </button>
          </div>

          {wishlistMessage && (
            <p
              className={
                wishlistMessageType === "error"
                  ? "error-message"
                  : "success-message"
              }
            >
              {wishlistMessage}
            </p>
          )}

          {message && (
            <p
              className={
                messageType === "error" ? "error-message" : "success-message"
              }
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PgDetails;