import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import AddBlogs from "./pages/AdminDashboard/AddBlogs";
import UserDashboard from "./pages/UsersComponent/UserDashboard";
import ViewBlogs from "./pages/UsersComponent/ViewBlogs";
import UnauthPage from "./pages/UnauthPage";
import Notfound from "./pages/Notfound";
import ProtectedRoute from "./hooks/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />

        {/* Protected Routes for Admin */}
        <Route
          path="/admin/admin-dashboard"
          element={<ProtectedRoute element={<AdminDashboard />} requiredRole="admin" />}
        />
        <Route
          path="/admin/add-blogs"
          element={<ProtectedRoute element={<AddBlogs />} requiredRole="admin" />}
        />

        {/* Protected Routes for User */}
        <Route
          path="/user/user-dashboard"
          element={<ProtectedRoute element={<UserDashboard />} requiredRole="user" />}
        />
        <Route
          path="/user/view-blogs"
          element={<ProtectedRoute element={<ViewBlogs />} requiredRole="user" />}
        />

        {/* Unauthorized Page */}
        <Route path="/unauth-page" element={<UnauthPage />} />

        {/* Not Found Page */}
        <Route path="/not-found" element={<Notfound />} />
      </Routes>
    </Router>
  );
}

export default App;
