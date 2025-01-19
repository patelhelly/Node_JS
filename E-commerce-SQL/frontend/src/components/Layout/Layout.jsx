import { Helmet } from "react-helmet";
import FooterSection from "./FooterSection";
import HeaderSection from "./HeaderSection";
import { ToastContainer } from "react-toastify";

const Layout = ({ children, title }) => {
  return (
    <>
      <div>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <HeaderSection />
        <main style={{ minHeight: "100vh" }} className=" p-0 m-0">
          <ToastContainer />
          {children}
        </main>
        <FooterSection />
      </div>
    </>
  );
};

export default Layout;
