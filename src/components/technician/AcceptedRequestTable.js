import Table from "react-tailwind-table";
import { useDB } from "../../contexts/DBContext";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

const AcceptedRequestTable = () => {
  const { user } = useAuth();
  const {
    techGetAcceptedRequests,
    techWithdrawRequest,
    isChanged,
    setIsChanged,
  } = useDB();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      await getRows().then((res) => {
        if (isMounted) {
          setRequests(res);
        }
      });
    }
    fetchData();
    setIsChanged(false);
    return () => {
      isMounted = false;
    };
  }, [isChanged]);

  const getRows = async () => {
    let req = await techGetAcceptedRequests(user.uid);
    req.map((r) => {
      let k = r;
      k.date = String(k.date.toDate()).split(" ").slice(0, 4).join(" ");
      return k;
    });
    return req;
  };

  const getCols = () => {
    return [
      { field: "date", use: "Date" },
      { field: "issue", use: "Issue" },
      { field: "status", use: "Status" },
      { field: "email", use: "Client Email" },
    ];
  };

  const handleAction = async (action, rows) => {
    if (action === "Withdraw") {
      rows.forEach((row) => {
        async function del() {
          try {
            await techWithdrawRequest(row.reqId);
          } catch (e) {
            console.log(e);
          }
        }
        del();
      });
    }
    let isMounted = true;
    async function fetchData() {
      await getRows().then((res) => {
        if (isMounted) {
          setRequests(res);
        }
      });
    }
    await fetchData();
    setIsChanged(true);
    return () => {
      isMounted = false;
    };
  };

  return (
    <div>
      <Table
        should_export={false}
        columns={getCols()}
        rows={requests}
        per_page={20}
        bulk_select_options={["Withdraw"]}
        bulk_select_button_text="Apply"
        on_bulk_action={handleAction}
      />
    </div>
  );
};

export default AcceptedRequestTable;
