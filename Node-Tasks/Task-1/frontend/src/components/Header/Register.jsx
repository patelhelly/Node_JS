import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./signin_register.scss";

function Register() {
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    file: null,
  });

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", values.username);
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("file", values.file);
    axios
      .post("http://localhost:8080/register", formData, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.status === "Success") {
          navigate("/sign-in");
        } else {
          alert("Error in Register new user!");
        }
      })
      .catch((error) => {
        console.error(error.response.data); // Log the error response data
        alert(error.response.data.error); // Display the error message
      });
  };

  return (
    <>
      <div className="signincontainer">
        <form onSubmit={handleSubmit}>
          <h3 className=" d-flex align-items-center justify-content-center">
            Sign Up
          </h3>
          <div className="mb-3">
            <label>Name</label>
            <input
              type="text"
              name="username"
              className="form-control"
              placeholder="First name"
              onChange={(e) =>
                setValues({ ...values, username: e.target.value })
              }
              autoComplete="off"
            />
          </div>
          <div className="mb-3">
            <label>Email address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter email"
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              autoComplete="off"
            />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter password"
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
              autoComplete="off"
            />
          </div>
          <div className="mb-3">
            <label>Profile</label>
            <input
              type="file"
              name="file"
              className="form-control"
              placeholder="Choose File"
              onChange={(e) =>
                setValues({ ...values, file: e.target.files[0] })
              }
            />
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Sign Up
            </button>
          </div>
          <p className="forgot-password text-right">
            Already registered <a href="/sign-in">Sign In?</a>
          </p>
        </form>
      </div>
    </>
  );
}

export default Register;
