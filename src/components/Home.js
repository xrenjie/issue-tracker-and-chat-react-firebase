import laptopgood from "../img/computer_note_good.png";
import computerdesktopbad from "../img/computer_desktop_bad.png";
import computerjisakubunkai from "../img/computer_jisaku_bunkai.png";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="content-center text-center items-center">
      <div className="Home bg-blue-400 text-white">
        <div className="pt-24">
          <div className="container px-3 mx-auto flex flex-wrap flex-col md:flex-row items-center">
            {/* <div className="flex flex-col w-full md:w-2/5 justify-center items-start text-center md:text-left mb-32"> */}
            <div className="container flex flex-col items-center max-w-5xl md:w-2/5 md:text-left mx-auto m-8 md:items-start">
              <h1 className="my-4 text-5xl font-bold leading-tight">
                Large or small, your business deserves reliable, professional
                support for all your tech needs.
              </h1>
              <h3 className="leading-normal text-2xl mb-8">
                Technology is a part of your business. We can help you with
                that.
              </h3>
              <div className="flex gap-5 flex-wrap sm:flex-row flex-col content-evenly">
                <Link to="/techsignup">
                  <button className="bg-blue-800 rounded p-4 font-bold hover:bg-blue-900">
                    Become a Technician
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="bg-white text-black rounded p-4 font-bold hover:bg-gray-200">
                    Register a Business
                  </button>
                </Link>
              </div>
            </div>
            <div className="w-full md:w-3/5 py-6 text-center">
              <img
                className="w-full md:w-4/5 z-50"
                src={laptopgood}
                alt="laptop"
              />
            </div>
          </div>
        </div>
        <div className="relative -mt-12 lg:-mt-24">
          <svg
            viewBox="0 0 1428 174"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
              <g
                transform="translate(-2.000000, 44.000000)"
                fill="#0000000"
                fillRule="nonzero"
              >
                <path
                  d="M0,0 C90.7283404,0.927527913 147.912752,27.187927 291.910178,59.9119003 C387.908462,81.7278826 543.605069,89.334785 759,82.7326078 C469.336065,156.254352 216.336065,153.6679 0,74.9732496"
                  opacity="0.100000001"
                ></path>
                <path
                  d="M100,104.708498 C277.413333,72.2345949 426.147877,52.5246657 546.203633,45.5787101 C666.259389,38.6327546 810.524845,41.7979068 979,55.0741668 C931.069965,56.122511 810.303266,74.8455141 616.699903,111.243176 C423.096539,147.640838 250.863238,145.462612 100,104.708498 Z"
                  opacity="0.100000001"
                ></path>
                <path
                  d="M1046,51.6521276 C1130.83045,29.328812 1279.08318,17.607883 1439,40.1656806 L1439,120 C1271.17211,77.9435312 1140.17211,55.1609071 1046,51.6521276 Z"
                  id="Path-4"
                  opacity="0.200000003"
                ></path>
              </g>
              <g
                transform="translate(-4.000000, 76.000000)"
                fill="#FFFFFF"
                fillRule="nonzero"
              >
                <path d="M0.457,34.035 C57.086,53.198 98.208,65.809 123.822,71.865 C181.454,85.495 234.295,90.29 272.033,93.459 C311.355,96.759 396.635,95.801 461.025,91.663 C486.76,90.01 518.727,86.372 556.926,80.752 C595.747,74.596 622.372,70.008 636.799,66.991 C663.913,61.324 712.501,49.503 727.605,46.128 C780.47,34.317 818.839,22.532 856.324,15.904 C922.689,4.169 955.676,2.522 1011.185,0.432 C1060.705,1.477 1097.39,3.129 1121.236,5.387 C1161.703,9.219 1208.621,17.821 1235.4,22.304 C1285.855,30.748 1354.351,47.432 1440.886,72.354 L1441.191,104.352 L1.121,104.031 L0.457,34.035 Z"></path>
              </g>
            </g>
          </svg>
        </div>
      </div>
      <section id="about" className="bg-white text-black border-b py-8">
        <div className="container flex flex-col items-center max-w-5xl mx-auto m-8 md:items-center">
          <h1 className="w-full my-2 text-5xl font-bold leading-tight text-center text-gray-800">
            About Us
          </h1>
          <div className="flex flex-wrap items-center md:flex-row flex-col">
            <div className="w-5/6 sm:w-1/2 p-6">
              <h3 className="text-3xl text-gray-800 font-bold leading-none mb-3">
                What do we do?
              </h3>
              <p className="text-gray-600 mb-8">
                We partner with IT industry experts to provide the best service
                to small businesses which expect 24/7 on-site support without
                having to hire 24/7 technicians.
                <br />
                <br />
              </p>
            </div>
            <img
              src={computerdesktopbad}
              className="w-full sm:w-1/2"
              alt="computer desktop"
            />
          </div>
          <div className="flex flex-wrap items-center md:flex-row flex-col">
            <img
              src={computerjisakubunkai}
              className="w-full sm:w-1/2"
              alt="computer desktop"
            />
            <div className="w-5/6 sm:w-1/2 p-6">
              <h3 className="text-3xl text-gray-800 font-bold leading-none mb-3">
                Service when you need it
              </h3>
              <p className="text-gray-600 mb-8">
                Make a request and one of our experts will be there to help you
                ASAP. You don't need to hire a 24/7 support team. We'll be there
                when you need us.
                <br />
                <br />
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="bg-white text-black border-b py-8">
        <div className="container flex flex-col items-center max-w-5xl mx-auto m-8">
          <h1 className="w-full my-2 text-5xl font-bold leading-tight text-center text-gray-800">
            Ready to get started?
          </h1>

          <div className="flex flex-wrap flex-col sm:flex-row gap-5 items-center my-10">
            <Link to="/techsignup">
              <button className="bg-blue-800 rounded p-4 font-bold hover:bg-blue-900 text-white">
                Become a Technician
              </button>
            </Link>
            <Link to="/signup">
              <button className="bg-white text-black rounded p-4 font-bold hover:bg-gray-200 border-black border-2">
                Register a Business
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
