import { RouterProvider } from "react-router-dom";
import router from "../router";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        draggable
        transition="Bounce"
      />
      <ToastContainer />
    </>
  );
}

export default App;
