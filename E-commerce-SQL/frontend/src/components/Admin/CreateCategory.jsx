import Layout from "../Layout/Layout";
import AdminMenu from "../Admin/AdminMenu";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";
import CategoryForm from "./CategoryForm";
import { useAuth } from "../../context/auth";

const CreateCategory = () => {
  const [auth] = useAuth();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("");

  useEffect(() => {
    getAllCategory();
  }, []);

  //handle Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:8080/category/create-category",
        {
          name,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      if (data?.success) {
        toast.success(`${name} is created`);
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("somthing went wrong in input form");
    }
  };

  //get all cat
  const getAllCategory = async () => {
    await axios
      .get("http://localhost:8080/category/get-category")
      .then((res) => {
        const success = JSON.stringify(res.data.success);
        if (success == "true") {
          const category = res?.data?.categories;
          setCategories(category);
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something wwent wrong in getting catgeory");
      });
  };

  //update category
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `http://localhost:8080/category/update-category/${selected.id}`,
        { name: updatedName },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      if (data.success) {
        toast.success(`${updatedName} is updated`);
        setSelected(null);
        setUpdatedName("");
        setVisible(false);
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Somtihing went wrong");
    }
  };
  //delete category
  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:8080/category/delete-category/${id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      if (data.success) {
        toast.success(`category is deleted`);

        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Somtihing went wrong");
    }
  };

  return (
    <Layout title={"Dashboard - Create Category"}>
      <div className="container-fluid mt-5 p-3">
        <div className="row d-flex gap-3">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-8 d-flex flex-column align-items-center">
            <h3>Manage Category</h3>
            <div className="p-3 w-50">
              <CategoryForm
                handleSubmit={handleSubmit}
                value={name}
                setValue={setName}
              />
            </div>
            <div className="w-75">
              <table className=" mt-4 table table-hover table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                  {categories &&
                    categories.map((c) => (
                      <tr key={c.id}>
                        <td>{c.name}</td>
                        <td>
                          <button
                            className="btn btn-primary ms-2"
                            onClick={() => {
                              setVisible(true);
                              setUpdatedName(c.name);
                              setSelected(c);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger ms-2"
                            onClick={() => {
                              handleDelete(c.id);
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <Modal
              onHide={() => setVisible(false)}
              footer={null}
              show={visible}
            >
              <CategoryForm
                value={updatedName}
                setValue={setUpdatedName}
                handleSubmit={handleUpdate}
              />
            </Modal>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCategory;
