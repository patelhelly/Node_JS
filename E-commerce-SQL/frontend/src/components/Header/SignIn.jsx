import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./signin_register.scss";
import Layout from "../Layout/Layout";
import { useAuth } from "../../context/auth.jsx";
import { useCart } from "../../context/cart.jsx";

function SignIn() {
  const [cart, setCart] = useCart();
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [auth, setAuth] = useAuth();

  const location = useLocation();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/sign-in", values, {
        withCredentials: true,
      });
      if (res.data.status === "Success") {
        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token,
        });
        localStorage.setItem("auth", JSON.stringify(res.data));
        // Get the cart item count after sign in
        const cartData = await axios.post(
          "http://localhost:8080/cart/cart-product",
          { userId: res.data.user.id }
        );
        if (cartData.data.success) {
          setCart(cartData.data.result);
          localStorage.setItem("cart", JSON.stringify(cartData.data.result));
        } else {
          console.log(cart);
          console.log("Failed to get cart item count:", cartData.data.err);
        }

        navigate(location.state || "/");
      } else {
        alert(res.data.Error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Layout title={"LogIn - StyleHub"}>
        <div className="signincontainer">
          <form onSubmit={handleSubmit}>
            <h3 className=" d-flex align-items-center justify-content-center">
              Sign In
            </h3>
            <div className="mb-3">
              <label>Email address</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Enter Email"
                onChange={(e) =>
                  setValues({ ...values, email: e.target.value })
                }
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
              <div className="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="customCheck1"
                />
                <label className="custom-control-label" htmlFor="customCheck1">
                  Remember me
                </label>
              </div>
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
            <p className="forgot-password text-right">
              Forgot <a href="#">password?</a>
            </p>
          </form>
        </div>
      </Layout>
    </>
  );
}

export default SignIn;
