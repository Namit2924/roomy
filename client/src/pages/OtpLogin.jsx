import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../firebase";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

function OtpLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "normal",
        callback: () => {
          setMessage("reCAPTCHA verified");
        },
      });
    }
  };

  const handleSendOtp = async () => {
    if (!phone) {
      setMessage("Please enter phone number");
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

  const handleVerifyOtp = async () => {
    if (!confirmationResult || !otp) {
      setMessage("Please enter OTP");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const result = await confirmationResult.confirm(otp);
      const firebaseUser = result.user;

      // optional backend sync by phone
      const res = await API.post("/auth/firebase-phone-login", {
        phone: firebaseUser.phoneNumber,
      });

      login(res.data.user, res.data.token);
      setMessage("Login successful");
      navigate("/");
    } catch (error) {
      setMessage(error.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container auth-page">
      <div className="form-container">
        <h2>Login with OTP</h2>

        <div className="form-group">
          <label>Phone Number</label>
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
              <label>Enter OTP</label>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={loading}
              />
            </div>

            <button className="btn" onClick={handleVerifyOtp} disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        <div id="recaptcha-container" style={{ marginTop: "16px" }}></div>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default OtpLogin;