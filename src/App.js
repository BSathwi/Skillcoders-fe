import React, { useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import Navbar from "./components/Navbar";
import AdminNavbar from "./components/Admin/Navbar";
import Footer from "./components/Footer";
import { Hero } from "./components/Landing";
import Login from "./components/Login";
import Register from "./components/Register";
import { Toaster } from "react-hot-toast";
import Dashboard from "./components/Dashboard";
import Cart from "./components/Cart";
import Courses from "./components/Courses";
import { Loader } from "lucide-react";
import AdminDashboard from "./components/Admin/Dashboard";
import UserStatus from "./components/Admin/UserStatus";
import Callbacks from "./components/Admin/Callbacks";
import AddCourse from "./components/Admin/AddCourse";
import InternshipForms from "./components/Admin/InternshipForm";
import AdminSidebar from "./components/Admin/Sidebar";
import InternshipForm from "./components/Intenships";
import PageNotFound from "./components/PageNotFound";

const ProtectedUserRoute = ({ element }) => {
  const accessToken = Cookies.get("access_token");
  const isAdmin = Cookies.get("secret_key") === "urdsds3987@#$%&!";
  if (isAdmin) return <Navigate to="/admin/dashboard" />;
  return accessToken ? element : <Navigate to="/login" />;
};

const ProtectedAdminRoute = ({ element }) => {
  const accessToken = Cookies.get("access_token");
  const isAdmin = Cookies.get("secret_key") === "urdsds3987@#$%&!";

  if (!accessToken) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/dashboard" />;

  return element;
};

const UserLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen bg-gray-50">
    <Navbar />
    <div className="flex flex-1 overflow-hidden">
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
    <Footer />
  </div>
);

const AdminLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  if (isMobile) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Please open this page on a desktop device.
          </h1>
          <p className="text-gray-600">
            The admin interface is not optimized for mobile or tablet devices.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <AdminNavbar />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </div>
    </div>
  );
};

const App = () => {
  const [loading, setLoading] = useState(true);
  const isDataFetched = useRef(false); 

  useEffect(() => {
    if (isDataFetched.current) return; 
    isDataFetched.current = true;

    const accessToken = Cookies.get("access_token");

    if (!accessToken) {
      setLoading(false);
      return;
    }

    fetch("http://localhost:5000/auth/api/user/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.admin !== undefined) {
          Cookies.set("secret_key", data.admin ? "urdsds3987@#$%&!" : "normal_user", { expires: 7 / 24 });
        }
      })
      .catch(() => {
        Cookies.remove("access_token");
        Cookies.remove("secret_key");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            Cookies.get("access_token") ? (
              Cookies.get("secret_key") === "urdsds3987@#$%&!" ? (
                <Navigate to="/admin/dashboard" />
              ) : (
                <Navigate to="/dashboard" />
              )
            ) : (
              <Hero />
            )
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedUserRoute element={<UserLayout><Dashboard /></UserLayout>} />} />
        <Route path="/cartItems" element={<ProtectedUserRoute element={<UserLayout><Cart /></UserLayout>} />} />
        <Route path="/courses" element={<UserLayout><Courses /></UserLayout>} />
        <Route path="/internships" element={<ProtectedUserRoute element={<UserLayout><InternshipForm /></UserLayout>} />} />

        <Route path="/admin/dashboard" element={<ProtectedAdminRoute element={<AdminLayout><AdminDashboard /></AdminLayout>} />} />
        <Route path="/admin/add-course" element={<ProtectedAdminRoute element={<AdminLayout><AddCourse /></AdminLayout>} />} />
        <Route path="/admin/user-status" element={<ProtectedAdminRoute element={<AdminLayout><UserStatus /></AdminLayout>} />} />
        <Route path="/admin/internship-forms" element={<ProtectedAdminRoute element={<AdminLayout><InternshipForms /></AdminLayout>} />} />
        <Route path="/admin/callbacks" element={<ProtectedAdminRoute element={<AdminLayout><Callbacks /></AdminLayout>} />} />

        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Toaster position="top-center" reverseOrder={false} />
    </Router>
  );
};

export default App;