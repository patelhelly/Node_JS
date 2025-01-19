import Layout from "../Layout/Layout";
import AdminMenu from "../Admin/AdminMenu";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/auth";

const CreateProduct = () => {
  const [auth] = useAuth();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const selectRef = useRef();
  const selectRef1 = useRef();

  useEffect(() => {
    getAllCategory();
  }, []);

  //get all category
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8080/category/get-category"
      );
      const success = JSON.stringify(data.success);
      if (success == "true") {
        setCategories(data?.categories);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something wwent wrong in getting catgeory");
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles([...selectedFiles]);

    // Create preview URLs
    const fileUrls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(fileUrls);
  };

  //create product function
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      files.forEach((file) => {
        productData.append("files", file);
      });
      productData.append("category", category);
      productData.append("shipping", shipping);
      const { data } = await axios.post(
        "http://localhost:8080/product/create-product",
        productData,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      const success = JSON.stringify(data.success);
      if (success == "true") {
        toast.success("Product Created Successfully");
        // setCategory("");
        setCategory("");
        setName("");
        setDescription("");
        setFiles([]);
        setPreviewUrls([]);
        setPrice("");
        setQuantity("");
        setShipping("");
        selectRef.current.value = "";
        selectRef1.current.value = "";
      } else {
        toast.error(data?.message);
      }
      // Revoke object URLs after uploading
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    } catch (error) {
      console.log(error);
      toast.error("something went wrong");
    }
  };

  return (
    <Layout title={"Dashboard - Create Product"}>
      <div className="container-fluid mt-5 p-3">
        <div className="row d-flex gap-3">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-8">
            <h3>Create Product</h3>
            <form className=" w-100">
              <div className="m-1">
                <div className="mb-3">
                  <label className=" form-label">Category of Product</label>
                  <select
                    placeholder="Select a category"
                    name="category"
                    className="form-select mb-3"
                    defaultValue=""
                    ref={selectRef}
                    onChange={(e) => {
                      setCategory(e.target.value);
                    }}
                  >
                    <option value="" disabled>
                      Select a category...
                    </option>
                    {categories?.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className=" form-label">Product Images</label>
                  <label className="btn btn-outline-secondary col-md-12">
                    Upload Photo
                    <input
                      type="file"
                      name="files"
                      accept="image/*"
                      onChange={handleFileChange}
                      multiple
                      hidden
                    />
                  </label>
                </div>
                <div className="m-3 d-flex align-items-center">
                  {files &&
                    files.map((file, id) => (
                      <div className="text-center" key={id}>
                        <img
                          src={URL.createObjectURL(file)}
                          alt="product_photo"
                          height={"100px"}
                          width={"100px"}
                          className="img img-responsive"
                        />
                      </div>
                    ))}
                </div>
                <div className="mb-3">
                  <label className=" form-label">Product Title</label>
                  <input
                    type="text"
                    name="name"
                    value={name}
                    placeholder="Product Title ..."
                    className="form-control"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className=" form-label">Product Description</label>
                  <textarea
                    type="text"
                    name="description"
                    value={description}
                    placeholder="Product description..."
                    className="form-control"
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="mb-3 d-flex justify-content-between align-items-center">
                  <div className=" col-6">
                    <label className=" form-label">Product Price</label>
                    <input
                      type="number"
                      name="price"
                      value={price}
                      placeholder="Price"
                      className="form-control"
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                  <div className=" col-5">
                    <label className=" form-label">Product Quantity</label>
                    <input
                      type="number"
                      name="quantity"
                      value={quantity}
                      placeholder="quantity"
                      className="form-control"
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className=" form-label">Shipping Charges</label>
                  <select
                    placeholder="Select Shipping "
                    name="shipping"
                    className="form-select mb-3"
                    defaultValue=""
                    ref={selectRef1}
                    onChange={(e) => {
                      setShipping(e.target.value);
                    }}
                  >
                    <option value="" disabled>
                      choose..
                    </option>
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                  </select>
                </div>
                <div className="mb-3">
                  <button className="btn btn-primary" onClick={handleCreate}>
                    CREATE PRODUCT
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProduct;
