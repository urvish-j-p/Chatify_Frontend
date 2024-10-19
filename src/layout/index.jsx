import React from "react";
import chatifyIcon from "../assets/chatify.png";

const AuthLayout = ({ children }) => {
  return (
    <>
      <header className="text-primary font-semibold flex justify-center items-center py-3 text-2xl h-20 shadow-md bg-white">
        <img src={chatifyIcon} alt="Chatify Icon" className="h-6 w-6 mr-2" />
        Chatify
      </header>

      {children}
    </>
  );
};

export default AuthLayout;
