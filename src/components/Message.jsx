import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Avatar from "./Avatar";

const Message = () => {
  const params = useParams();
  const socketConnection = useSelector((state) => state.user.socketConnection);

  const [userData, setUserData] = useState({
    _id: "",
    name: "",
    email: "",
    dp: "",
    online: false,
  });

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("messagePage", params.userId);
      socketConnection.on("messageUser", (data) => {
        setUserData(data);
      });
    }
  }, [socketConnection, params?.userId]);

  return (
    <div>
      <header className="sticky top-0 h-16 bg-white">
        <div>
          <div>
            <Avatar
              width={50}
              height={50}
              imgUrl={userData?.dp}
              name={userData?.name}
              userId={userData?._id}
            />
          </div>

          <div>
            <h3>{userData?.name}</h3>
            <p>{userData?.online ? "online" : "offline"}</p>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Message;
