import { useEffect, useState } from "react";
import axios from "axios";

function ImageListInSQL() {
  const [imgList, setImgList] = useState([]);

  useEffect(() => {
    display();
  }, []);

  const display = () => {
    axios
      .get("http://localhost:8080/display-cloudinary", {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response);
        setImgList(response.data.data);
      })
      .catch((er) => console.log(er));
  };

  return (
    <>
      <div>
        <h1>Image List:</h1>
        {imgList.length === 0 ? (
          <p>No images to display</p>
        ) : (
          imgList.map((img, index) => (
            <div
              key={index}
              className=" d-flex justify-content-center align-items-center my-3"
            >
              <img
                src={`${img.url}`}
                alt={`img-${img.filename}`}
                onError={(e) => console.log("Image failed to load", e)}
              />
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default ImageListInSQL;
