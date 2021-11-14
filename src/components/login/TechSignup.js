import { Link, useNavigate, Navigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useDB } from "../../contexts/DBContext";

const TechSignup = () => {
  const { newUser } = useDB();
  const { signup, user, setRole } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (email === "") {
      alert("Email is required");
      return;
    }
    if (password === "") {
      alert("Password is required");
      return;
    }
    if (confirmPassword === "") {
      alert("Confirm Password is required");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      setLoading(true);
      const u = await signup(email, password);
      const newuser = { uid: u.user.uid, role: "technician" };
      await newUser(newuser);
      // setRole("technician");
      navigate("/dashboard");
    } catch (error) {
      alert("Failed to create account");
    }
    setLoading(false);
  };

  return user === null ? (
    <div className="mt-32 min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/">
            <div className="text-4xl text-purple-700 font-black">
              TechGather
            </div>
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Become a Technician
          </h2>
        </div>
        <div className="mt-8 space-y-6 items-center" action="#">
          <div className="rounded-md shadow-sm -space-y-px">
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
            />

            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password"
            />

            <input
              id="password-confirm"
              name="password-confirm"
              type="password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Enter Password Again"
            />
          </div>

          <button
            disabled={loading}
            onClick={handleSignup}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Register
          </button>

          <div className="text-sm ">
            Already have an account?
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500 mx-2"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/dashboard" />
  );
};

export default TechSignup;
