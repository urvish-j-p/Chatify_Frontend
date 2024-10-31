import { useState } from "react";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import Avatar from "./Avatar";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Input, Button, Upload, notification, List } from "antd";
import axios from "axios";
import { setUser } from "../redux/userSlice";
import uploadFile from "../helper/uploadFile";
import { FiArrowUpLeft } from "react-icons/fi";

const Sidebar = () => {
  const user = useSelector((state) => state?.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [photo, setPhoto] = useState(user?.dp || "");
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const dispatch = useDispatch();
  const [allUser, setAllUser] = useState([]);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const showSearchModal = () => {
    setIsSearchModalOpen(true);
  };

  const handleSearch = async (term) => {
    if (!term) return;

    try {
      const URL = `${import.meta.env.VITE_BACKEND_URL}/api/searchUser`;
      const response = await axios.post(
        URL,
        { search: term },
        { withCredentials: true }
      );

      if (response.data.success) {
        setSearchResults(response.data.data);
      } else {
        notification.error({
          message: "Failed to fetch users",
        });
      }
    } catch (error) {
      notification.error({
        message: "Error while searching for users",
      });
    }
  };

  const handleOk = async () => {
    setIsUpdating(true);
    try {
      const URL = `${import.meta.env.VITE_BACKEND_URL}/api/updateUser`;
      const response = await axios({
        url: URL,
        method: "POST",
        data: { name, dp: photo },
        withCredentials: true,
      });

      if (response.data.success) {
        notification.success({
          message: "User updated successfully!",
        });
        dispatch(setUser(response.data.data));
      } else {
        notification.error({
          message: "Failed to update user details",
        });
      }
    } catch (error) {
      notification.error({
        message: "Failed to update user details",
      });
    } finally {
      setIsUpdating(false);
      setIsModalOpen(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsSearchModalOpen(false);
  };

  const handleUploadPhoto = async ({ file }) => {
    setIsUploading(true);

    try {
      const uploadedPhoto = await uploadFile(file);
      setPhoto(uploadedPhoto?.url);
    } catch (error) {
      notification.error({
        message: "Failed to upload the photo",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full h-full grid grid-cols-[48px,1fr] bg-white">
      <div className="bg-slate-100 w-12 h-full rounded-tr-lg rounded-br-lg py-5 text-slate-600 flex flex-col justify-between">
        <div>
          <NavLink
            className={({ isActive }) =>
              `w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded ${
                isActive && "bg-slate-200"
              }`
            }
            title="chat"
          >
            <IoChatbubbleEllipses size={25} />
          </NavLink>

          <div
            title="Add friend"
            className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded"
            onClick={showSearchModal}
          >
            <FaUserPlus size={25} />
          </div>
        </div>

        <div className="flex flex-col">
          <button className="mx-auto" title={user?.name} onClick={showModal}>
            <Avatar
              width={40}
              height={40}
              name={user?.name}
              imgUrl={user?.dp}
              userId={user?._id}
            />
          </button>
          <button
            className="w-10 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded"
            title="Logout"
          >
            <span className="-ml-2">
              <BiLogOut size={25} />
            </span>
          </button>
        </div>
      </div>

      <div className="w-full">
        <div className="h-16 flex items-center">
          <h2 className="text-xl font-bold p-4 text-slate-800">Message</h2>
        </div>

        <div className="bg-slate-200 p-[0.5px]"></div>

        <div className="h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar">
          {allUser.length === 0 && (
            <div className="mt-20">
              <div className="flex justify-center items-center my-4 text-slate-500">
                <FiArrowUpLeft size={50} />
              </div>

              <p className="text-lg text-center text-slate-400">
                Explore users to start a conversation!
              </p>
            </div>
          )}
        </div>
      </div>

      <Modal
        title="Search Users"
        open={isSearchModalOpen}
        onOk={handleCancel}
        onCancel={handleCancel}
        footer={null}
        width={400}
      >
        <Input
          placeholder="Enter name or email"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            handleSearch(e.target.value);
          }}
        />
        <List
          itemLayout="horizontal"
          dataSource={searchResults}
          renderItem={(user) => {
            return (
              <List.Item
                onClick={() => {
                  navigate(`/${user?._id}`);
                  setIsSearchModalOpen(false);
                }}
                className="cursor-pointer"
              >
                <div className="flex items-center space-x-5">
                  <Avatar
                    name={user.name}
                    imgUrl={user.dp}
                    width={40}
                    height={40}
                  />
                  <div>
                    <div className="font-semibold">{user.name}</div>
                    <div className="text-gray-500">{user.email}</div>
                  </div>
                </div>
              </List.Item>
            );
          }}
        />
      </Modal>

      <Modal
        title="Edit Info"
        open={isModalOpen}
        onOk={handleOk}
        confirmLoading={isUpdating}
        onCancel={handleCancel}
      >
        <div className="flex flex-col items-center">
          <Avatar
            width={80}
            height={80}
            name={user?.name}
            imgUrl={photo || user?.dp}
            userId={user?._id}
          />
          <Upload
            accept="image/*"
            beforeUpload={() => false}
            onChange={handleUploadPhoto}
            showUploadList={false}
          >
            <Button type="link" className="mt-2" loading={isUploading}>
              Upload New Photo
            </Button>
          </Upload>
          <Input
            className="mt-4"
            value={name || user?.name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Name"
          />
        </div>
      </Modal>
    </div>
  );
};

export default Sidebar;
