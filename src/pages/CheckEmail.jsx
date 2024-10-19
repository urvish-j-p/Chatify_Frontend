import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import uploadFile from "../helper/uploadFile";
import axios from "axios";
import { notification } from "antd";

const CheckEmail = () => {
  const [data, setData] = useState({
    email: "",
  });

  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/email`;

    try {
      const response = await axios.post(URL, data);

      notification.success({
        message: response.data.message,
      });

      if (response.data.success) {
        setData({
          email: "",
        });

        navigate("/password", {
          state: response?.data?.data,
        });
      }
    } catch (error) {
      notification.error({
        message: error.response.data.message,
      });
    }
  };

  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto">
        <h3 className="flex justify-center text-primary font-semibold">
          Verify Email
        </h3>
        <form className="grid gap-3 mt-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email: </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.email}
              onChange={handleOnChange}
              required
            />
          </div>

          <button className="bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 text-white">
            Verify
          </button>
        </form>
        <p className="my-3 flex justify-center items-center">
          Don't have an account?
          <span
            className="hover:text-primary font-semibold cursor-pointer ml-1"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default CheckEmail;
