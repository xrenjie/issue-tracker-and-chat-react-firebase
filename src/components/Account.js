import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";

const CustAccount = () => {
  const { user, login, changePassword, changeEmail } = useAuth();
  const [email, setEmail] = useState(user.email);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setEmail(user.email);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      alert("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await login(user.email, currentPassword);
      //login successful
      await changePassword(newPassword);
      await changeEmail(email);
      setSuccess(true);
      setNewPassword("");
      setConfirmNewPassword("");
      setCurrentPassword("");
    } catch (err) {
      alert("Password is wrong");
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="bg-white mx-auto max-w-sm shadow-lg rounded-lg overflow-hidden mt-40">
        <div className="sm:flex sm:items-center px-6 py-4">
          <div className="mb-4">
            <p className="text-xl leading-tight">Your Account</p>
            <form className="mt-6 flex flex-col gap-2">
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email"
                value={email}
              />
              <label htmlFor="newPassword" className="sr-only">
                New Password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="newPassword"
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="New Password"
                value={newPassword}
              />
              <label htmlFor="confirmNewPassword" className="sr-only">
                Confirm New Password
              </label>
              <input
                id="confirmNewPassword"
                name="confirmNewPassword"
                type="confirmNewPassword"
                autoComplete="confirmNewPassword"
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Confirm New Password"
                value={confirmNewPassword}
              />
              <label htmlFor="currentPassword" className="sr-only">
                Current Password
              </label>
              <input
                id="currentPassword"
                name="currentPassword"
                type="currentPassword"
                autoComplete="currentPassword"
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Current Password"
                value={currentPassword}
              />
              <div>
                <button
                  className="bg-blue-500 text-white hover:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  Save
                </button>
                {success ? (
                  <p className="text-green-500">Successfully saved</p>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustAccount;
