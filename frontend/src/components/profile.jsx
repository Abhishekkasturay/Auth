import React, { useState, useEffect } from "react";
import Layout from "./layout";
import { Container, Button } from "react-bootstrap";
import axios from "axios";

function Profile() {
  const [user, setUser] = useState({ name: "", email: "" });
  console.log(user);

  useEffect(() => {
    axios
      .get("https://auth-sorq.onrender.com/api/auth/profile", { withCredentials: true })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  return (
    <Layout>
      <Container className="d-flex flex-column align-items-center justify-content-center vh-100">
        <div
          className="shadow-lg p-4 text-center bg-white rounded"
          style={{
            width: "100%",
            maxWidth: "400px",
            color: "black", // ✅ Ensure text is visible
            backgroundColor: "white", // ✅ Maintain contrast
          }}
        >
          <h2 className="mb-4">Profile</h2>
          <h4>{user.name || "User"}</h4>
          <p className="text-muted">{user.email || "user@example.com"}</p>
          <Button href="/auth/login" variant="danger" className="w-100 mt-3">
            Logout
          </Button>
        </div>
      </Container>
    </Layout>
  );
}

export default Profile;
