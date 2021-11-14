import { useDB } from "../../contexts/DBContext";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import Chatbox from "./Chatbox";

const Chat = () => {
  const {
    getUser,
    getAcceptedRequests,
    getResolvedRequests,
    isChanged,
    setChatChanged,
    techGetAcceptedRequests,
  } = useDB();
  const { user, role } = useAuth();
  const [currentRequest, setCurrentRequest] = useState(null);
  const [requests, setRequests] = useState([]);
  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    if (firstLoad) {
      async function getRequests() {
        if (firstLoad) {
          await getUser(user.uid);
        }
        if (role === "customer") {
          await loadRequests();
        } else if (role === "technician") {
          await loadTechRequests();
        }
      }
      getRequests();
      //setIsChanged(false);
      setFirstLoad(false);
    }
  }, [firstLoad]);

  const loadRequests = async () => {
    console.log(" load requests customer ");
    let req = [];
    req = await getAcceptedRequests(user.uid);
    req.map((r) => {
      let k = r;
      k.date = String(k.date.toDate()).split(" ").slice(0, 4).join(" ");
      return k;
    });
    let req2 = await getResolvedRequests(user.uid);
    req2.map((r) => {
      let k = r;
      k.date = String(k.date.toDate()).split(" ").slice(0, 4).join(" ");
      return k;
    });

    setRequests(req.concat(req2));
  };

  const loadTechRequests = async () => {
    console.log(" load requests tech ");
    let req = [];
    req = await techGetAcceptedRequests(user.uid);
    req.map((r) => {
      let k = r;
      k.date = String(k.date.toDate()).split(" ").slice(0, 4).join(" ");
      return k;
    });

    setRequests(req);
  };

  const handleClickRequest = async (request) => {
    setCurrentRequest(request);
    setChatChanged(true);
    //setIsChanged(true);
  };

  return (
    <div className="flex flex-row flex-auto pt-14 h-screen w-screen">
      <div className="border-r w-44 break-words sm:w-72 overflow-auto flex-shrink-0">
        {requests.map((r) => {
          return r ? (
            <div
              className={
                currentRequest
                  ? r.reqId === currentRequest.reqId
                    ? r.status === "Accepted"
                      ? " bg-gray-200 rounded cursor-pointer p-2 m-2 "
                      : " bg-green-200 rounded cursor-pointer p-2 m-2 text-gray-700"
                    : r.status === "Accepted"
                    ? " bg-gray-100 hover:bg-gray-200 rounded cursor-pointer p-2 m-2"
                    : " bg-green-100 hover:bg-green-200 rounded cursor-pointer p-2 m-2 text-gray-700"
                  : " bg-gray-100 hover:bg-gray-200 rounded cursor-pointer p-2 m-2"
              }
              key={r.reqId}
              onClick={() => handleClickRequest(r)}
            >
              <p>{r.issue.split(" ").slice(0, 10).join(" ")}</p>
              <p className="text-xs font-semibold">
                {role === "customer" ? r.techEmail : r.email}
              </p>
              <p className="text-xs">{r.date}</p>
            </div>
          ) : null;
        })}
      </div>
      <div className="w-full h-full">
        {currentRequest ? <Chatbox request={currentRequest} /> : null}
      </div>
    </div>
  );
};

export default Chat;
