import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Avatar from "./Avatar";
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { FaImage } from "react-icons/fa";
import { FaVideo } from "react-icons/fa6";
import uploadFile from "../helper/uploadFile";

const Message = () => {
  const params = useParams();
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );
  const user = useSelector((state) => state?.user);

  const [userData, setUserData] = useState({
    _id: "",
    name: "",
    email: "",
    dp: "",
    online: false,
  });

  const [isFormOpen, setIsFormOpen] = useState(false);

  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
  });

  const toggleForm = () => {
    setIsFormOpen((prev) => !prev);
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];

    const uploadedImage = await uploadFile(file);

    setMessage((prev) => {
      return {
        ...prev,
        imageUrl: uploadedImage?.url,
      };
    });
  };

  const handleUploadVideo = async (e) => {
    const file = e.target.files[0];

    const uploadedVideo = await uploadFile(file);

    setMessage((prev) => {
      return {
        ...prev,
        videoUrl: uploadedVideo?.url,
      };
    });
  };

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("messagePage", params.userId);
      socketConnection.on("messageUser", (data) => {
        setUserData(data);
      });
    }
  }, [socketConnection, params?.userId, user]);

  return (
    <div>
      <header className="sticky top-0 h-16 bg-white flex justify-between items-center px-4">
        <div className="flex items-center gap-4">
          <Link to={"/"} className="lg:hidden">
            <FaAngleLeft />
          </Link>
          <div className="my-2">
            <Avatar
              width={50}
              height={50}
              imgUrl={userData?.dp}
              name={userData?.name}
              userId={userData?._id}
            />
          </div>

          <div>
            <h3 className="font-semibold text-lg my-0 text-ellipsis line-clamp-1">
              {userData?.name}
            </h3>
            <p className="text-sm">
              {userData?.online ? (
                <span className="text-primary">online</span>
              ) : (
                <span className="text-slate-400">offline</span>
              )}
            </p>
          </div>
        </div>
        <div>
          <button className="cursor-pointer hover:text-primary">
            <HiDotsVertical />
          </button>
        </div>
      </header>

      <section className="h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar">
        {message?.imageUrl && (
          <div className="w-full h-full bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
            <div className="bg-white p-3">
              <img
                src={message?.imageUrl}
                width={300}
                height={300}
                alt="uploadedImg"
              />
            </div>
          </div>
        )}
        show all messages
      </section>

      <section className="h-16 bg-white flex items-center px-4">
        <div className="realtive">
          <button
            className="flex justify-center items-center w-10 h-10 rounded-full hover:bg-primary hover:text-white cursor-pointer"
            onClick={toggleForm}
          >
            <FaPlus size={20} />
          </button>

          {isFormOpen && (
            <div className="bg-white shadow rounded absolute bottom-14 w-36 p-2">
              <form>
                <label
                  htmlFor="uploadImage"
                  className="flex items-center p-2 gap-3 hover:bg-slate-200 cursor-pointer"
                >
                  <div className="text-primary">
                    <FaImage size={18} />
                  </div>
                  <p>Image</p>
                </label>
                <label
                  htmlFor="uploadVideo"
                  className="flex items-center p-2 gap-3 hover:bg-slate-200 cursor-pointer"
                >
                  <div className="text-primary">
                    <FaVideo size={18} />
                  </div>
                  <p>Video</p>
                </label>

                <input
                  type="file"
                  id="uploadImage"
                  onChange={handleUploadImage}
                />
                <input
                  type="file"
                  id="uploadVideo"
                  onChange={handleUploadVideo}
                />
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Message;
