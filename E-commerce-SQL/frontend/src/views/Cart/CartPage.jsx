import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DropIn from "braintree-web-drop-in-react";
import { useCart } from "../../context/cart";
// import toast from "react-hot-toast";

const CartPage = () => {
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  const [cartPrice, setCartPrice] = useState();
  const [cartDetails, setCartDetails] = useState([]);
  const [deleteItem, setDelete] = useState(false);
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (auth && auth.user && auth.user.id) {
      cartDetail();
      cartAmount();
      setDelete(false);
    }
  }, [auth, deleteItem]);

  useEffect(() => {
    getToken();
  }, [auth && auth.token]);

  const cartDetail = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:8080/cart/cart-product",
        {
          userId: auth.user.id,
        }
      );
      if (data.success == true) {
        setCartDetails(data.result);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const cartAmount = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:8080/cart/cart-amount",
        {
          userId: auth.user.id,
        }
      );
      if (data.success == true) {
        setCartPrice(data.result[0].amount);
      }
    } catch (error) {
      console.log(error);
    }
  };
  //detele item
  const removeCartItem = async (pid) => {
    try {
      const { data } = await axios.delete(
        "http://localhost:8080/cart/delete-product",
        {
          params: {
            userId: auth.user.id,
            productId: pid,
          },
        }
      );
      if (data.success == true) {
        setDelete(true);
        let myCart = [...cart];
        let index = myCart.findIndex((item) => item.id === pid);
        myCart.splice(index, 1);
        setCart(myCart);
        localStorage.setItem("cart", JSON.stringify(myCart));
        toast.success("Product deleted successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  //get payment gateway token
  const getToken = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8080/product/braintree/token"
      );
      setClientToken(data && data.clientToken);
    } catch (error) {
      console.log(error);
    }
  };

  //handle payments
  const handlePayment = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      await axios.post(
        "http://localhost:8080/product/braintree/payment",
        {
          nonce,
          cartDetails,
          auth,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      toast.success("Payment Completed Successfully ");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <>
      <Layout title={"Cart - StyleHub"}>
        <div className="container mt-5">
          <div className="row">
            <div className="col-md-12">
              <h4 className="mb-4">
                {cart && cart.length
                  ? `Cart(${cart.length})`
                  : " Your Cart Is Empty"}
              </h4>
            </div>
          </div>
          {cart && cart.length > 0 && (
            <div className="row">
              <div className="col-md-8">
                {cartDetails &&
                  cartDetails.map((p) => (
                    <div key={p.id} className="row mb-2 p-3 card flex-row">
                      <div className="col-md-4">
                        <img
                          src={p.product_photo.split(",")[0]}
                          className="card-img-top"
                          alt={p.name}
                          width="250px"
                          height={"250px"}
                        />
                      </div>
                      <div className="col-md-8">
                        <p>{p.name}</p>
                        <p>{p.description.substring(0, 30)}</p>
                        <p>Price : {p.price}</p>
                        <button
                          className="btn btn-danger"
                          onClick={() => removeCartItem(p.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="col-md-4 text-center">
                <h2>Cart Summary</h2>
                <p>Total | Checkout | Payment</p>
                <hr />
                <h4>Total : {cartPrice} </h4>
                {/* {auth && auth.user.address ? (
                <>
                  <div className="mb-3">
                    <h4>Current Address</h4>
                    <h5>{auth.user.address}</h5>
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Address
                    </button>
                  </div>
                </>
              ) : (
                <div className="mb-3">
                  {auth.token ? (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Address
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() =>
                        navigate("/login", {
                          state: "/cart",
                        })
                      }
                    >
                      Plase Login to checkout
                    </button>
                  )}
                </div>
              )} */}
                {clientToken && (
                  <>
                    <DropIn
                      options={{
                        authorization: clientToken,
                        paypal: {
                          flow: "vault",
                        },
                      }}
                      onInstance={(instance) => setInstance(instance)}
                    />

                    <button
                      className="btn btn-primary"
                      onClick={handlePayment}
                      disabled={loading || !instance}
                    >
                      {loading ? "Processing ...." : "Make Payment"}
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
};

export default CartPage;
