import contact from "../../assets/contactus.jpeg";
import Layout from "../Layout/Layout";

const Policy = () => {
  return (
    <>
      <Layout title={"Policy - StyleHub"}>
        <div className="row contactus ">
          <div className="col-md-6 mt-4">
            <img src={contact} alt="contactus" className=" img-fluid" />
          </div>
          <div className="col-md-4">
            <p>add privacy policy</p>
            <p>add privacy policy</p>
            <p>add privacy policy</p>
            <p>add privacy policy</p>
            <p>add privacy policy</p>
            <p>add privacy policy</p>
            <p>add privacy policy</p>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Policy;
