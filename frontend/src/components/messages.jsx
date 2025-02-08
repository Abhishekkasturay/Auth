import React from "react";
function Messages({ errors, success_msg, error_msg }) {
  return (
    <div>
      {errors &&
        errors.map((error, index) => (
          <div
            key="{index}"
            className="alert alert-warning alert-dismissible fade show"
            role="alert"
          >
            {error.msg}
            <button
              type="button"
              className="close"
              data-dismiss="alert"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        ))}
      {success_msg && (
        <div
          className="alert alert-success alert-dismissible fade show"
          role="alert"
        >
          {success_msg}
        </div>
      )}{" "}
      {error_msg && (
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          {error_msg}
        </div>
      )}
    </div>
  );
}
export default Messages;
