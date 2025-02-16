import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function HeaderSection() {
  const [auth, setAuth] = useState(false);
  // const [message, setMessage] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8080/", { withCredentials: true })
      .then((res) => {
        if (res.data.status === "Success") {
          // console.log(res);
          setAuth(true);
          setName(res.data.username);
        } else {
          setAuth(false);
          // setMessage(res.data.Error);
        }
      })
      .catch((error) => console.error(error));
  }, []);

  const handleLogout = () => {
    axios
      .get("http://localhost:8080/logout", { withCredentials: true })
      .then(() => {
        location.reload(true);
      })
      .catch((error) => console.error(error));
  };

  return (
    <>
      <div className="App">
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
      </div>
    </>
  );
}

export default HeaderSection;
