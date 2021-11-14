import { useDB } from "../../contexts/DBContext";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import Chatbox from "./Chatbox";

const Chat = () => {
  const {
    getUser,
    chatPartner,
    setChatPartner,
    getAcceptedRequests,
    isChanged,
    setIsChanged,
    techGetAcceptedRequests,
  } = useDB();
  const { user, role } = useAuth();
  const [currentRequest, setCurrentRequest] = useState(null);
  const [requests, setRequests] = useState([]);
  const [firstLoad, setFirstLoad] = useState(true);

  // useEffect(() => {
  //   if (isChanged || firstLoad) {
  //     async function fetchData() {
  //       if (firstLoad) {
  //         await getUser(user.uid);
  //       }
  //       if (role === "customer") {
  //         await loadRequests();
  //       } else if (role === "technician") {
  //         await loadTechRequests();
  //       }
  //     }
  //     fetchData();
  //     setIsChanged(false);
  //     setFirstLoad(false);
  //   }
  // }, [isChanged, firstLoad]);

  useEffect(() => {
    if (isChanged || firstLoad) {
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
      setIsChanged(false);
      setFirstLoad(false);
    }
  }, [isChanged, firstLoad]);

  const loadRequests = async () => {
    console.log(" load requests ");
    let req = [];
    req = await getAcceptedRequests(user.uid);
    req.map((r) => {
      let k = r;
      k.date = String(k.date.toDate()).split(" ").slice(0, 4).join(" ");
      return k;
    });

    setRequests(req);
  };

  const loadTechRequests = async () => {
    console.log(" load requests ");
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
    setIsChanged(true);
  };

  return (
    <div className="flex flex-row flex-auto pt-14 h-screen w-screen">
      <div className="border-r shadow w-72 overflow-auto flex-shrink-0 pl-2">
        {requests.map((r) => (
          <div
            className="border-b"
            key={r.reqId}
            onClick={() => handleClickRequest(r)}
          >
            <p className="text-sm">{r.techEmail}</p>
            <p>{r.issue.split(" ").slice(0, 10).join(" ")}</p>
            <p className="text-sm">{r.date}</p>
          </div>
        ))}
      </div>
      <div className="container h-full w-full overflow-auto">
        {currentRequest ? <Chatbox request={currentRequest} /> : null}
      </div>
    </div>
  );
};

export default Chat;
