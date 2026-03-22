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
  
  const [chatText, setChatText] = useState("");
const [chatMessage, setChatMessage] = useState("");
const [chatLoading, setChatLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  const [wishlistMessage, setWishlistMessage] = useState("");
  const [wishlistMessageType, setWishlistMessageType] = useState("");
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  });
  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

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

  const fetchReviews = async () => {
    try {
      const res = await API.get(`/reviews/${id}`);
      setReviews(res.data.reviews);
      setAverageRating(res.data.averageRating);
      setTotalReviews(res.data.totalReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    fetchPg();
    fetchReviews();
  }, [id]);

  const handleChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value,
    });
  };

  const handleReviewChange = (e) => {
    setReviewForm({
      ...reviewForm,
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

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setReviewMessage("Please login first to add a review");
      return;
    }

    try {
      setReviewLoading(true);
      setReviewMessage("");

      const res = await API.post("/reviews", {
        pgId: id,
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment,
      });

      setReviewMessage(res.data.message);
      setReviewForm({
        rating: 5,
        comment: "",
      });

      fetchReviews();
    } catch (error) {
      setReviewMessage(
        error.response?.data?.message || "Failed to add review"
      );
    } finally {
      setReviewLoading(false);
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

  const handleStartChat = async () => {
  if (!user) {
    setChatMessage("Please login first to contact owner");
    return;
  }

  if (!chatText.trim()) {
    setChatMessage("Please write a message first");
    return;
  }

  try {
    setChatLoading(true);
    const res = await API.post("/chat/start", {
      pgId: id,
      text: chatText,
    });

    setChatMessage(res.data.message);
    setChatText("");
  } catch (error) {
    setChatMessage(error.response?.data?.message || "Failed to send message");
  } finally {
    setChatLoading(false);
  }
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

  const fullLocation = `${pg.location || ""}, ${pg.area || ""}, ${pg.city || ""}`;

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
        <p>
          <strong>Location:</strong>{" "}
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullLocation)}`}
            target="_blank"
            rel="noreferrer"
            style={{ color: "#2563eb" }}
          >
            {pg.location}
          </a>
        </p>
        <p><strong>Price:</strong> ₹{pg.price}</p>
        <p><strong>Gender:</strong> {pg.gender}</p>
        <p><strong>Available Rooms:</strong> {pg.availableRooms}</p>
        <p>
          <strong>Rating:</strong> ⭐ {averageRating} ({totalReviews} review
          {totalReviews !== 1 ? "s" : ""})
        </p>

        <div className="section-space">
          <h3>Location on Map</h3>

          <iframe
            title="PG Location"
            width="100%"
            height="300"
            style={{ border: 0, borderRadius: "12px" }}
            loading="lazy"
            allowFullScreen
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              fullLocation
            )}&output=embed`}
          ></iframe>

          <div style={{ marginTop: "10px" }}>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                fullLocation
              )}`}
              target="_blank"
              rel="noreferrer"
            >
              <button className="btn">Open in Google Maps</button>
            </a>
          </div>
        </div>

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
  <h3>Chat with Owner</h3>

  <div className="form-group">
    <textarea
      placeholder="Ask about rent, location, food, rules..."
      value={chatText}
      onChange={(e) => setChatText(e.target.value)}
    />
  </div>

  <button
    className="btn"
    onClick={handleStartChat}
    disabled={chatLoading}
  >
    {chatLoading ? "Sending..." : "Send Message"}
  </button>

  {chatMessage && <p className="message">{chatMessage}</p>}
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

        <div className="section-space">
          <h3>Write a Review</h3>

          <form onSubmit={handleReviewSubmit}>
            <div className="form-group">
              <label>Rating</label>
              <select
                name="rating"
                value={reviewForm.rating}
                onChange={handleReviewChange}
              >
                <option value={5}>5 - Excellent</option>
                <option value={4}>4 - Very Good</option>
                <option value={3}>3 - Good</option>
                <option value={2}>2 - Average</option>
                <option value={1}>1 - Poor</option>
              </select>
            </div>

            <div className="form-group">
              <label>Comment</label>
              <textarea
                name="comment"
                placeholder="Write your review"
                value={reviewForm.comment}
                onChange={handleReviewChange}
              />
            </div>

            <button className="btn" type="submit" disabled={reviewLoading}>
              {reviewLoading ? "Submitting..." : "Submit Review"}
            </button>
          </form>

          {reviewMessage && <p className="message">{reviewMessage}</p>}
        </div>

        <div className="section-space">
          <h3>User Reviews</h3>

          {reviews.length === 0 ? (
            <div className="detail-box empty-state">
              <p>No reviews yet.</p>
            </div>
          ) : (
            <div className="review-list">
              {reviews.map((review) => (
                <div className="review-card" key={review._id}>
                  <div className="review-header">
                    <img
                      src={
                        review.user?.photo && review.user.photo.trim() !== ""
                          ? review.user.photo
                          : "https://dummyimage.com/50x50/e2e8f0/334155&text=U"
                      }
                      alt={review.user?.name || "User"}
                      className="review-user-image"
                    />
                    <div>
                      <h4>{review.user?.name || "User"}</h4>
                      <p>⭐ {review.rating}</p>
                    </div>
                  </div>
                  <p>{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PgDetails;