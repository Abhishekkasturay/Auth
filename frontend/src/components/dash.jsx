import React, { useState, useEffect } from "react";
import { Container, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "./layout";
import axios from "axios";
import secureIcon from "../assets/secure-icon.png"; // ✅ Ensure correct image path

function Dashboard() {
  const [user, setUser] = useState({ name: "", email: "" });
  console.log(user);

useEffect(() => {
  const fetchUserProfile = async () => {
    try {
      // Manually retrieve token from cookies
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      // If token is missing, stop the request
      if (!token) {
        console.error("No token found in cookies.");
        return;
      }

      // Send token in Authorization header
      const response = await axios.get("https://auth-sorq.onrender.com/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  fetchUserProfile();
}, []);
  return (
    <Layout>
      <Container className="vh-100 d-flex align-items-center justify-content-center">
        <Card
          className="shadow-lg p-4 text-center"
          style={{ maxWidth: "400px", width: "100%" }}
        >
          <h1 className="mb-4">Dashboard</h1>
          <p className="lead mb-3">
            Welcome, <strong>{user.name || "User"}</strong>
          </p>

          {/* ✅ Image is centered */}
          <img
            src={secureIcon}
            alt="Secure Icon"
            className="img-fluid mx-auto d-block mb-4"
            width="50%"
          />

          <div className="d-grid gap-3">
            <Link to="/auth/profile">
              <Button variant="primary" className="w-100">
                Profile
              </Button>
            </Link>
            <Link to="/auth/login">
              <Button variant="danger" className="w-100">
                Logout
              </Button>
            </Link>
          </div>
        </Card>
      </Container>
    </Layout>
  );
}

export default Dashboard;
