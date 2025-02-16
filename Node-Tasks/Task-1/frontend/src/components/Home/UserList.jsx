import axios from "axios";
import { useEffect, useState } from "react";

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/user/list", { withCredentials: true })
      .then((res) => {
        if (res.data.status === "Success") {
          setUsers(res.data.result);
        }
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <>
      <div className="mt-5">
        <h3>User List:</h3>
        <table className="mt-4 table table-hover table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th className="text-center py-3 h5">UserName</th>
              <th className="text-center py-3 h5">Email</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default UserList;
