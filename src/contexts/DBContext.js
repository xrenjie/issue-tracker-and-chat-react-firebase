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
import { useAuth } from "./AuthContext";

export const DBContext = createContext();

export function useDB() {
  return useContext(DBContext);
}

export const DBProvider = ({ children }) => {
  const { setRole } = useAuth();
  const [isChanged, setIsChanged] = useState(false);
  const [chatPartner, setChatPartner] = useState(null);
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
    console.log(querySnapshot.docs);
    querySnapshot.forEach((doc) => {
      let r = doc.data();
      r.reqId = doc.id;
      requests = [...requests, r];
    });
    return requests;
  }

  async function deleteRequest(req) {
    try {
      await deleteDoc(doc(db, "users", req.uid, "requests", req.reqId));
    } catch (e) {
      console.log(e);
    }
  }

  async function newUser(user) {
    const docRef = await setDoc(doc(db, "users", user.uid), {
      role: user.role,
    });
    setRole(user.role);
    setIsChanged(true);
    return docRef.id;
  }

  async function getUser(uid) {
    const docRef = doc(db, "users", uid);
    const docSnapshot = await getDoc(docRef);
    setRole(docSnapshot.data().role);
    setIsChanged(true);
    return docSnapshot.data();
  }

  async function techGetNewRequest(uid) {
    let request;
    try {
      await runTransaction(db, async (transaction) => {
        const q = query(
          collectionGroup(db, "requests"),
          orderBy("date"),
          where("status", "==", "New"),
          where("techUid", "==", "none"),
          limit(1)
        );
        const results = await getDocs(q);
        if (results.empty) return;
        request = results.docs[0].data();
        if (results.docs[0].data().techUid === "none") {
          transaction.update(results.docs[0].ref, { techUid: uid });
          request.reqId = results.docs[0].id;
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

  async function techRejectRequest(req) {
    console.log("ererer", req.reqId);
    const docRef = doc(db, "users", req.uid, "requests", req.reqId);

    await runTransaction(db, async (transaction) => {
      transaction.update(docRef, {
        status: "New",
        techUid: "none",
        techEmail: "none",
      });
    });
  }

  async function techAcceptRequest(user, req) {
    const docRef = doc(db, "users", req.uid, "requests", req.reqId);

    await runTransaction(db, async (transaction) => {
      transaction.update(docRef, {
        status: "Accepted",
        techUid: user.uid,
        techEmail: user.email,
      });
    });
  }

  async function techGetResolvedRequests(uid) {
    let requests = [];
    const q = query(
      collectionGroup(db, "requests"),
      where("techUid", "==", uid),
      where("status", "==", "Resolved")
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
      where("status", "==", "Accepted")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let r = doc.data();
      r.reqId = doc.id;
      requests = [...requests, r];
    });
    return requests;
  }

  async function techWithdrawRequest(req) {
    const docRef = doc(db, "users", req.uid, "requests", req.reqId);

    await runTransaction(db, async (transaction) => {
      transaction.update(docRef, {
        status: "New",
        techUid: "none",
        techEmail: "none",
      });
    });
  }

  async function techResolveRequest(req) {
    const docRef = doc(db, "users", req.uid, "requests", req.reqId);

    await runTransaction(db, async (transaction) => {
      transaction.update(docRef, {
        status: "Resolved",
      });
    });
  }

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
    techGetResolvedRequests,
    techGetAcceptedRequests,
    techWithdrawRequest,
    techResolveRequest,
    chatPartner,
    setChatPartner,
  };

  return <DBContext.Provider value={value}>{children}</DBContext.Provider>;
};
