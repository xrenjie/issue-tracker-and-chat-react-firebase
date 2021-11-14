import { useDB } from "../../contexts/DBContext";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";

const Chatbox = ({ request }) => {
  const { getMessages, sendMessage, isChanged, setIsChanged } = useDB();
  const { user, role } = useAuth();
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // if (isChanged || firstLoad) {
  //   async function fetchData() {
  //     if (firstLoad) {
  //       await getUser(user.uid);
  //     }
  //     if (role === "customer") {
  //       await loadRequests();
  //     } else if (role === "technician") {
  //       await loadTechRequests();
  //     }
  //   }
  //   fetchData();
  //   setIsChanged(false);
  //   setFirstLoad(false);
  // }

  useEffect(() => {
    if (isChanged) {
      async function fetchData() {
        await loadMessages();
      }
      fetchData();
      setIsChanged(false);
    }
  }, [isChanged]);

  const loadMessages = async () => {
    let m = await getMessages(request.uid, request.reqId);
    m.sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });
    setMessages(m);
  };

  const handleEnterKey = async (e) => {
    if (e.keyCode === 13) {
      await handleSubmit(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (chatMessage.length > 0) {
      setLoading(true);
      await sendMessage(request.uid, request.reqId, chatMessage, user.email);
      setChatMessage("");
      setIsChanged(true);
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full">
      <div className="w-full fixed border-b pb-2 mb-2 pl-2 pt-1">
        {request ? request.issue.split(" ").slice(0, 10).join(" ") : null}
      </div>
      <div className="flex flex-col w-full h-full pt-10 border-b pb-2 mb-2 pl-2">
        {messages
          ? messages.map((message) => {
              return (
                <div
                  key={message.id}
                  className={
                    message.email === user.email
                      ? "block self-end p-2 bg-green-200 border-black rounded my-2 mr-2"
                      : "block self-start p-2 bg-blue-200 border-black rounded my-2"
                  }
                >
                  <div>{message.message}</div>
                  <div className="text-xs">
                    <p className="inline font-bold">
                      {message.email === user.email ? "You" : message.email}{" "}
                    </p>
                    {message.date.split(" ").slice(1, 5).join(" ")}
                  </div>
                </div>
              );
            })
          : null}
      </div>
      <div className="fixed flex bottom-2 pl-2 ">
        <input
          id="chatbox"
          name="chatbox"
          type="text"
          onChange={(e) => setChatMessage(e.target.value)}
          className="border flex-grow border-gray-300 placeholder-gray-500 text-gray-900 rounded-full focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10"
          placeholder="Aa"
          onKeyDown={handleEnterKey}
          disabled={loading}
          value={chatMessage}
        />

        <button
          className="fixed right-2 border rounded-full bg-blue-600 text-white border-blue-500 mt-2 px-2 hover:bg-blue-700"
          onClick={handleSubmit}
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbox;
