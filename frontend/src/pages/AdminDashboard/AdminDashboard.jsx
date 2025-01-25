import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlices.js";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      <h1>Welcome, {user?.name}. Your role is: {user?.role}</h1>
      <Link to='/admin/add-blogs'>Add Blog</Link>

      <Link to='/user/view-blogs'>view blog</Link>
      <button onClick={handleLogout}>Logout</button>
    </>
  );
};



export default AdminDashboard
