import React from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const PageNotFound = () => {
  const navigate = useNavigate();

  const handleReturnHome = () => {
    const accessToken = Cookies.get("access_token");
    const isAdmin = Cookies.get("secret_key") === "urdsds3987@#$%&!";

    if (accessToken && isAdmin) {
      navigate("/admin/dashboard");
    } else if (accessToken) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-800">404</h1>
      <p className="text-xl text-gray-600">Page Not Found</p>
      <button
        onClick={handleReturnHome}
        className="mt-4 px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
      >
        Return to Home
      </button>
    </div>
  );
};

export default PageNotFound;