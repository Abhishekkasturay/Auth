import React from "react";

function Layout({ children }) {
  return (
    <div className="container-fluid bg-black text-white min-vh-100 d-flex align-items-center justify-content-center">
      {children}
    </div>
  );
}

export default Layout;
