import { useState } from "react";
import axios from "axios";

function FormSQL() {
  const [file, setFile] = useState("");

  const upload = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    axios
      .post("http://localhost:8080/upload", formData, { withCredentials: true })
      .then((response) => {
        console.log(response);
      })
      .catch((er) => console.log(er));
  };

  return (
    <>
      <form className=" col-6 offset-3 mt-5 mb-5 p-3 border border-1 rounded-3">
        <label className=" form-label">Upload Image</label>
        <input
          type="file"
          className=" form-control"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button className=" btn btn-dark mt-4 col-12" onClick={upload}>
          Submit
        </button>
      </form>
      <a href="/display" className=" offset-6">
        View Images
      </a>
    </>
  );
}

export default FormSQL;
