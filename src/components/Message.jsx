import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Avatar from "./Avatar";
import { FaAngleLeft } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { FaImage } from "react-icons/fa";
import { FaVideo } from "react-icons/fa6";
import uploadFile from "../helper/uploadFile";
import { IoClose } from "react-icons/io5";
import { Spin } from "antd";
import chatifyBackground from "../assets/chatifyBackground.jpeg";
import { IoMdSend } from "react-icons/io";
import moment from "moment";

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
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
  });

  const [allMessage, setAllMessage] = useState([]);
  const currentMessage = useRef(null);

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({
        behavior: "auto",
        block: "end",
      });
    }
  }, [allMessage]);

  const toggleForm = () => {
    setIsFormOpen((prev) => !prev);
  };

  const handleUploadImage = async (e) => {
    setLoading(true);
    const file = e.target.files[0];

    const uploadedImage = await uploadFile(file);

    setMessage((prev) => {
      return {
        ...prev,
        imageUrl: uploadedImage?.url,
      };
    });
    setLoading(false);
    setIsFormOpen(false);
  };

  const handleClearImage = () => {
    setMessage((prev) => {
      return {
        ...prev,
        imageUrl: "",
      };
    });
  };

  const handleUploadVideo = async (e) => {
    setLoading(true);
    const file = e.target.files[0];

    const uploadedVideo = await uploadFile(file);

    setMessage((prev) => {
      return {
        ...prev,
        videoUrl: uploadedVideo?.url,
      };
    });
    setLoading(false);
    setIsFormOpen(false);
  };

  const handleClearVideo = () => {
    setMessage((prev) => {
      return {
        ...prev,
        videoUrl: "",
      };
    });
  };

  const handleMessageChange = (e) => {
    const { name, value } = e.target;

    setMessage((prev) => {
      return {
        ...prev,
        text: value,
      };
    });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (message?.text || message?.imageUrl || message?.videoUrl) {
      if (socketConnection) {
        socketConnection.emit("newMessage", {
          sender: user?._id,
          receiver: params?.userId,
          text: message?.text,
          imageUrl: message?.imageUrl,
          videoUrl: message?.videoUrl,
          msgByUserId: user?._id,
        });
        setMessage({
          text: "",
          imageUrl: "",
          videoUrl: "",
        });
      }
    }
  };

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("messagePage", params.userId);

      socketConnection.emit("seen", params.userId);

      socketConnection.on("messageUser", (data) => {
        setUserData(data);
      });

      socketConnection.on("message", (data) => {
        setAllMessage(data);
      });
    }
  }, [socketConnection, params?.userId, user]);

  return (
    <div
      style={{ backgroundImage: `url(${chatifyBackground})` }}
      className="bg-no-repeat bg-cover"
    >
      <header className="sticky top-0 h-16 bg-white flex justify-between items-center px-4 z-60">
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
      </header>

      <section className="max-h-[calc(100vh-128px)] min-h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-50">
        <div className="flex flex-col gap-2 py-2 mx-2" ref={currentMessage}>
          {allMessage?.map((msg, index) => {
            return (
              <div
                key={index}
                className={` p-1 py-1 rounded w-fit max-w-[280px] md:max-w-sm lg:max-w-md ${
                  user?._id === msg?.msgByUserId
                    ? "ml-auto bg-teal-100"
                    : "bg-white"
                }`}
              >
                <div className="w-full relative z-50">
                  {msg?.imageUrl && (
                    <img
                      src={msg?.imageUrl}
                      className="w-full h-full object-scale-down"
                    />
                  )}
                  {msg?.videoUrl && (
                    <video
                      src={msg.videoUrl}
                      className="w-full h-full object-scale-down"
                      controls
                    />
                  )}
                </div>
                <p className="px-2 relative z-50">{msg?.text}</p>
                <p className="text-xs ml-auto w-fit">
                  {moment(msg?.createdAt).format("hh:mm")}
                </p>
              </div>
            );
          })}
        </div>

        {message?.imageUrl && (
          <div className="w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden z-50">
            <div
              className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600"
              onClick={handleClearImage}
            >
              <IoClose size={25} />
            </div>
            <div className="bg-white p-3">
              <img
                src={message?.imageUrl}
                alt="uploadedImg"
                className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
              />
            </div>
          </div>
        )}
        {message?.videoUrl && (
          <div className="w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden z-50">
            <div
              className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600"
              onClick={handleClearVideo}
            >
              <IoClose size={25} />
            </div>
            <div className="bg-white p-3">
              <video
                src={message?.videoUrl}
                className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
                controls
                muted
                autoPlay
              />
            </div>
          </div>
        )}

        <div className="w-full h-full flex justify-center items-center sticky bottom-0">
          <Spin spinning={loading} />
        </div>
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
                  className="hidden"
                />
                <input
                  type="file"
                  id="uploadVideo"
                  onChange={handleUploadVideo}
                  className="hidden"
                />
              </form>
            </div>
          )}
        </div>

        <form className="h-full w-full flex gap-2" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Message"
            className="py-1 px-4 outline-none w-full h-full"
            value={message?.text}
            onChange={handleMessageChange}
          />
          <button className="text-primary hover:text-secondary">
            <IoMdSend size={25} />
          </button>
        </form>
      </section>
    </div>
  );
};

export default Message;
