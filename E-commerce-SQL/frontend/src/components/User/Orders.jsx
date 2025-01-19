import UserMenu from "../User/UserMenu";
import Layout from "../Layout/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/auth";

const Orders = () => {
  const [auth] = useAuth();
  const [orderDetail, setOrderDetail] = useState([]);
  console.log(auth);
  useEffect(() => {
    if (auth && auth.user && auth.user.id) {
      getAllOrders();
    }
  }, []);

  const getAllOrders = async () => {
    const res = await axios.get("http://localhost:8080/orders", {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
      params: {
        userId: auth.user.id,
      },
    });
    if (res.data.success === true) {
      setOrderDetail(res.data.result);
    }
  };
  console.log(orderDetail);
  return (
    <Layout title={"Your Orders"}>
      <div className="container-flui p-3 m-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <h1>All Orders</h1>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
