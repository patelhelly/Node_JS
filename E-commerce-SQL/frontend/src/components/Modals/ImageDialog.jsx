import { Modal } from "react-bootstrap";
import "./cropimg.scss";
import PropTypes from "prop-types";
import { useState } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "../Crop_Image/CropImg";

function ImageDialog({
  show,
  imageUrl,
  cropInit,
  zoomInit,
  aspectInit,
  onCancel,
  setCroppedImageFor,
}) {
  if (zoomInit == null) {
    zoomInit = 1;
  }
  if (cropInit == null) {
    cropInit = { x: 0, y: 0 };
  }
  if (aspectInit == null) {
    aspectInit = 4 / 3;
  }
  const [zoom, setZoom] = useState(zoomInit);
  const [crop, setCrop] = useState(cropInit);
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

  const onCrop = () => {
    getCroppedImg(imageUrl, croppedAreaPixels).then((croppedImageUrl) => {
      setCroppedImageFor(croppedImageUrl);
    });
  };
  return (
    <>
      <Modal show={show} onHide={onCancel} size="lg" centered>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body style={{ height: "400px" }}>
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={4 / 3}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropComplete}
          />
        </Modal.Body>
        <Modal.Footer>
          <div className="button-area">
            <button onClick={onCancel}>Cancel</button>
            <button onClick={onCrop}>Crop</button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Define prop types for validation
ImageDialog.propTypes = {
  show: PropTypes.bool,
  onCancel: PropTypes.func,
  setCroppedImageFor: PropTypes.func,
  imageUrl: PropTypes.string,
  cropInit: PropTypes.string,
  zoomInit: PropTypes.string,
  aspectInit: PropTypes.string,
};

export default ImageDialog;
