import React, { useState } from "react";
import { Form, Button, Card, Container } from "react-bootstrap";
import emailjs from "emailjs-com";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    const templateParams = {
      to_email: email, 
      reset_link: "https://auth-1-emun.onrender.com/auth/reset?email=${email}",
    };

    emailjs
      .send(
        "service_bfq5ubh", 
        "template_knukl5h", 
        templateParams,
        "04wKDri_UyNpvP-Yi" 
      )
      .then(
        (response) => {
          console.log("✅ Email sent successfully:", response);
          setMessage("Password reset email sent! Check your inbox.");
        },
        (error) => {
          console.error("❌ Email sending failed:", error);
          setMessage("Error sending reset email. Try again.");
        }
      );
  };

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center vh-100">
      <Card
        className="shadow-lg p-4 text-center"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <h2 className="mb-4">Forgot Password</h2>
        {message && <div className="alert alert-info">{message}</div>}
        <Form onSubmit={handleSubmit}>
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
          <Button type="submit" variant="primary" className="w-100 py-2">
            Send me a password reset link
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default ForgotPassword;
