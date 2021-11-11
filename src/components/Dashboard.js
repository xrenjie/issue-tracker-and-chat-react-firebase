import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Request from "./customer/Request";
import { useDB } from "../contexts/DBContext.js";
import RequestTable from "./customer/RequestTable";
import NewRequest from "./technician/NewRequest";
import AcceptedRequestTable from "./technician/AcceptedRequestTable";

const Dashboard = () => {
  const { user, role, setRole } = useAuth();
  const { getUser } = useDB();

  const [showRequest, setShowRequest] = useState(false);

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
        <div className="mt-32 lg:mx-60 min-h-full flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 z-[-1] relative">
          <div className="w-full space-y-8 flex-col">
            <button
              className="border-2 px-2 border-black bg-blue-500 m-2 text-white"
              onClick={() => setShowRequest(true)}
            >
              New Request
            </button>

            {showRequest ? <Request setShowRequest={setShowRequest} /> : null}
          </div>
          <RequestTable />
        </div>
      ) : (
        <div className="mt-32 lg:mx-60 min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 z-[-1] relative">
          <div className="w-full space-y-8">
            <button
              className="border-2 px-2 border-black bg-blue-500 m-2 text-white"
              onClick={() => {
                getRequest();
                setShowNewRequest(true);
              }}
            >
              Get New Request
            </button>
            {showNewRequest ? (
              <NewRequest setShowNewRequest={setShowNewRequest} />
            ) : null}
            <AcceptedRequestTable />
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
