import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  logout,
  setOnlineUser,
  setSocketConnection,
  setUser,
} from "../redux/userSlice";
import Sidebar from "../components/Sidebar";
import chatifyLogo from "../assets/chatify.png";
import io from "socket.io-client";

const Home = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname === "/";

  console.log("Redux user:", user);
  const fetchUserDetails = async () => {
    try {
      const URL = `${import.meta.env.VITE_BACKEND_URL}/api/userDetails`;

      const response = await axios({
        url: URL,
        withCredentials: true,
      });

      dispatch(setUser(response.data.data));

      if (response.data.data.logout) {
        dispatch(logout());
        navigate("/email");
      }

      console.log("response is: ", response);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    const socketConnection = io("https://chatify-backend-by-urvish.vercel.app", {
      auth: {
        token: localStorage.getItem("token"),
      },
      reconnection: true, // Enable automatic reconnections
      reconnectionAttempts: 5, // Retry up to 5 times
      reconnectionDelay: 1000, // Initial delay between attempts (1 second)
      reconnectionDelayMax: 5000, // Maximum delay between attempts (5 seconds)
    });

    // On connection
    socketConnection.on("connect", () => {
      console.log("Socket connected with ID:", socketConnection.id);
    });

    // Handle online users
    socketConnection.on("onlineUser", (data) => {
      console.log("Online users:", data);
      dispatch(setOnlineUser(data));
    });

    // Handle disconnect and reconnection
    socketConnection.on("disconnect", (reason) => {
      console.warn("Socket disconnected:", reason);
      if (reason === "io server disconnect") {
        // Attempt reconnection if token might be invalid
        console.log("Reauthenticating socket...");
        socketConnection.auth.token = localStorage.getItem("token");
        socketConnection.connect();
      }
    });

    socketConnection.on("reconnect_attempt", (attempt) => {
      console.log(`Reconnection attempt ${attempt}`);
    });

    // Dispatch the socket connection to the store
    dispatch(setSocketConnection(socketConnection));

    // Cleanup function to disconnect the socket on unmount
    return () => {
      console.log("Disconnecting socket...");
      socketConnection.disconnect();
    };
  }, [dispatch]);

  return (
    <div className="grid lg:grid-cols-[300px,1fr] h-screen max-h-screen">
      <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
        <Sidebar />
      </section>
      <section className={`${basePath && "hidden"}`}>
        <Outlet />
      </section>

      <div
        className={`justify-center items-center flex-col gap-2 hidden ${
          !basePath ? "hidden" : "lg:flex"
        }`}
      >
        <div className="flex gap-2">
          <img src={chatifyLogo} width={35} />
          <p className="text-2xl text-slate-700">Chatify</p>
        </div>
        <p className="text-lg mt-2 text-slate-500">
          Select user to send message
        </p>
      </div>
    </div>
  );
};

export default Home;
