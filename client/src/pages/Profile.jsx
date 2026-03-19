import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

function Profile() {
  const { user, login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    photo: "",
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "",
        photo: user.photo || "",
      });
      setPreview(user.photo || "");
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      let updatedPhotoUrl = formData.photo;

      if (file) {
        const uploadData = new FormData();
        uploadData.append("image", file);

        const uploadRes = await API.post("/upload/profile", uploadData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        updatedPhotoUrl = uploadRes.data.imageUrl;
      }

      const res = await API.put("/auth/profile", {
        name: formData.name,
        phone: formData.phone,
        photo: updatedPhotoUrl,
      });

      login(res.data.user, localStorage.getItem("token"));
      setMessage("Profile updated successfully");
    } catch (error) {
      setMessage(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container profile-page">
      <div className="form-container">
        <h2>My Profile</h2>

        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <img
            src={
              preview
                ? preview
                : "https://dummyimage.com/150x150/e2e8f0/334155&text=Profile"
            }
            alt="Profile"
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid #e2e8f0",
            }}
            onError={(e) => {
              e.target.src =
                "https://dummyimage.com/150x150/e2e8f0/334155&text=Profile";
            }}
          />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" value={formData.email} disabled />
          </div>

          <div className="form-group">
            <label>Role</label>
            <input type="text" value={formData.role} disabled />
          </div>

          <div className="form-group">
            <label>Mobile Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Take / Upload Profile Photo</label>
            <input
              type="file"
              accept="image/*"
              capture="user"
              onChange={handleFileChange}
            />
          </div>

          <button className="btn" disabled={loading}>
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default Profile;