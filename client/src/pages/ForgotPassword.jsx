// import { useState } from "react";
// import API from "../services/api";

// function ForgotPassword() {
//   const [formData, setFormData] = useState({
//     email: "",
//     newPassword: "",
//   });

//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("");

//     try {
//       const res = await API.post("/auth/forgot-password", formData);
//       setMessage(res.data.message);

//       setFormData({
//         email: "",
//         newPassword: "",
//       });
//     } catch (error) {
//       setMessage(error.response?.data?.message || "Password reset failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container auth-page">
//       <div className="form-container">
//         <h2>Forgot Password</h2>

//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <input
//               type="email"
//               name="email"
//               placeholder="Enter your email"
//               value={formData.email}
//               onChange={handleChange}
//               disabled={loading}
//             />
//           </div>

//           <div className="form-group">
//             <input
//               type="password"
//               name="newPassword"
//               placeholder="Enter new password"
//               value={formData.newPassword}
//               onChange={handleChange}
//               disabled={loading}
//             />
//           </div>

//           <button className="btn" type="submit" disabled={loading}>
//             {loading ? "Resetting..." : "Reset Password"}
//           </button>
//         </form>

//         {message && <p className="message">{message}</p>}
//       </div>
//     </div>
//   );
// }

// export default ForgotPassword;
import { useState } from "react";
import API from "../services/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await API.post("/auth/forgot-password", { email });
      setMessage(res.data.message);
      setEmail("");
    } catch (error) {
      setMessage(error.response?.data?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container auth-page">
      <div className="form-container">
        <h2>Forgot Password</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default ForgotPassword;