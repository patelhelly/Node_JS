import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./profile.scss";
import PencilIcon from "../Icons/PencilIcon";
// import CropImg from "../Modals/ImageDialog";
import Crop from "react-easy-crop";
import { Modal } from "react-bootstrap";
import getCroppedImg from "../Crop_Image/CropImg";
import Layout from "../Layout/Layout";
import { useAuth } from "../../context/auth";

function Profile() {
  const [auth, setAuth] = useAuth();
  const [name, setName] = useState(auth.user.username);
  const [email, setEmail] = useState(auth.user.email);
  const [file, setFile] = useState(auth.user.profile);
  const [phone, setPhone] = useState(auth.user.phone);

  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const imageUrl = auth.user.profile;

  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleEdit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("id", auth.user.id);
    formData.append("username", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("file", file);
    axios
      .patch("http://localhost:8080/user-edit", formData, {
        withCredentials: true,
      })
      .then((res) => {
        // console.log(res);
        if (res.data.status === "Success") {
          console.log(res);
          setAuth({
            ...auth,
            user: null,
            token: "",
          });
          localStorage.removeItem("auth");
          setAuth({
            ...auth,
            user: res.data.user,
            token: res.data.token,
          });
          localStorage.setItem("auth", JSON.stringify(res.data));
        } else {
          alert("Error in Update user!");
        }
      })
      .catch((error) => console.error(error));
    // console.log(name, email, file, phone);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    axios
      .delete("http://localhost:8080/user-delete", {
        data: { id: auth.user.id },
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
    setFile({ ...file, file });
  };

  console.log(auth);
  console.log(name, email, file, phone);

  return (
    <>
      <Layout title={"User Profile - StyleHub"}>
        <div className="profileContainer">
          <div>
            <h3 className=" d-flex align-items-center justify-content-center">
              Profile
            </h3>
          </div>
          <div className="profilePicContainer mb-4 position-relative">
            <img
              src={auth.user.profile}
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
                  onChange={(e) => setName(e.target.value)}
                  value={name}
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
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  autoComplete="off"
                />
              </div>
              <div className="mb-3">
                <label>Phone No.</label>
                <input
                  type="number"
                  name="phone"
                  className="form-control"
                  placeholder="Enter email"
                  onChange={(e) => setPhone(e.target.value)}
                  value={phone}
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
                    setFile(e.target.files[0]);
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
      </Layout>
    </>
  );
}

export default Profile;
