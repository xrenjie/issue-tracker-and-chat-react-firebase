import "../App.css";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Home from "./Home";
import TechSignup from "./login/TechSignup";
import Signup from "./login/Signup";
import Login from "./login/Login";
import Dashboard from "./Dashboard";
import PrivateRoute from "./PrivateRoute";
import { AuthProvider } from "../contexts/AuthContext";
import Account from "./Account";
import { DBProvider } from "../contexts/DBContext";
import Navbar from "./Navbar";
import Chat from "./chat/Chat";
import ForgotPassword from "./login/ForgotPassword";

function App() {
  return (
    <Router>
      <AuthProvider>
        <DBProvider>
          <Navbar />
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/signup" element={<Signup />} />
            <Route exact path="/techsignup" element={<TechSignup />} />
            <Route exact path="/forgotpassword" element={<ForgotPassword />} />
            <Route
              exact
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              exact
              path="/dashboard/account"
              element={
                <PrivateRoute>
                  <Account />
                </PrivateRoute>
              }
            />
            <Route
              exact
              path="dashboard/chat"
              element={
                <PrivateRoute>
                  <Chat />
                </PrivateRoute>
              }
            />
          </Routes>
        </DBProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
