import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import secureIcon from "../assets/secure-icon.png"; // ✅ Import image
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (formData.password !== formData.password2) {
      setMessage("Passwords do not match!");
      return;
    }

    console.log("📌 Register button clicked! Sending request...");

    try {
      const response = await axios.post(
        "https://auth-sorq.onrender.com/api/auth/register",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("✅ API Response:", response);

      if (response.status === 201) {
        navigate("/auth/login");
      } else {
        setMessage(response.data.msg || "Registration failed");
      }
    } catch (error) {
      setMessage(
        "Server error: " + (error.response?.data?.msg || error.message)
      );
    }
  };

  return (
    <div className="container vh-100 d-flex align-items-center justify-content-center">
      <div className="row w-100 justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow p-4">
            <div className="text-center">
              <img src={secureIcon} alt="icon" width="100" className="mb-3" />
              <h2>Register New User</h2>
            </div>
            {message && <div className="alert alert-danger">{message}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-3">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  placeholder="Enter Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-control"
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="password2">Confirm Password</label>
                <input
                  type="password"
                  id="password2"
                  name="password2"
                  className="form-control"
                  placeholder="Confirm Password"
                  value={formData.password2}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Register
              </button>
            </form>
            <p className="mt-3 text-center">
              Already have an account? <Link to="/auth/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
