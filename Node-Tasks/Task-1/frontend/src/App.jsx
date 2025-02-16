import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./views/Home/HomePage";
import Register from "./components/Header/Register";
import SignIn from "./components/Header/SignIn";
import HeaderSection from "./components/Header/HeaderSection";
import Profile from "./components/Header/Profile";

function App() {
  return (
    <BrowserRouter>
      <HeaderSection />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
