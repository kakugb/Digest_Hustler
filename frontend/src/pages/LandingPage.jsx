import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../redux/slices/authSlices.js";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [showSignUpPopup, setShowSignUpPopup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  // const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((state) => state.auth);

  const SIGNUP_API = "http://localhost:5000/api/auth/signup";
  const SIGNIN_API = "http://localhost:5000/api/auth/login";

  // Handle input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


useEffect(()=>{
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  if (loggedInUser) {
    if (loggedInUser.role === "admin") {
      return navigate("/admin/admin-dashboard");
    }
    return navigate("/user/user-dashboard");
  }
},[])

  //Signup logicx
  const handleSignUp = async (e) => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      const response = await axios.post(SIGNUP_API, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      dispatch(
        loginSuccess({ user: response.data.user, token: response.data.token })
      );
      setMessage("Sign up successful. Please log in!");
      setShowSignUpPopup(false);
      setShowPopup(true);
    } catch (error) {
      dispatch(
        loginFailure(error.response?.data?.message || "Sign up failed!")
      );
    }
  };

  // Signin Logix
  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(SIGNIN_API, {
        email: formData.email,
        password: formData.password,
      });

      const userData = {
        token: response.data.token,
        role: response.data?.user.role,
        name: response.data?.user.name,
      };

      localStorage.setItem("user", JSON.stringify(userData));

      dispatch(loginSuccess(userData));
      if (userData.role === "admin") {
        navigate("/admin/admin-dashboard");
      } else if (userData.role === "user") {
        navigate("/user/user-dashboard");
      } else {
        navigate("/dashboard");
      }
      setMessage(response.data.message);
      setShowPopup(false);
    } catch (error) {
      dispatch(loginFailure(error.response?.data?.message || "Login failed!"));
    }
  };


  const togglePopup = () => {
    setShowPopup(!showPopup);
    setMessage("");
  };

  const toggleSignUpPopup = () => {
    setShowPopup(false);
    setShowSignUpPopup(!showSignUpPopup);
    setMessage("");
  };

  const toggleSignInPopup = () => {
    setShowPopup(true);
    setShowSignUpPopup(false);
    setMessage("");
  };
  return (
    <div className="bg-[#F2F2E9] min-h-screen flex flex-col justify-between relative">
      {/* Header */}
      <header className="flex justify-between items-center py-6 px-8 border-b border-gray-200 border border-b-black">
        <h1 className="text-4xl font-bold text-black">Digest Hustler</h1>
        <nav className="flex items-center gap-6 text-gray-700">
          {/* Visible only on larger screens */}
          <div className="hidden md:flex gap-6">
            <a href="#" className="hover:text-black">
              Our story
            </a>
            <a href="#" className="hover:text-black">
              Membership
            </a>
            <a href="#" className="hover:text-black">
              Write
            </a>
          </div>

          {/* Sign in link to open popup */}
          <a href="#" className="hover:text-black" onClick={togglePopup}>
            Sign in
          </a>
          <button className="bg-black text-white px-4 py-2 rounded-full">
            Get started
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="text-start py-20 px-8">
        <h2 className="text-8xl font-serif font-bold leading-tight text-gray-900">
          Human <br /> stories & ideas
        </h2>
        <p className="text-2xl text-gray-700 mt-4 font-semibold">
          A place to read, write, and deepen your understanding
        </p>
        <button className="mt-8 bg-black text-white text-lg font-medium px-6 py-3 rounded-full">
          Start reading
        </button>
      </section>

      {/* Sign-in Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xs shadow-md shadow-blue-400">
          <div className="bg-white p-10 rounded-lg shadow-lg w-[400px] relative">
            <button
              className="absolute top-3 right-3 text-2xl font-bold"
              onClick={togglePopup}
            >
              &times;
            </button>
            <h2 className="text-3xl font-semibold mb-6 text-center">
              Welcome Back
            </h2>
            {message && <p className="text-red-500 text-center">{message}</p>}
            <form className="flex flex-col gap-6" onSubmit={handleSignIn}>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="border-2 p-3 rounded-lg"
                onChange={handleInputChange}
              />
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="border-2 p-3 rounded-lg"
                onChange={handleInputChange}
              />
              <button
                className="bg-black text-white py-3 rounded-full"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>
            <p className="text-center mt-4">
              Don't have an account?{" "}
              <a
                href="#"
                className="text-black font-semibold"
                onClick={toggleSignUpPopup}
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Sign-up Popup Modal */}
      {showSignUpPopup && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xs shadow-md shadow-blue-400">
          <div className="bg-white p-10 rounded-lg shadow-lg w-[400px] relative">
            <button
              className="absolute top-3 right-3 text-2xl font-bold"
              onClick={toggleSignUpPopup}
            >
              &times;
            </button>
            <h2 className="text-3xl font-semibold mb-6 text-center">
              Create Your Account
            </h2>
            {message && <p className="text-red-500 text-center">{message}</p>}
            <form className="flex flex-col gap-6" onSubmit={handleSignUp}>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                className="border-2 p-3 rounded-lg"
                onChange={handleInputChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="border-2 p-3 rounded-lg"
                onChange={handleInputChange}
              />
              <input
                type="password"
                name="password"
                placeholder="Create a password"
                className="border-2 p-3 rounded-lg"
                onChange={handleInputChange}
              />
              <button
                className="bg-black text-white py-3 rounded-full"
                disabled={loading}
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </button>
            </form>
            <p className="text-center mt-4">
              Already have an account?{" "}
              <a
                href="#"
                className="text-black font-semibold"
                onClick={toggleSignInPopup}
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t py-6 px-10 text-sm text-gray-600 flex justify-center flex-wrap gap-6 border border-b-black">
        <a href="#">Help</a>
        <a href="#">Status</a>
        <a href="#">About</a>
        <a href="#">Careers</a>
        <a href="#">Press</a>
        <a href="#">Blog</a>
        <a href="#">Privacy</a>
        <a href="#">Terms</a>
        <a href="#">Text to speech</a>
        <a href="#">Teams</a>
      </footer>
    </div>
  );
};

export default LandingPage;
