import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./views/Home/HomePage";
import Register from "./components/Header/Register";
import SignIn from "./components/Header/SignIn";
import Profile from "./components/User/Profile";
import About from "./components/Footer/About";
import Contact from "./components/Footer/Contact";
import Policy from "./components/Footer/Policy";
import Pagenotfound from "./components/PageNotFound/PagenotFound";
import UserDashboard from "./views/User/UserDashboard";
import UserRoute from "./Routes/UserRoute";
import AdminRoute from "./Routes/AdminRoute";
import AdminDashboard from "./views/Admin/AdminDashboard";
import CreateCategory from "./components/Admin/CreateCategory";
import CreateProduct from "./components/Admin/CreateProduct";
import UserList from "./components/Admin/UserList";
import Orders from "./components/User/Orders";
import CartPage from "./views/Cart/CartPage";
import { AuthProvider } from "./context/auth";
import { CartProvider } from "./context/cart";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/dashboard" element={<UserRoute />}>
              <Route path="user" element={<UserDashboard />} />
              <Route path="user/profile" element={<Profile />} />
              <Route path="user/orders" element={<Orders />} />
            </Route>
            <Route path="/dashboard" element={<AdminRoute />}>
              <Route path="admin" element={<AdminDashboard />} />
              <Route
                path="admin/create-category"
                element={<CreateCategory />}
              />
              <Route path="admin/create-product" element={<CreateProduct />} />
              <Route path="admin/user-list" element={<UserList />} />
            </Route>
            <Route path="/register" element={<Register />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/policy" element={<Policy />} />
            <Route path="*" element={<Pagenotfound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
