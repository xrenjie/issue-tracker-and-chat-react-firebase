import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useDB } from "../../contexts/DBContext";

const TechConfirmation = ({
  setShowConfirmation,
  request,
  confirmationType,
}) => {
  const { techWithdrawRequest, techResolveRequest } = useDB();
  const { setIsChanged } = useDB();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (confirmationType === "Resolve") {
      handleResolve();
    } else if (confirmationType === "Withdraw") {
      handleWithdraw();
    }
  };

  const handleResolve = async () => {
    try {
      setLoading(true);
      await techResolveRequest(request);
      setIsChanged(true);
      setLoading(false);
      setShowConfirmation(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
      setShowConfirmation(false);
    }
  };

  const handleWithdraw = async () => {
    try {
      setLoading(true);
      await techWithdrawRequest(request);
      setIsChanged(true);
      setLoading(false);
      setShowConfirmation(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
      setShowConfirmation(false);
    }
  };

  return (
    <div className="flex flex-col border-t-2">
      <div className="font-sm mb-2 font-bold">
        {confirmationType === "Resolve"
          ? "Are you sure you want to resolve this request?"
          : confirmationType === "Withdraw"
          ? "Are you sure you want to withdraw from this request?"
          : "Oops"}
      </div>
      <div className="flex flex-col sm:flex-row">
        <button
          className="bg-blue-500 text-white hover:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          type="button"
          onClick={() => setShowConfirmation(false)}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          className="text-red-500 bg-white hover:bg-gray-200 font-bold uppercase px-6 py-3 rounded text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          type="button"
          onClick={handleConfirm}
          disabled={loading}
        >
          {confirmationType === "Resolve"
            ? "Resolve"
            : confirmationType === "Withdraw"
            ? "Withdraw"
            : "Oops"}
        </button>
      </div>
    </div>
  );
};

export default TechConfirmation;
