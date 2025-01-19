import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./signin_register.scss";
import Layout from "../Layout/Layout";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register() {
  const [values, setValues] = useState({
    username: "",
    email: "",
    phone: "",
    file: null,
    password: "",
    role: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", values.username);
    formData.append("email", values.email);
    formData.append("phone", values.phone);
    formData.append("file", values.file);
    formData.append("password", values.password);
    formData.append("role", values.role);

    await axios
      .post(`http://localhost:8080/register`, formData, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.status === "Success") {
          toast.success("Registered Successfully!");
          setTimeout(() => {
            navigate("/sign-in");
          }, 5000);
        } else {
          toast.error("Failed to Registered!");
        }
      })
      .catch((error) => {
        console.error(error.response.data); // Log the error response data
        toast.error("Failed to Registered!"); // Display the error message
      });
  };

  return (
    <>
      <Layout title={"Register - StyleHub"}>
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
              <label>Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Enter email"
                onChange={(e) =>
                  setValues({ ...values, email: e.target.value })
                }
                autoComplete="off"
              />
            </div>
            <div className="mb-3">
              <label>Phone</label>
              <input
                type="number"
                name="phone"
                className="form-control"
                placeholder="Enter Phone No."
                onChange={(e) =>
                  setValues({ ...values, phone: e.target.value })
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
              <label>Role</label>
              <select
                name="role"
                className="form-select"
                defaultValue=""
                onChange={(e) => setValues({ ...values, role: e.target.value })}
              >
                <option value="" disabled>
                  Choose...
                </option>
                <option value="0">User</option>
                <option value="1">Admin</option>
              </select>
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
      </Layout>
    </>
  );
}

export default Register;
