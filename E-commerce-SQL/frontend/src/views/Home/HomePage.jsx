import Layout from "../../components/Layout/Layout";

import axios from "axios";
import { Checkbox, Radio } from "antd";
import { Prices } from "../../components/Prices/Prices";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth";
import { toast } from "react-toastify";
import { useCart } from "../../context/cart";

function HomePage() {
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllCategory();
    getAllProducts();
    getTotal();
  }, []);

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);

  useEffect(() => {
    if (!checked.length || !radio.length) getAllProducts();
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
  }, [checked, radio]);

  //get all cat
  const getAllCategory = async () => {
    await axios
      .get("http://localhost:8080/category/get-category")
      .then((res) => {
        const success = JSON.stringify(res.data.success);
        if (success == "true") {
          const category = res.data.categories;
          setCategories(category);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //get products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:8080/product/product-list/${page}`
      );
      // console.log(data);
      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  //getTOtal COunt
  const getTotal = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8080/product/product-count"
      );
      setTotal(data && data.total);
      // console.log(data.total);
    } catch (error) {
      console.log(error);
    }
  };

  // //load more
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:8080/product/product-list/${page}`
      );
      setLoading(false);
      setProducts([...products, ...(data && data.products)]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // filter by cat
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };

  // get filterd product
  const filterProduct = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:8080/product/product-filters",
        {
          checked,
          radio,
        }
      );
      setProducts(data && data.products);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToCart = async (p) => {
    try {
      const { data } = await axios.post(
        "http://localhost:8080/cart/add-product",
        {
          userId: auth.user.id,
          productId: p.id,
          price: p.price,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      if (data.success == true) {
        setCart([...cart, p]);
        localStorage.setItem("cart", JSON.stringify([...cart, p]));
        toast.success("Product Added to Cart");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Layout title={"Show Now - StyleHub"}>
        <div className="container-fluid row product_layout">
          <div className="col-md-2">
            <h6 className="text-center">Filter By Category</h6>
            <div className="d-flex flex-column">
              {categories?.map((c) => (
                <Checkbox
                  key={c.id}
                  className=" mb-2"
                  onChange={(e) => handleFilter(e.target.checked, c.id)}
                >
                  {c.name}
                </Checkbox>
              ))}
            </div>
            {/* price filter */}
            <h4 className="text-center mt-4">Filter By Price</h4>
            <div className="d-flex flex-column">
              <Radio.Group onChange={(e) => setRadio(e.target.value)}>
                {Prices?.map((p) => (
                  <div key={p._id} className=" mb-3">
                    <Radio value={p.array}>$ {p.name}</Radio>
                  </div>
                ))}
              </Radio.Group>
            </div>
            <div className="d-flex flex-column">
              <button
                className="btn btn-danger"
                onClick={() => window.location.reload()}
              >
                RESET FILTERS
              </button>
            </div>
          </div>
          <div className="col-md-9">
            <h3 className="text-center">All Products</h3>
            <div className="d-flex flex-wrap gap-3">
              {products?.map((p) => (
                <div key={p.id} className="card m-2" style={{ width: "15rem" }}>
                  <img
                    src={p.product_photo.split(",")[0]}
                    className="card-img-top img-fluid product_photo"
                    alt={p.name}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{p.name.substring(0, 16)}...</h5>
                    <p className="card-text">
                      {p.description.substring(0, 20)}...
                    </p>
                    <p className="card-text"> $ {p.price}</p>
                    <div className=" d-flex">
                      <button className="btn btn-primary ms-1 ">
                        More Details
                      </button>
                      <button
                        className="btn btn-secondary ms-1"
                        onClick={() => handleAddToCart(p)}
                      >
                        ADD TO CART
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="m-2 p-3">
              {products && products.length < total && (
                <button
                  className="btn btn-warning"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(page + 1);
                  }}
                >
                  {loading ? "Loading ..." : "Loadmore"}
                </button>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default HomePage;
