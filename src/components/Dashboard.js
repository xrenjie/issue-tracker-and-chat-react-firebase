import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Request from "./customer/Request";
import { useDB } from "../contexts/DBContext.js";
import NewRequest from "./technician/NewRequest";
import RequestCard from "./customer/RequestCard";
import TechRequestCard from "./technician/TechRequestCard";

const Dashboard = () => {
  const { user, role } = useAuth();
  const {
    getUser,
    getNewOrResolvedRequests,
    isChanged,
    setIsChanged,
    techGetAcceptedRequests,
    techGetResolvedRequests,
  } = useDB();
  const [showRequest, setShowRequest] = useState(false);
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [requests, setRequests] = useState([]);
  const [firstLoad, setFirstLoad] = useState(true);

  const statuses = {
    New: 1,
    Accepted: 0,
    Resolved: 2,
  };

  useEffect(() => {
    if (isChanged || firstLoad) {
      async function fetchData() {
        if (firstLoad) {
          await getUser(user.uid);
        }
        if (role === "customer") {
          await loadRequests();
        } else if (role === "technician") {
          await loadTechRequests();
        }
      }
      fetchData();
      setIsChanged(false);
      setFirstLoad(false);
    }
  }, [isChanged, firstLoad]);

  const loadRequests = async () => {
    let req = [];
    req = await getNewOrResolvedRequests(user.uid);
    req.map((r) => {
      let k = r;
      k.date = String(k.date.toDate()).split(" ").slice(0, 4).join(" ");
      return k;
    });
    req.sort((a, b) => {
      return statuses[a.status] - statuses[b.status];
    });
    setRequests(req);
  };

  const loadTechRequests = async () => {
    let req = [];
    req = await techGetAcceptedRequests(user.uid);
    req.map((r) => {
      let k = r;
      k.date = String(k.date.toDate()).split(" ").slice(0, 4).join(" ");
      return k;
    });

    setRequests(req);
  };

  return (
    <>
      {role === "customer" ? (
        <div className="mt-8 flex-col lg:mx-60 min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 z-[-1] relative">
          <div className="w-full flex-col">
            <button
              className="bg-blue-500 text-white hover:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              onClick={() => setShowRequest(true)}
            >
              New Request
            </button>
            {requests.map((req) => {
              return <RequestCard key={req.reqId} request={req} />;
            })}
          </div>

          {showRequest ? <Request setShowRequest={setShowRequest} /> : null}
        </div>
      ) : (
        <div className="mt-8 flex-col lg:mx-60 min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 z-[-1] relative">
          <div className="w-full flex-col">
            <button
              className="bg-blue-500 text-white hover:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              onClick={() => {
                setShowNewRequest(true);
              }}
            >
              Get New Request
            </button>

            {requests.map((req) => {
              return <TechRequestCard key={req.reqId} request={req} />;
            })}
          </div>
          {showNewRequest ? (
            <NewRequest setShowNewRequest={setShowNewRequest} />
          ) : null}
        </div>
      )}
    </>
  );
};

export default Dashboard;
