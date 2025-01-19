import Layout from "../Layout/Layout";
import AdminMenu from "../Admin/AdminMenu";
import axios from "axios";
import { useEffect, useState } from "react";

const UserList = () => {
  useEffect(() => {
    handleList();
  }, []);

  const [userList, setUserList] = useState([]);

  const handleList = async () => {
    await axios
      .get(`http://localhost:8080/user-list`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.status === "Success") {
          setUserList(res.data.result);
        }
      })
      .catch((error) => {
        console.error(error.response.data); // Log the error response data
      });
  };
  return (
    <Layout title={"Dashboard - All Users"}>
      <div className="container-fluid mt-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-8">
            <h1>All Users</h1>
            <table className=" mt-4 table table-hover table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th className="text-center py-3 h5">UserName</th>
                  <th className="text-center py-3 h5">Email</th>
                </tr>
              </thead>
              <tbody className="table-group-divider">
                {userList.map(
                  (user) =>
                    user.role == 0 && (
                      <tr key={user.id}>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                      </tr>
                    )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserList;
