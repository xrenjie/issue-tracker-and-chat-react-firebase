import Table from "react-tailwind-table";
import { useDB } from "../../contexts/DBContext";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

const RequestTable = () => {
  const { user } = useAuth();
  const { getRequests, deleteRequest, isChanged, setIsChanged } = useDB();
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
  }, [isChanged, setIsChanged]);

  const getRows = async () => {
    let req = await getRequests(user.uid);
    req.map((r) => {
      let k = r;
      k.date = String(k.date.toDate()).split(" ").slice(0, 4).join(" ");

      if (k.techEmail === "none") {
        k.tech = "Not Assigned";
      }
      return k;
    });
    return req;
  };

  const getCols = () => {
    return [
      { field: "date", use: "Date" },
      { field: "issue", use: "Issue" },
      { field: "status", use: "Status" },
      { field: "techEmail", use: "Assigned Technician" },
    ];
  };

  const handleAction = async (action, rows) => {
    if (action === "Delete") {
      rows.forEach((row) => {
        async function del() {
          try {
            await deleteRequest(row.reqId);
          } catch (e) {}
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
    fetchData();
    setIsChanged(true);
    return () => {
      isMounted = false;
    };
  };

  return (
    <Table
      should_export={false}
      columns={getCols()}
      rows={requests}
      per_page={20}
      bulk_select_options={["Delete"]}
      bulk_select_button_text="Apply"
      on_bulk_action={handleAction}
    />
  );
};

export default RequestTable;
