import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/dash";
import ForgotPassword from "./components/forgot";
import ResetPassword from "./components/reset";
import Login from "./components/login";
import Register from "./components/register";
import Welcome from "./components/welcome";
import Profile from "./components/profile";

function App() {
  // State to store user data

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/dashboard" element={<Dashboard />} />{" "}
        {/* ✅ Pass user name dynamically */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/forgot" element={<ForgotPassword />} />
        <Route path="/auth/reset" element={<ResetPassword />} />
        <Route path="/auth/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
