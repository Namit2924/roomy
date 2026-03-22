import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../firebase";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [activeTab, setActiveTab] = useState("email");
  const [showPassword, setShowPassword] = useState(false) 
  // Email login
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // OTP login
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Email login change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Email login submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/auth/login", formData);
      login(res.data.user, res.data.token);
      setMessage("Login successful");
      navigate("/");
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Setup reCAPTCHA
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "normal",
        }
      );
    }
  };

  // Send OTP
  const handleSendOtp = async () => {
    if (!phone) {
      setMessage("Enter phone number");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      setupRecaptcha();

      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, phone, appVerifier);

      setConfirmationResult(result);
      setMessage("OTP sent successfully");
    } catch (error) {
      setMessage(error.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp) {
      setMessage("Enter OTP");
      return;
    }

    try {
      setLoading(true);

      const result = await confirmationResult.confirm(otp);

      const res = await API.post("/auth/firebase-phone-login", {
        phone: result.user.phoneNumber,
      });

      login(res.data.user, res.data.token);
      setMessage("Login successful");
      navigate("/");
    } catch (error) {
      setMessage(error.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container auth-page">
      <div className="form-container">
        <h2>Login</h2>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <button
            className={`btn ${activeTab === "email" ? "" : "btn-secondary"}`}
            onClick={() => setActiveTab("email")}
          >
            Email Login
          </button>

          <button
            className={`btn ${activeTab === "otp" ? "" : "btn-secondary"}`}
            onClick={() => setActiveTab("otp")}
          >
            OTP Login
          </button>
        </div>

        {/* EMAIL LOGIN */}
        {activeTab === "email" && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                autoComplete="email"
              />
            </div>

           <div className="password-input-wrapper">
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    placeholder="Enter password"
    value={formData.password}
    onChange={handleChange}
    disabled={loading}
    autoComplete="current-password"
  />
  <span
    className="password-toggle-icon"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? <FaEyeSlash /> : <FaEye />}
  </span>
</div>

            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        )}

        {/* OTP LOGIN */}
        {activeTab === "otp" && (
          <>
            <div className="form-group">
              <input
                type="text"
                placeholder="+919876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading}
              />
            </div>

            <button className="btn" onClick={handleSendOtp} disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>

            {confirmationResult && (
              <>
                <div className="form-group" style={{ marginTop: "16px" }}>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <button
                  className="btn"
                  onClick={handleVerifyOtp}
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </>
            )}

            <div id="recaptcha-container" style={{ marginTop: "15px" }}></div>
          </>
        )}

        {message && <p className="error-message">{message}</p>}

        <p style={{ marginTop: "14px" }}>
  <Link to="/forgot-password" style={{ color: "#2563eb", fontWeight: "600" }}>
    Forgot Password?
  </Link>
</p>
      </div>
      
    </div>
  );
}

export default Login;