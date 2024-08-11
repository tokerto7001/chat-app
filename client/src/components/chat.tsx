import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { IMessageHistoryObject, IUserInfo } from "../App"

interface IChatProps {
  onlineUsers: IUserInfo[];
  currentUser: IUserInfo;
  currentMessage: string;
  setCurrentMessage: Dispatch<SetStateAction<string>>;
  selectedUser: IUserInfo;
  setSelectedUser: Dispatch<SetStateAction<IUserInfo | undefined>>;
  sendMessage: Function;
  selectedUserMessageHistory: IMessageHistoryObject[];
}

export default function Chat({onlineUsers, currentUser, currentMessage, setCurrentMessage, selectedUser, setSelectedUser, sendMessage, selectedUserMessageHistory}: IChatProps){
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedUserMessageHistory]);

    return (
        <div className='border border-gray-200 h-[75%] w-[60%] m-auto mt-10 flex flex-col'>
        <div className='h-1/6 bg-orange-500 flex justify-center items-center text-white text-3xl'>
            CHAT APP
        </div>
        <div className='flex h-5/6'>
          <div className='w-1/5 border-r'>
              {
                onlineUsers.map((onlineUser) => (
                  <div 
                  key={onlineUser.socketId! + Date.now()}
                  className={`hover:bg-slate-200 p-3 hover:cursor-pointer ${selectedUser?.socketId === onlineUser?.socketId && 'bg-slate-200'}`}
                  onClick={() => setSelectedUser(onlineUser)}
                  >
                    {onlineUser.name} {currentUser.socketId === onlineUser.socketId && '(Me)'}
                  </div>
                ))
              }
          </div>
          <div className='w-4/5'>
            <div className="h-5/6 flex-grow overflow-y-auto">
               {
                selectedUser ? (
                  <div className="flex flex-col justify-end min-h-full">
                    {
                      selectedUserMessageHistory.map((messageInfo, index) => (
                        <div key={messageInfo.from + Date.now() + index} className={`${messageInfo.from === currentUser.socketId ? 'text-right' : 'text-left'} p-3`}>
                          <p className="text-blue-300">{messageInfo.fromName}</p>
                          <span>{messageInfo.message}</span>
                        </div>
                      ))
                    }

                    <div ref={messageEndRef} />
                  </div>
                ) : 'WELCOME'
                }
            </div>
            {
              selectedUser && (
                <form className="flex h-1/6" onSubmit={(event) => sendMessage(event)}>
                <input
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  className="border border-slate-300 w-5/6 h-full focus:outline-none"
                />
                <div className="w-1/6 flex items-center justify-center">
                <button 
                className="border bg-blue-400 text-white h-12 rounded-md hover:bg-white hover:text-blue-400 hover:border-blue-400 w-20"
                type="submit"
                >
                  Send
                  </button>
                </div>
  
              </form>
              )
            }

          </div>
        </div>
  
      </div>
    )
          }