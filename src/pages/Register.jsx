import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import uploadFile from "../helper/uploadFile";
import axios from "axios";
import { notification, Spin } from "antd";

const Register = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    dp: "",
  });

  const [uploadPhoto, setUploadPhoto] = useState("");
  const [isUploading, setIsUploading] = useState(false);
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

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    setIsUploading(true);

    try {
      const uploadedPhoto = await uploadFile(file);
      setUploadPhoto(file);

      setData((prev) => ({
        ...prev,
        dp: uploadedPhoto?.url,
      }));
    } catch (error) {
      notification.error({
        message: "Failed to upload the photo",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setUploadPhoto("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/register`;

    try {
      const response = await axios.post(URL, data);

      notification.success({
        message: response.data.message,
      });

      if (response.data.success) {
        setData({
          name: "",
          email: "",
          password: "",
          dp: "",
        });

        navigate("/email");
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
          Register to Chatify
        </h3>
        <form className="grid gap-3 mt-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Name: </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.name}
              onChange={handleOnChange}
              required
            />
          </div>
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
          <div className="flex flex-col gap-1">
            <label htmlFor="password">Password: </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.password}
              onChange={handleOnChange}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="dp">
              Profile Pic:
              <div className="h-14 bg-slate-200 flex justify-center items-center border rounded hover:border-primary cursor-pointer">
                {isUploading ? (
                  <Spin />
                ) : (
                  <p className="text-sm max-w-[300px] text-ellipsis line-clamp-1">
                    {uploadPhoto?.name
                      ? uploadPhoto?.name
                      : "Upload Profile Pic"}
                  </p>
                )}

                {uploadPhoto?.name && !isUploading && (
                  <button
                    className="text-lg ml-2 hover:text-red-600"
                    onClick={handleClose}
                  >
                    <IoClose />
                  </button>
                )}
              </div>
            </label>
            <input
              type="file"
              id="dp"
              name="dp"
              className="bg-slate-100 px-2 py-1 focus:outline-primary hidden"
              onChange={handleUploadPhoto}
            />
          </div>
          <button className="bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 text-white">
            Register
          </button>
        </form>
        <p className="my-3 flex justify-center items-center">
          Already have an account?
          <span
            className="hover:text-primary font-semibold cursor-pointer ml-1"
            onClick={() => navigate("/email")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
