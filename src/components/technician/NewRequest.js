import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useDB } from "../../contexts/DBContext";

const NewRequest = ({ setShowNewRequest }) => {
  const { user, role } = useAuth();
  const [issue, setIssue] = useState("");
  const {
    techGetNewRequest,
    setIsChanged,
    techRejectRequest,
    techAcceptRequest,
    techGetPendingRequests,
  } = useDB();
  const [loading, setLoading] = useState(false);
  const [request, setRequest] = useState();
  const [rawRequest, setRawRequest] = useState();

  useEffect(() => {
    async function getData() {
      if (role === "technician") {
        const r = await techGetNewRequest(user.uid);
        if (!r) {
          console.log("no new requests");
        } else {
          setRequest(r.data());
          setRawRequest(r);
        }
      }
    }
    getData();
  }, []);

  const handleAccept = async () => {
    setLoading(true);
    await techAcceptRequest(user.uid, user.email, rawRequest.id);
    setLoading(false);
    setShowNewRequest(false);
    setIsChanged(true);
  };

  const handleReject = async () => {
    setLoading(true);
    await techRejectRequest(rawRequest.id);
    setLoading(false);
    setShowNewRequest(false);
  };

  return (
    <div>
      <>
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
          <div className="relative w-auto my-6 mx-auto max-w-3xl">
            {/*content*/}
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              {/*header*/}
              <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                <h3 className="text-3xl font-semibold">Ticket</h3>
              </div>
              {/*body*/}
              <div className="relative p-6 flex-auto">
                {request ? (
                  <>
                    <p>Issue: {request.issue}</p>
                    <p>Requester: {request.email}</p>
                    <p>
                      Date Requested:{" "}
                      {String(request.date.toDate())
                        .split(" ")
                        .slice(0, 4)
                        .join(" ")}
                    </p>
                  </>
                ) : (
                  <p>No new requests</p>
                )}
              </div>
              {/*footer*/}
              <div className="flex items-center justify-end p-2 border-t border-solid border-blueGray-200 rounded-b">
                {request ? (
                  <>
                    <button
                      className="text-red-500 bg-white hover:bg-gray-200 font-bold uppercase px-6 py-3 rounded text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      disabled={loading}
                      onClick={() => {
                        handleReject();
                        setShowNewRequest(false);
                      }}
                    >
                      Reject
                    </button>
                    <button
                      className="bg-blue-500 text-white hover:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      disabled={loading}
                      onClick={() => {
                        handleAccept();
                        setShowNewRequest(false);
                      }}
                    >
                      Accept
                    </button>
                  </>
                ) : (
                  <button
                    className="bg-blue-500 text-white hover:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      setShowNewRequest(false);
                    }}
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
      </>
    </div>
  );
};

export default NewRequest;