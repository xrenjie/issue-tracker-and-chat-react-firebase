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
  setDoc,
  getDoc,
  collectionGroup,
} from "firebase/firestore";

export const DBContext = createContext();

export function useDB() {
  return useContext(DBContext);
}

export const DBProvider = ({ children }) => {
  const [isChanged, setIsChanged] = useState(false);
  // const [requests, setRequests] = useState([]);

  async function addNewRequest(request) {
    const docRef = await addDoc(
      collection(db, "users", request.uid, "requests"),
      request
    );
    return docRef.id;
  }

  async function getRequests(uid) {
    let requests = [];
    const q = query(collection(db, "users", uid, "requests"));
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
    const docRef = await setDoc(doc(db, "users", user.uid), {
      role: user.role,
    });
    return docRef.id;
  }

  async function getUser(uid) {
    const docRef = doc(db, "users", uid);
    const docSnapshot = await getDoc(docRef);
    return docSnapshot.data();
  }

  async function techGetNewRequest(uid) {
    let request;
    try {
      await runTransaction(db, async (transaction) => {
        const q = query(
          collectionGroup(db, "requests"),
          orderBy("date"),
          where("status", "==", "new"),
          where("techUid", "==", "none"),
          limit(1)
        );
        const results = await getDocs(q);
        if (results.empty) return;
        request = results.docs[0];
        if (request.data().techUid === "none") {
          transaction.update(results.docs[0].ref, { techUid: uid });
        } else {
          return Promise.reject({ message: "Get new requests failed", err: 1 });
        }
        return { message: "Success", err: -1 };
      });
    } catch (e) {
      console.log(e);
    }
    return request;
  }

  async function techRejectRequest(reqId, uid) {
    const docRef = doc(db, "users", uid, "requests", reqId);

    await runTransaction(db, async (transaction) => {
      transaction.update(docRef, {
        status: "new",
        techUid: "none",
        techEmail: "none",
      });
    });
  }

  async function techAcceptRequest(techUid, techEmail, reqUid, reqId) {
    const docRef = doc(db, "users", reqUid, "requests", reqId);

    await runTransaction(db, async (transaction) => {
      transaction.update(docRef, {
        status: "accepted",
        techUid: techUid,
        techEmail: techEmail,
      });
    });
  }

  async function techGetPendingRequests(uid) {
    let requests = [];
    const q = query(
      collectionGroup(db, "users"),
      where("techUid", "==", uid),
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
      collectionGroup(db, "requests"),
      where("techUid", "==", uid),
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

  async function techWithdrawRequest(uid, reqId) {
    const docRef = doc(db, "users", uid, "requests", reqId);

    await runTransaction(db, async (transaction) => {
      transaction.update(docRef, {
        status: "new",
        techUid: "none",
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
