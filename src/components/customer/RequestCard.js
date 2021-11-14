import { useEffect, useState } from "react";
import Confirmation from "./Confirmation";
const RequestCard = ({ request, requests, setRequests }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  return (
    <div className="flex flex-col container rounded shadow-md p-2 my-6">
      <div className="p-2">{request.issue}</div>
      <p className={"text-blue-500 text-sm rounded w-auto pl-2 font-bold"}>
        {request.status}
      </p>
      <p className="text-sm pl-2">{request.date}</p>
      <div className="flex flex-col sm:flex-row pl-2 my-2">
        {showConfirmation ? (
          <Confirmation
            request={request}
            requests={requests}
            setRequests={setRequests}
            setShowConfirmation={setShowConfirmation}
          />
        ) : (
          <button
            className="bg-red-500 text-white hover:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
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
