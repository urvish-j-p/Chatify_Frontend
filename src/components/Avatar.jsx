import React from "react";
import { PiUserCircle } from "react-icons/pi";

const Avatar = ({ name, imgUrl, width, height }) => {
  let avatarName;

  if (name) {
    const splitName = name?.split(" ");

    if (splitName.length > 1) {
      avatarName = splitName[0][0] + splitName[1][0];
    } else {
      avatarName = splitName[0][0];
    }
  }

  return (
    <div
      className="text-slate-800 overflow-hidden rounded-full shadow border text-xl font-bold bg-green-200"
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
    </div>
  );
};

export default Avatar;
