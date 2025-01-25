import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlices.js";

const UserDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      <h1>Welcome, {user?.name}. Your role is: {user?.role}</h1>
      <button onClick={handleLogout}>Logout</button>
    </>
  );
};




export default UserDashboard