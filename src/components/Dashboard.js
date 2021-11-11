import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";
import Request from "./customer/Request";
import { useDB } from "../contexts/DBContext.js";
import RequestTable from "./customer/RequestTable";
import NewRequest from "./technician/NewRequest";
import AcceptedRequestTable from "./technician/AcceptedRequestTable";

const Dashboard = () => {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const { logout, user, role, setRole } = useAuth();
  const { getUser, techGetNewRequest } = useDB();

  const navigate = useNavigate();
  const [showRequest, setShowRequest] = useState(false);

  const [request, setRequest] = useState();
  const [showNewRequest, setShowNewRequest] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (user) {
        const r = await getUser(user.uid);
        setRole(r.role);
      }
    }
    fetchData();
  });

  const getRequest = async () => {};

  return (
    <>
      {role === "customer" ? (
        <div className="flex-auto flex-col">
          <div className="flex gap-5 mt-20 flex-wrap">
            {error && <p>{error}</p>}
            {user.email}
            <button
              className="border-2 border-black bg-blue-500 m-2 text-white"
              onClick={() => setShowRequest(true)}
            >
              New Request
            </button>

            {showRequest ? <Request setShowRequest={setShowRequest} /> : null}
          </div>
          <div>
            <RequestTable />
          </div>
        </div>
      ) : (
        // <div>
        //   <div className="flex gap-5 mt-20 flex-wrap">
        //     {request === null ? null : JSON.stringify(request)}
        //   </div>
        //   <button
        //     className="border-2 border-black bg-blue-500 m-2 text-white"
        //     onClick={getRequest}
        //   >
        //     New Request
        //   </button>
        // </div>
        <div className="mt-32 min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 z-[-1] relative">
          <div className="max-w-md w-full space-y-8">
            <button
              className="border-2 border-black bg-blue-500 m-2 text-white"
              onClick={() => {
                getRequest();
                setShowNewRequest(true);
              }}
            >
              Get New Request
            </button>
            {showNewRequest ? (
              <NewRequest
                setShowNewRequest={setShowNewRequest}
                request={request}
              />
            ) : null}
            <AcceptedRequestTable />
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
