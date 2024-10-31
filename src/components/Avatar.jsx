import React from "react";
import { PiUserCircle } from "react-icons/pi";
import { useSelector } from "react-redux";

const Avatar = ({ userId, name, imgUrl, width, height }) => {
  const onlineUser = useSelector((state) => state?.user?.onlineUser);
  let avatarName;

  if (name) {
    const splitName = name?.split(" ");

    if (splitName.length > 1) {
      avatarName = splitName[0][0] + splitName[1][0];
    } else {
      avatarName = splitName[0][0];
    }
  }

  const isOnline = onlineUser.includes(userId);

  return (
    <div
      className="text-slate-800 rounded-full shadow border text-xl font-bold relative bg-green-200"
      style={{ width: width + "px", height: height + "px" }}
    >
      {imgUrl ? (
        <img
          src={imgUrl}
          width={width}
          height={height}
          alt={name}
          className="overflow-hidden rounded-full"
        />
      ) : name ? (
        <div
          style={{ width: width + "px", height: height + "px" }}
          className="overflow-hidden rounded-full flex justify-center items-center"
        >
          {avatarName}
        </div>
      ) : (
        <PiUserCircle size={width} />
      )}

      {isOnline && <div className="bg-green-600 p-1 absolute bottom-2 -right-1 z-10 rounded-full"></div>}
    </div>
  );
};

export default Avatar;
