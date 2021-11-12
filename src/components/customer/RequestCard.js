import { useEffect, useState } from "react";
import Confirmation from "./Confirmation";
import { Link } from "react-router-dom";
import { useDB } from "../../contexts/DBContext";
const RequestCard = ({ request }) => {
  const { setChatPartner } = useDB();
  // const request = {
  // 	issue: issue,
  // 	uid: user.uid,
  // 	status: "new",
  // 	date: new Date(),
  // 	techUid: "none",
  // 	email: user.email,
  // 	techEmail: "none",
  // };

  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {}, []);

  return (
    <div className="flex sm: flex-col container border rounded shadow-md my-2 px-4 py-2">
      {request.status === "Accepted" ? (
        <Link
          className="bg-green-500 text-white self-start hover:bg-green-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          type="button"
          onClick={() => setChatPartner(request.techUid)}
          to="/chat"
        >
          Chat
        </Link>
      ) : null}

      <p className="border-b mb-2 pb-2 text-sm">{request.date}</p>

      <div className="border-b mb-2 pb-2 ">
        <p className="font-bold border-b w-14 mb-2">Issue:</p>
        {request.issue}
      </div>
      {request.techEmail === "none" ? null : (
        <div className="border-b mb-2 pb-2">
          {request.techEmail === "none" ? (
            ""
          ) : (
            <>
              <p className="font-bold border-b w-20 mb-2">Contact:</p>{" "}
              {request.techEmail}
            </>
          )}
        </div>
      )}
      <p
        className={
          request.status === "New"
            ? "text-blue-500 rounded  border-b w-auto pb-2 font-bold"
            : request.status === "Accepted"
            ? "text-purple-500 rounded  border-b w-auto pb-2 font-bold"
            : request.status === "Resolved"
            ? "text-green-500 text-white rounded border-b w-auto pb-2 font-bold"
            : "text-black"
        }
      >
        {request.status}
      </p>
      <div className="my-2 flex flex-col sm:flex-row">
        {showConfirmation ? (
          <Confirmation
            request={request}
            setShowConfirmation={setShowConfirmation}
          />
        ) : (
          <button
            className="bg-red-500 text-white hover:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
            onClick={() => setShowConfirmation(true)}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default RequestCard;
