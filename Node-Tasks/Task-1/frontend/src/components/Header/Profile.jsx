import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./profile.scss";
import PencilIcon from "../Icons/PencilIcon";
// import CropImg from "../Modals/ImageDialog";
import Crop from "react-easy-crop";
import { Modal } from "react-bootstrap";
import getCroppedImg from "../Crop_Image/CropImg";

function Profile() {
  const [values, setValues] = useState({
    id: "",
    username: "",
    email: "",
    file: "",
  });

  const [edited, isEdited] = useState(false);
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState(values.file);

  useEffect(() => {
    axios
      .get("http://localhost:8080/", { withCredentials: true })
      .then((res) => {
        if (res.data.status === "Success") {
          isEdited(false);
          // console.log(res);
          setValues({
            id: res.data.id,
            username: res.data.username,
            email: res.data.email,
            file: res.data.file,
          });
          setImageUrl(res.data.file);
        } else {
          // setMessage(res.data.Error);
        }
      })
      .catch((error) => console.error(error));
  }, [edited]);

  const handleEdit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("id", values.id);
    formData.append("username", values.username);
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("file", values.file);
    axios
      .patch("http://localhost:8080/user-edit", formData, {
        withCredentials: true,
      })
      .then((res) => {
        // console.log(res);
        if (res.data.status === "Success") {
          isEdited(true);
          navigate("/");
          location.reload(true);
        } else {
          alert("Error in Update user!");
        }
      })
      .catch((error) => console.error(error));
  };

  const handleDelete = (e) => {
    e.preventDefault();
    axios
      .delete("http://localhost:8080/user-delete", {
        data: { id: values.id },
        withCredentials: true,
      })
      .then((res) => {
        // console.log(res);
        if (res.data.status === "Success") {
          navigate("/");
          location.reload(true);
        } else {
          alert("Error in Register new user!");
        }
      })
      .catch((error) => console.error(error));
  };

  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = (crop) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom) => {
    setZoom(zoom);
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const showCroppedImage = async () => {
    const croppedImageUrl = await getCroppedImg(imageUrl, croppedAreaPixels);
    const blob = await fetch(croppedImageUrl).then((r) => r.blob());
    const file = new File([blob], "cropped-image.jpeg", {
      type: "image/jpeg",
    });
    setValues({ ...values, file });
  };

  // console.log(values);

  return (
    <>
      <div className="profileContainer">
        <div>
          <h3 className=" d-flex align-items-center justify-content-center">
            Profile
          </h3>
        </div>
        <div className="profilePicContainer mb-4 position-relative">
          <img
            src={imageUrl}
            className=" img-fluid profilePic border border-1"
          />
          <button
            className="custom-pencil"
            title="Change photo"
            onClick={() => setModalOpen(true)}
          >
            <PencilIcon className=" position-absolute" />
          </button>
        </div>
        {modalOpen && (
          <Modal
            show={modalOpen}
            onHide={() => setModalOpen(false)}
            size="lg"
            centered
          >
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body style={{ height: "400px" }}>
              <Crop
                image={imageUrl}
                crop={crop}
                zoom={zoom}
                aspect={4 / 3}
                onCropChange={onCropChange}
                onZoomChange={onZoomChange}
                onCropComplete={onCropComplete}
                style={{ height: "200px" }}
              />
            </Modal.Body>
            <Modal.Footer>
              <button onClick={showCroppedImage}>Save</button>
              <button onClick={() => setModalOpen(false)}>OK</button>
            </Modal.Footer>
          </Modal>
        )}
        <div>
          <form className="profileForm">
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
                value={values.username}
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
                onChange={(e) =>
                  setValues({ ...values, email: e.target.value })
                }
                value={values.email}
                autoComplete="off"
              />
            </div>
            <div className="mb-3">
              <label>Profile </label>
              <input
                type="file"
                name="file"
                className=" form-control"
                placeholder="Choose Image"
                onChange={(e) => {
                  setValues({ ...values, file: e.target.files[0] });
                }}
              />
            </div>
            <div className="d-grid gap-4">
              <button
                type="submit"
                className="btn btn-dark "
                onClick={handleEdit}
              >
                Edit
              </button>
              <button
                type="submit"
                className="btn btn-dark"
                onClick={handleDelete}
              >
                Delete Account
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* {modalOpen && (
        <CropImg
          show={modalOpen}
          setCroppedImageFor={setCroppedImageFor}
          onCancel={() => setModalOpen(false)}
          imageUrl={values.file}
          cropInit={values.file.crop}
          zoomInit={values.file.zoom}
          aspectInit={values.file.aspect}
        />
      )} */}
    </>
  );
}

export default Profile;
