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
const API_BASE_URL =
  process.env.REACT_APP_API_URL;
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
        `${API_BASE_URL}/api/auth/register`, // Ensure this matches your backend route
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
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="row">
        <div className="col-md-6">
          <div className="card card-body text-center">
            <h1 className="mb-3">
              <img src={secureIcon} alt="icon" width="40%" />
            </h1>
            <h2>Register New User</h2>
            {message && <div className="alert alert-danger">{message}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  placeholder="Enter Name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-control"
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password2">Confirm Password</label>
                <input
                  type="password"
                  id="password2"
                  name="password2"
                  className="form-control"
                  placeholder="Confirm Password"
                  value={formData.password2}
                  onChange={handleChange}
                />
              </div>
              <button type="submit" className="btn btn-primary btn-block">
                Register
              </button>
            </form>
            <p className="mt-4">
              Already have an account? <Link to="/auth/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
