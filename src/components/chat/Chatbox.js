import { useDB } from "../../contexts/DBContext";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";

const Chatbox = ({ request }) => {
  const { getMessages, sendMessage, chatChanged, setChatChanged } = useDB();
  const { user, role } = useAuth();
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (chatChanged) {
      async function fetchData() {
        await loadMessages();
      }
      fetchData();
      setChatChanged(false);
    }
  }, [chatChanged]);

  const loadMessages = async () => {
    let m = await getMessages(request.uid, request.reqId);
    m.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
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
    if (!loading) {
      if (chatMessage.length > 0) {
        setLoading(true);
        await sendMessage(request.uid, request.reqId, chatMessage, user.email);
        setChatMessage("");
        setChatChanged(true);
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col">
      <div className="fixed shadow bg-white w-full border-b p-2 self-start">
        {request ? request.issue.split(" ").slice(0, 10).join(" ") : null}
      </div>
      <div className="chat-window overflow-auto pb-2">
        <div className="flex flex-col-reverse w-auto h-full pl-2 pr-2 overflow-auto">
          {messages
            ? messages.map((message) => {
                return (
                  <div
                    key={message.id}
                    className={
                      message.email === user.email
                        ? "block self-end bg-green-200 border-black rounded p-2 my-2"
                        : "block self-start bg-blue-200 border-black rounded p-2 my-2"
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
      </div>
      <div className="fixed border-t chat-box focus-within:w-auto justify-between flex gap-2 bottom-0 p-2 right-0 bg-white">
        <input
          id="chatbox"
          name="chatbox"
          type="text"
          onChange={(e) => setChatMessage(e.target.value)}
          className="border flex-grow self-left border-gray-300 placeholder-gray-500 text-gray-900 rounded-full focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10"
          placeholder="Aa"
          onKeyDown={handleEnterKey}
          disabled={loading}
          value={chatMessage}
        />

        <button
          className="right-2 self-right border rounded-full bg-blue-600 text-white border-blue-500  px-2 hover:bg-blue-700"
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
