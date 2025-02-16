import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Home from "./components/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ImageListInSQL from "./components/SQL/ImageListInSQL";
import ImageListCloudinary from "./components/SQL-Cloudinary/ImageListCloudinary";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/display" element={<ImageListInSQL />} />
          <Route path="/display-cloud" element={<ImageListCloudinary />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
