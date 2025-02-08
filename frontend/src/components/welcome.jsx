import React from "react";
import Layout from "./layout";
import { Link } from "react-router-dom";

function Welcome() {
  return (
    <Layout>
      <div className="row">
        <div className="col-md-6 m-auto">
          <div className="card card-body text-center bg-dark text-white">
            <h1>Welcome</h1>
            <img
              src="/src/assets/secure-icon.png"
              alt="icon"
              className="img-fluid mx-auto d-block"
              style={{ width: "60%" }}
            />
            <p className="mt-3">Login to an existing account or register</p>
            <Link to="/auth/login" className="btn btn-primary btn-block">
              Login
            </Link>
            <Link
              to="/auth/register"
              className="btn btn-secondary btn-block mt-2"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Welcome;
