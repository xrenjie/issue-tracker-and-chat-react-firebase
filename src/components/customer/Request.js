import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useDB } from "../../contexts/DBContext";

const Request = ({ setShowRequest, setRequests, requests }) => {
  const { user } = useAuth();
  const [issue, setIssue] = useState("");
  const { addNewRequest, setIsChanged } = useDB();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    if (issue === "") {
      alert("Please enter a request");
      return;
    }
    let request = {
      issue: issue,
      uid: user.uid,
      status: "New",
      date: new Date(),
      techUid: "none",
      email: user.email,
      techEmail: "none",
    };

    try {
      setLoading(true);
      const reqId = await addNewRequest(request);
      request.date = String(request.date).split(" ").slice(0, 4).join(" ");
      request.reqId = reqId;
      setRequests([request, ...requests]);
      setLoading(false);
      setShowRequest(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setShowRequest(false);
    }
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
                <h3 className="text-3xl font-semibold">New Support Request</h3>
              </div>
              {/*body*/}
              <div className="relative p-6 flex-auto">
                <label htmlFor="issue" className="sr-only">
                  Issue
                </label>
                <textarea
                  id="issue"
                  name="issue"
                  type="textarea"
                  autoComplete="issue"
                  rows={10}
                  onChange={(e) => setIssue(e.target.value)}
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Issue"
                ></textarea>
              </div>
              {/*footer*/}
              <div className="flex items-center justify-end p-2 border-t border-solid border-blueGray-200 rounded-b">
                <button
                  className="text-red-500 bg-white hover:bg-gray-200 font-bold uppercase px-6 py-3 rounded text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => setShowRequest(false)}
                >
                  Close
                </button>
                <button
                  className="bg-blue-500 text-white hover:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
      </>
    </div>
  );
};

export default Request;
