import { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

function OwnerDashboard() {
  const { user } = useAuth();

  const initialForm = {
    title: "",
    description: "",
    location: "",
    city: "",
    area: "",
    price: "",
    gender: "unisex",
    facilities: "",
    images: "",
    availableRooms: "",
  };

  const [formData, setFormData] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [ownerPgs, setOwnerPgs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);

  if (!user) {
    return (
      <div className="container">
        <h2 className="page-title">Please login first</h2>
      </div>
    );
  }

  if (user.role !== "owner") {
    return (
      <div className="container">
        <h2 className="page-title">Only owners can access this page</h2>
      </div>
    );
  }

  const fetchOwnerPgs = async () => {
    try {
      const res = await API.get("/pgs/owner/my-pgs");
      setOwnerPgs(res.data);
    } catch (error) {
      console.error("Error fetching owner PGs:", error);
    }
  };

  useEffect(() => {
    fetchOwnerPgs();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const buildPayload = () => {
    return {
      ...formData,
      price: Number(formData.price),
      availableRooms: Number(formData.availableRooms),
      facilities: formData.facilities
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item),
      images: formData.images
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item),
    };
  };

  const handleImageUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      setMessage("Please select image files first");
      setMessageType("error");
      return;
    }

    if (selectedFiles.length > 20) {
      setMessage("You can upload maximum 20 images");
      setMessageType("error");
      return;
    }

    try {
      setUploadLoading(true);
      setMessage("");

      const data = new FormData();

      for (let i = 0; i < selectedFiles.length; i++) {
        data.append("images", selectedFiles[i]);
      }

      const res = await API.post("/upload/pg", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const newUrls = res.data.imageUrls;

      setUploadedImageUrls((prev) => [...prev, ...newUrls]);

      setFormData((prev) => ({
        ...prev,
        images: prev.images
          ? `${prev.images}, ${newUrls.join(", ")}`
          : newUrls.join(", "),
      }));

      setMessage("Images uploaded successfully");
      setMessageType("success");
      setSelectedFiles([]);
    } catch (error) {
      setMessage(error.response?.data?.message || "Image upload failed");
      setMessageType("error");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setMessage("");

    try {
      const payload = buildPayload();

      if (editingId) {
        const res = await API.put(`/pgs/${editingId}`, payload);
        setMessage(res.data.message);
      } else {
        const res = await API.post("/pgs", payload);
        setMessage(res.data.message);
      }

      setMessageType("success");
      setFormData(initialForm);
      setEditingId(null);
      setUploadedImageUrls([]);
      setSelectedFiles([]);
      await fetchOwnerPgs();
    } catch (error) {
      setMessage(error.response?.data?.message || "Action failed");
      setMessageType("error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (pg) => {
    setEditingId(pg._id);
    setFormData({
      title: pg.title || "",
      description: pg.description || "",
      location: pg.location || "",
      city: pg.city || "",
      area: pg.area || "",
      price: pg.price || "",
      gender: pg.gender || "unisex",
      facilities: pg.facilities?.join(", ") || "",
      images: pg.images?.join(", ") || "",
      availableRooms: pg.availableRooms || "",
    });
    setUploadedImageUrls(pg.images || []);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    try {
      setDeleteLoadingId(id);
      const res = await API.delete(`/pgs/${id}`);
      setMessage(res.data.message);
      setMessageType("success");
      await fetchOwnerPgs();
    } catch (error) {
      setMessage(error.response?.data?.message || "Delete failed");
      setMessageType("error");
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(initialForm);
    setUploadedImageUrls([]);
    setSelectedFiles([]);
    setMessage("");
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>Owner Dashboard</h2>
        <h3>{editingId ? "Edit PG" : "Add New PG"}</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="title"
              placeholder="PG title"
              value={formData.title}
              onChange={handleChange}
              disabled={formLoading}
            />
          </div>

          <div className="form-group">
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              disabled={formLoading}
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              disabled={formLoading}
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              disabled={formLoading}
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="area"
              placeholder="Area / Locality"
              value={formData.area}
              onChange={handleChange}
              disabled={formLoading}
            />
          </div>

          <div className="form-group">
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              disabled={formLoading}
            />
          </div>

          <div className="form-group">
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              disabled={formLoading}
            >
              <option value="boys">Boys</option>
              <option value="girls">Girls</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>

          <div className="form-group">
            <input
              type="text"
              name="facilities"
              placeholder="Facilities separated by commas"
              value={formData.facilities}
              onChange={handleChange}
              disabled={formLoading}
            />
          </div>

          <div className="form-group">
            <label>Upload PG Images (max 20)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
              disabled={uploadLoading || formLoading}
            />
          </div>

          <button
            type="button"
            className="btn"
            onClick={handleImageUpload}
            disabled={uploadLoading || formLoading}
          >
            {uploadLoading ? "Uploading..." : "Upload Images"}
          </button>

          <div className="form-group" style={{ marginTop: "16px" }}>
            <input
              type="text"
              name="images"
              placeholder="Uploaded image URLs will appear here"
              value={formData.images}
              onChange={handleChange}
              disabled={formLoading}
            />
          </div>

          {uploadedImageUrls.length > 0 && (
            <div className="multi-preview-grid" style={{ marginBottom: "16px" }}>
              {uploadedImageUrls.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Uploaded preview ${index + 1}`}
                  className="multi-preview-image"
                />
              ))}
            </div>
          )}

          <div className="form-group">
            <input
              type="number"
              name="availableRooms"
              placeholder="Available rooms"
              value={formData.availableRooms}
              onChange={handleChange}
              disabled={formLoading}
            />
          </div>

          <button className="btn" type="submit" disabled={formLoading}>
            {formLoading ? "Saving..." : editingId ? "Update PG" : "Add PG"}
          </button>

          {editingId && (
            <button
              type="button"
              className="btn btn-secondary"
              style={{ marginLeft: "10px" }}
              onClick={handleCancelEdit}
              disabled={formLoading}
            >
              Cancel
            </button>
          )}
        </form>

        {message && (
          <p className={messageType === "error" ? "error-message" : "success-message"}>
            {message}
          </p>
        )}
      </div>

      <div className="section-space">
        <h2 className="page-title">My PG Listings</h2>

        {ownerPgs.length === 0 ? (
          <div className="detail-box">
            <p>You have not added any PG yet.</p>
          </div>
        ) : (
          <div className="card-grid">
            {ownerPgs.map((pg) => (
              <div className="card" key={pg._id}>
                <img
                  src={
                    pg.images && pg.images.length > 0
                      ? pg.images[0]
                      : "https://dummyimage.com/400x220/e2e8f0/334155&text=No+Image"
                  }
                  alt={pg.title}
                  className="pg-card-image"
                  onError={(e) => {
                    e.target.src =
                      "https://dummyimage.com/400x220/e2e8f0/334155&text=Image+Not+Available";
                  }}
                />

                <h3>{pg.title}</h3>
                <p><strong>City:</strong> {pg.city}</p>
                <p><strong>Area:</strong> {pg.area || "Not specified"}</p>
                <p><strong>Location:</strong> {pg.location}</p>
                <p><strong>Price:</strong> ₹{pg.price}</p>
                <p><strong>Available Rooms:</strong> {pg.availableRooms}</p>

                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  <button className="btn" onClick={() => handleEdit(pg)}>
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(pg._id)}
                    disabled={deleteLoadingId === pg._id}
                  >
                    {deleteLoadingId === pg._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OwnerDashboard;