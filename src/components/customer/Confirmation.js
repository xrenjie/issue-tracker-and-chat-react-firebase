import { useState, useEffect } from "react";
import { useDB } from "../../contexts/DBContext";

const Confirmation = ({
  setShowConfirmation,
  request,
  requests,
  setRequests,
}) => {
  const { deleteRequest } = useDB();
  const { setIsChanged } = useDB();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return function cleanup() {
      setShowConfirmation(false);
    };
  }, []);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteRequest(request);

      //setRequests(requests.filter((req) => req.id !== request.id));
      setIsChanged(true);
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
      //setShowConfirmation(false);
    }
    setLoading(false);
    //setShowConfirmation(false);
  };

  return (
    <div className="flex flex-col">
      <div className="font-sm font-bold">
        Are you sure you want to delete this request?
      </div>
      <div className="flex flex-col sm:flex-row">
        <button
          className="bg-blue-500 text-white hover:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
          type="button"
          onClick={() => setShowConfirmation(false)}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          className="text-red-500 bg-white hover:bg-gray-200 font-bold uppercase px-6 py-3 rounded text-sm outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
          type="button"
          onClick={handleDelete}
          disabled={loading}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default Confirmation;
