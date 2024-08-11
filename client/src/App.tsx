import { io, Socket } from "socket.io-client";
import "./App.css";
import { ReactNode, useEffect, useRef, useState } from "react";
import Chat from "./components/chat";
import Login from "./components/login";

export interface IUserInfo {
  name?: string;
  socketId?: string;
}

export interface IMessageHistoryObject {
  fromName: string;
  from: string;
  to: string;
  toName: string;
  message: string;
  date: Date;
}

let socketServer: Socket;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authenticateError, setAuthenticateError] = useState("");
  const [onlineUsers, setOnlineUsers] = useState<IUserInfo[]>([]);
  const [currentUser, setCurrentUser] = useState<IUserInfo>();

  const [selectedUser, setSelectedUser] = useState<IUserInfo>();
  const [selectedUserMessageHistory, setSelectedUserMessageHistory] = useState<
    IMessageHistoryObject[]
  >([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageHistory, setMessageHistory] = useState<IMessageHistoryObject[]>(
    []
  );

  const messageHistoryRef = useRef(messageHistory);

  function authenticateUser(name: string) {
    setAuthenticateError("");
    if (!name || name.length < 3) {
      setAuthenticateError("Please provide a valid name");
      return;
    }

    if (onlineUsers.find((onlineUsers) => onlineUsers.name === name)) {
      setAuthenticateError("This name is already taken");
      return;
    }

    setCurrentUser({
      name: name,
    });
    setIsAuthenticated(true);
  }

  function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (currentMessage.trim())
      socketServer.emit("privateMessage", {
        to: selectedUser?.socketId,
        from: currentUser?.socketId,
        message: currentMessage,
        date: new Date(),
        fromName: currentUser?.name,
        toName: selectedUser?.name
      });
    setCurrentMessage("");
      const onlines = [...onlineUsers];
      const index = onlines.findIndex((user) => user.socketId === selectedUser?.socketId);
      if(index) {
        onlines.splice(index, 1);
        onlines.splice(0, 0, selectedUser!);
        console.log(onlines)
        setOnlineUsers(onlines);
      }
  }



  useEffect(() => {
    if (isAuthenticated) {
      socketServer = io("http://localhost:8000", {
        query: { name: currentUser?.name },
      });
      socketServer.io.on("error", (context) => {
        console.log(context);
      });

      socketServer.on("socketId", (data: IUserInfo) => {
        setCurrentUser(data);
      });

      socketServer.on("sockets", (users: IUserInfo[]) => {
        setOnlineUsers(users);
      });

      socketServer.on("privateMessage", (data: IMessageHistoryObject) => {
        const newMessageHistory = [...messageHistoryRef.current];
        newMessageHistory.push(data);
        setMessageHistory(newMessageHistory);
      });

      socketServer.io.on("close", () => {
        const newOnlineUsers = onlineUsers.filter(
          (onlineUser) => onlineUser.socketId !== currentUser?.socketId
        );
        setOnlineUsers(newOnlineUsers);
        setCurrentUser({});
      });
    }

    return () => {
      if (socketServer) socketServer.disconnect();
    };
  }, [isAuthenticated]);



  useEffect(() => {
    messageHistoryRef.current = messageHistory;
    if (selectedUser) {
      const selectHistory = messageHistory.filter(
        (message) =>
          (message.from === currentUser?.socketId &&
            message.to === selectedUser.socketId) ||
          (message.to === currentUser?.socketId &&
            message.from === selectedUser.socketId)
      );
      setSelectedUserMessageHistory(selectHistory);
    }
  }, [messageHistory, selectedUser]);


  return (
    <div className="w-screen h-screen">
      {isAuthenticated ? (
        <Chat
          onlineUsers={onlineUsers}
          currentUser={currentUser!}
          currentMessage={currentMessage}
          setCurrentMessage={setCurrentMessage}
          setSelectedUser={setSelectedUser}
          selectedUser={selectedUser!}
          sendMessage={sendMessage}
          selectedUserMessageHistory={selectedUserMessageHistory}
        />
      ) : (
        <Login
          authenticateUser={authenticateUser}
          authenticateError={authenticateError}
        />
      )}
    </div>
  );
}

export default App;
