import FromCloudinary from "./SQL-Cloudinary/FromCloudinary";
import FormSQL from "./SQL/FormSQL";

function Home() {
  return (
    <>
      <FormSQL />
      <FromCloudinary />
    </>
  );
}

export default Home;
