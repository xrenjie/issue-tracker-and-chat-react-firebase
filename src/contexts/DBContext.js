import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  deleteDoc,
  orderBy,
  limit,
  runTransaction,
} from "firebase/firestore";

export const DBContext = createContext();

export function useDB() {
  return useContext(DBContext);
}

export const DBProvider = ({ children }) => {
  const [isChanged, setIsChanged] = useState(false);
  // const [requests, setRequests] = useState([]);

  async function addNewRequest(request) {
    const docRef = await addDoc(collection(db, "requests"), request);
    return docRef.id;
  }

  async function getRequests(uid) {
    let requests = [];
    const q = query(collection(db, "requests"), where("user", "==", uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let r = doc.data();
      r.reqId = doc.id;
      requests = [...requests, r];
    });
    return requests;
  }

  async function deleteRequest(reqId) {
    await deleteDoc(doc(db, "requests", reqId));
  }

  async function newUser(user) {
    const docRef = await addDoc(collection(db, "users"), user);
    return docRef.id;
  }

  async function getUser(uid) {
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs[0].data();
  }

  async function techGetNewRequest(uid) {
    let request;
    try {
      await runTransaction(db, async (transaction) => {
        const q = query(
          collection(db, "requests"),
          orderBy("date"),
          where("status", "==", "new"),
          where("tech", "==", "none"),
          limit(1)
        );
        const results = await getDocs(q);
        if (results.empty) return;

        request = results.docs[0];
        if (request.data().tech === "none") {
          transaction.update(results.docs[0].ref, { tech: uid });
          console.log("updated");
        } else {
          console.log("not updated");
          return Promise.reject({ message: "Get new requests failed", err: 1 });
        }
        return { message: "Success", err: -1 };
      });
    } catch (e) {
      console.log(e);
    }
    return request;
  }

  async function techRejectRequest(reqId) {
    const docRef = doc(db, "requests", reqId);

    await runTransaction(db, async (transaction) => {
      transaction.update(docRef, {
        status: "new",
        tech: "none",
        techEmail: "none",
      });
    });
  }

  async function techAcceptRequest(uid, email, reqId) {
    const docRef = doc(db, "requests", reqId);

    await runTransaction(db, async (transaction) => {
      transaction.update(docRef, {
        status: "accepted",
        tech: uid,
        techEmail: email,
      });
    });
  }

  async function techGetPendingRequests(uid) {
    let requests = [];
    const q = query(
      collection(db, "requests"),
      where("tech", "==", uid),
      where("status", "==", "new")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let r = doc.data();
      r.reqId = doc.id;
      requests = [...requests, r];
    });
    return requests;
  }

  async function techGetAcceptedRequests(uid) {
    let requests = [];
    const q = query(
      collection(db, "requests"),
      where("tech", "==", uid),
      where("status", "==", "accepted")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let r = doc.data();
      r.reqId = doc.id;
      requests = [...requests, r];
    });
    return requests;
  }

  async function techWithdrawRequest(reqId) {
    const docRef = doc(db, "requests", reqId);

    await runTransaction(db, async (transaction) => {
      transaction.update(docRef, {
        status: "new",
        tech: "none",
        techEmail: "none",
      });
    });
  }

  useEffect(() => {}, []);

  const value = {
    addNewRequest,
    getRequests,
    deleteRequest,
    isChanged,
    setIsChanged,
    newUser,
    getUser,
    techGetNewRequest,
    techRejectRequest,
    techAcceptRequest,
    techGetPendingRequests,
    techGetAcceptedRequests,
    techWithdrawRequest,
  };

  return <DBContext.Provider value={value}>{children}</DBContext.Provider>;
};
