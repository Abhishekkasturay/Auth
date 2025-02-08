import React, { useState } from "react";
import { Form, Button, Card, Container } from "react-bootstrap";
import axios from "axios";
import { useSearchParams } from "react-router-dom"; // ✅ Extract token from URL
import { API_BASE_URL } from "../config";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token"); // ✅ Extract token correctly

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!token) {
      setMessage("Invalid or expired reset link.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/reset`,
        { password },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ Send token in Authorization header
          },
        }
      );

      if (response.status === 200) {
        setMessage("Password reset successful!");
      } else {
        setMessage("Error resetting password.");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      setMessage("Invalid or expired reset link.");
    }
  };

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center vh-100">
      <Card
        className="shadow-lg p-4 text-center"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <h2 className="mb-4">Reset Password</h2>
        {message && <div className="alert alert-info">{message}</div>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button type="submit" variant="primary" className="w-100 py-2">
            Reset Password
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default ResetPassword;
