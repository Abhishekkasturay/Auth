import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Card, Container } from "react-bootstrap";
import axios from "axios";
import Layout from "./layout";
import Messages from "./messages";
import { API_BASE_URL } from "../config";

function Login() {
  // State variables for email, password, and messages
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post(
        "https://auth-sorq.onrender.com/api/auth/login",
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        navigate("/dashboard"); 
      } else {
        setMessage(response.data.msg || "Invalid credentials");
      }
    } catch (error) {
      setMessage("Server is not responding. Please try again later.");
    }
  };

  return (
    <Layout>
      <Container className="d-flex flex-column align-items-center justify-content-center w-100 vh-100">
        <Card
          className="shadow-lg p-4 text-center"
          style={{ width: "100%", maxWidth: "400px" }}
        >
          <h2 className="mb-4">Login</h2>
          <Messages />
          {/* Display error message if any */}
          {message && <div className="alert alert-danger">{message}</div>}
          <Form onSubmit={handleSubmit}>
            {/* Email Input */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            {/* Password Input */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            {/* Login Button */}
            <Button type="submit" className="w-100 py-2" variant="primary">
              Login
            </Button>
          </Form>
          {/* Navigation Links */}
          <p className="mt-3">
            New User?{" "}
            <Link to="/auth/register" className="fw-bold">
              Register
            </Link>
          </p>
          <p>
            Forgot Password? <Link to="/auth/forgot">Reset</Link>
          </p>
        </Card>
      </Container>
    </Layout>
  );
}

export default Login;
