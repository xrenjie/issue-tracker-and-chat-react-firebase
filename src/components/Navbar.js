import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  useEffect(() => {}, []);

  const handleToggle = () => {
    var navMenuDiv = document.getElementById("nav-content");

    if (navMenuDiv.classList.contains("hidden")) {
      navMenuDiv.classList.remove("hidden");
    } else {
      navMenuDiv.classList.add("hidden");
    }
  };

  const handleClose = () => {
    var navMenuDiv = document.getElementById("nav-content");
    navMenuDiv.classList.add("hidden");
  };

  return (
    <nav id="header" className="fixed w-full z-30 top-0 text-white bg-blue-500">
      <div className="navbar w-full container mx-auto flex flex-wrap items-center justify-between mt-0 py-2">
        {user === null ? (
          <div className="pl-4 flex items-center">
            <Link
              className="text-white no-underline hover:no-underline font-bold text-2xl"
              to={user ? "/dashboard" : "/"}
              onClick={handleClose}
            >
              TechGather
            </Link>
          </div>
        ) : (
          <div className="pl-4 flex items-center gap-10">
            <Link
              className="text-white no-underline hover:no-underline font-bold text-2xl "
              to={"/dashboard"}
              onClick={handleClose}
            >
              Home
            </Link>
            <Link
              className="text-white no-underline hover:no-underline font-bold text-2xl "
              to={"/dashboard/chat"}
              onClick={handleClose}
            >
              Chat
            </Link>
          </div>
        )}
        <div className="block m-1 lg:hidden pr-4">
          <button
            id="nav-toggle"
            className="flex items-center p-1 text-white hover:text-gray-900 focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
            onClick={handleToggle}
          >
            <svg
              className="fill-current h-6 w-6"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </button>
        </div>

        <div
          className="w-full bg-blue-500 hidden flex-grow lg:flex lg:items-center lg:w-auto mt-2 lg:mt-0 lg:bg-transparent text-black p-4 lg:p-0 z-20"
          id="nav-content"
        >
          <ul className="list-reset lg:flex justify-end flex-1 items-center">
            {user === null ? (
              <>
                <li className="mr-3">
                  <Link
                    className="inline-block py-2 px-4 text-white font-bold no-underline"
                    to="/"
                    onClick={handleClose}
                  >
                    Home
                  </Link>
                </li>
                <li className="mr-3">
                  <Link
                    className="inline-block text-white no-underline hover:text-gray-800 hover:text-underline py-2 px-4"
                    to="/signup"
                    onClick={handleClose}
                  >
                    Sign Up
                  </Link>
                </li>
                <li className="mr-3">
                  <Link
                    to="/login"
                    onClick={handleClose}
                    className="inline-block text-white no-underline hover:text-gray-800 hover:text-underline py-2 px-4"
                  >
                    Login
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="mr-3">
                  <Link
                    className="inline-block text-white no-underline hover:text-gray-800 hover:text-underline py-2 px-4"
                    to={"/dashboard"}
                    onClick={handleClose}
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="mr-3">
                  <Link
                    className="inline-block text-white no-underline hover:text-gray-800 hover:text-underline py-2 px-4"
                    to={"/dashboard/account"}
                    onClick={handleClose}
                  >
                    Account
                  </Link>
                </li>
                <li className="mr-3">
                  <button
                    className="inline-block text-white no-underline hover:text-gray-800 hover:text-underline py-2 px-4"
                    onClick={() => {
                      handleClose();
                      logout();
                    }}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
      <hr className="border-b border-gray-100 opacity-25 my-0 py-0" />
    </nav>
  );
};

export default Navbar;
