import { Link, NavLink } from "react-router-dom";
import { GiShoppingBag } from "react-icons/gi";
import { useAuth } from "../../context/auth";
import { toast } from "react-toastify";
import { useCart } from "../../context/cart";
import Badge from "react-bootstrap/Badge";

function HeaderSection() {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();

  // const handleLogout = () => {
  //   axios
  //     .get("http://localhost:8080/logout", { withCredentials: true })
  //     .then(() => {
  //       location.reload(true);
  //     })
  //     .catch((error) => console.error(error));
  // };
  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    setCart("");
    localStorage.removeItem("cart");
    toast.success("Logout Successfully");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarTogglerDemo01"
            aria-controls="navbarTogglerDemo01"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div
            className="collapse navbar-collapse d-flex justify-content-between"
            id="navbarTogglerDemo01"
          >
            <div className="navbar-brand ">
              <Link to="/" style={{ color: "black" }}>
                <GiShoppingBag />
              </Link>
            </div>
            <div className=" navbar-menu d-flex justify-content-end">
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <NavLink to="/" className="nav-link ">
                    Home
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/category" className="nav-link ">
                    Category
                  </NavLink>
                </li>
                {!auth.user ? (
                  <>
                    <li className="nav-item">
                      <NavLink to="/register" className="nav-link">
                        Register
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink to="/sign-in" className="nav-link">
                        Login
                      </NavLink>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav-item dropdown">
                      <a
                        className="nav-link dropdown-toggle"
                        href="#"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Welcome {auth.user.username}
                      </a>
                      <ul className="dropdown-menu">
                        <li className="nav-item">
                          <NavLink
                            to={`/dashboard/${
                              auth?.user?.role == 0 ? "user" : "admin"
                            }`}
                            className="nav-link"
                          >
                            Dashboard
                          </NavLink>
                        </li>
                        <li className="nav-item">
                          <NavLink className="nav-link" onClick={handleLogout}>
                            Logout
                          </NavLink>
                        </li>
                      </ul>
                    </li>
                  </>
                )}
                <li className="nav-item">
                  <NavLink to="/cart" className="nav-link">
                    <div className="cart-container">
                      🛒{" "}
                      <Badge bg="secondary" className="count-container">
                        {cart.length}
                      </Badge>
                    </div>
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
      {/* <div className="App">
        <nav className="navbar navbar-expand-lg navbar-light ">
          <div className="container">
            {auth ? (
              <div
                className=" d-flex justify-content-end collapse navbar-collapse"
                id="navbarTogglerDemo02"
              >
                <ul className="navbar-nav ml-auto d-flex align-items-center gap-4 fs-5">
                  <li className="nav-item">
                    <Link className="nav-link text-primary" to={"/"}>
                      Welcome {name.charAt(0).toUpperCase() + name.slice(1)}
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to={"/profile"}>
                      Profile
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" onClick={handleLogout}>
                      Logout
                    </Link>
                  </li>
                </ul>
              </div>
            ) : (
              <div
                className=" d-flex justify-content-end collapse navbar-collapse"
                id="navbarTogglerDemo02"
              >
                <ul className="navbar-nav ml-auto d-flex align-items-center gap-4 fs-5">
                  <li className="nav-item">
                    <Link className="nav-link" to={"/sign-in"}>
                      Sign In
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to={"/register"}>
                      Sign Up
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </nav>
      </div> */}
    </>
  );
}

export default HeaderSection;
