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
  updateDoc,
} from "firebase/firestore";
import { useAuth } from "./AuthContext";

export const DBContext = createContext();

export function useDB() {
  return useContext(DBContext);
}

export const DBProvider = ({ children }) => {
  const { setRole } = useAuth();
  const [isChanged, setIsChanged] = useState(false);
  const [chatChanged, setChatChanged] = useState(false);
  const [newRequests, setNewRequests] = useState([]);
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [resolvedRequests, setResolvedRequests] = useState([]);
  // const [requests, setRequests] = useState([]);

  async function addNewRequest(request) {
    const docRef = await addDoc(
      collection(db, "users", request.uid, "requests"),
      request
    );
    return docRef.id;
  }

  async function getNewRequests(uid) {
    console.log("get new requests");
    let requests = [];
    const q = query(
      collection(db, "users", uid, "requests"),
      where("status", "==", "New"),
      orderBy("date", "desc")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let r = doc.data();
      r.reqId = doc.id;
      requests = [...requests, r];
    });

    return requests;
  }

  async function getResolvedRequests(uid) {
    let requests = [];
    const q2 = query(
      collection(db, "users", uid, "requests"),
      where("status", "==", "Resolved"),
      orderBy("lastMessage", "desc")
    );
    const querySnapshot2 = await getDocs(q2);
    querySnapshot2.forEach((doc) => {
      let r = doc.data();
      r.reqId = doc.id;
      requests = [...requests, r];
    });
    return requests;
  }

  async function getAcceptedRequests(uid) {
    let requests = [];
    const q = query(
      collection(db, "users", uid, "requests"),
      where("status", "==", "Accepted"),
      orderBy("lastMessage", "desc")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let r = doc.data();
      r.reqId = doc.id;
      requests = [...requests, r];
    });
    return requests;
  }

  async function getMessages(customerUid, requestId) {
    let messages = [];
    const q = query(
      collection(db, "users", customerUid, "requests", requestId, "messages"),
      orderBy("date", "desc"),
      limit(20)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let m = doc.data();
      m.date = String(m.date.toDate());
      m.id = doc.id;
      messages = [...messages, m];
    });
    return messages;
  }

  async function sendMessage(customerUid, requestId, message, author) {
    const docRef = await addDoc(
      collection(db, "users", customerUid, "requests", requestId, "messages"),
      { message: message, date: new Date(), email: author }
    );
    const requestDocRef = await doc(
      db,
      "users",
      customerUid,
      "requests",
      requestId
    );
    await updateDoc(requestDocRef, { lastMessage: new Date() });
    return docRef.id;
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
    // setIsChanged(true);
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
        lastMessage: new Date(),
      });
    });
  }

  async function techGetResolvedRequests(uid) {
    let requests = [];
    const q = query(
      collectionGroup(db, "requests"),
      where("techUid", "==", uid),
      where("status", "==", "Resolved"),
      orderBy("lastMessage", "desc")
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
      where("status", "==", "Accepted"),
      orderBy("lastMessage", "desc")
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
    getNewRequests,
    getAcceptedRequests,
    getResolvedRequests,
    deleteRequest,
    isChanged,
    setIsChanged,
    chatChanged,
    setChatChanged,
    newUser,
    getUser,
    techGetNewRequest,
    techRejectRequest,
    techAcceptRequest,
    techGetResolvedRequests,
    techGetAcceptedRequests,
    techWithdrawRequest,
    techResolveRequest,
    getMessages,
    sendMessage,
  };

  return <DBContext.Provider value={value}>{children}</DBContext.Provider>;
};
