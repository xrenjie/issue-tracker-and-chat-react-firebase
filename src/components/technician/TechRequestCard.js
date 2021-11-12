import { useEffect, useState } from "react";
import TechConfirmation from "./TechConfirmation";
import { Link } from "react-router-dom";
import { useDB } from "../../contexts/DBContext";

const TechRequestCard = ({ request }) => {
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
  const [confirmationType, setConfirmationType] = useState("");

  useEffect(() => {}, []);

  return (
    <div className="flex flex-col container border rounded shadow-md my-2 px-4 py-2">
      {request.status !== "Resolved" ? (
        <Link
          className="bg-green-500 text-white self-start hover:bg-green-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          type="button"
          onClick={() => setChatPartner(request.uid)}
          to="/chat"
        >
          Chat
        </Link>
      ) : null}

      <p className="border-b-2 mb-2 pb-2 text-sm">{request.date}</p>

      <div className="border-b-2 mb-2 pb-2 ">
        <p className="font-bold border-b w-14 mb-2">Issue:</p> {request.issue}
      </div>

      <div className="pb-2">
        <p className="font-bold border-b w-20 mb-2">Contact:</p> {request.email}
      </div>

      <div className="flex flex-col sm:flex-row">
        {request.status === "Resolved" ? (
          <div className="border-t-2 pt-2 text-green-500 font-bold w-full">
            Resolved
          </div>
        ) : showConfirmation ? (
          <TechConfirmation
            request={request}
            setShowConfirmation={setShowConfirmation}
            confirmationType={confirmationType}
          />
        ) : (
          <div className="border-t-2 pt-2 w-full flex flex-col sm:flex-row">
            <button
              className="bg-green-500 text-white hover:bg-green-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
              onClick={() => {
                setConfirmationType("Resolve");
                setShowConfirmation(true);
              }}
            >
              Resolve
            </button>
            <button
              className="bg-red-500 text-white hover:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
              onClick={() => {
                setConfirmationType("Withdraw");
                setShowConfirmation(true);
              }}
            >
              Withdraw
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TechRequestCard;
