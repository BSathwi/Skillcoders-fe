import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Navbar from "./Navbar";
import { Loader } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/auth/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mail_id: email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      Cookies.set("access_token", data.token, { expires: 7 / 24 });
      Cookies.set("username", data.username, { expires: 7 / 24 });
      const adminSecretCode = data.admin ? "urdsds3987@#$%&!" : "normal_user";
      Cookies.set("secret_key", adminSecretCode, { expires: 7 / 24 });

      if (data.admin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center p-6 mt-16">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-center text-3xl font-bold text-gray-800">
            Welcome Back
          </h2>
          <p className="text-center text-gray-500 mt-2">
            Sign in to your account
          </p>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                id="email"
                placeholder="Enter Your Email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter Your Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 flex justify-center items-center bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? (
                <Loader className="h-6 w-6 animate-spin text-indigo-600" />
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="text-center text-gray-500 mt-4">
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-600 font-semibold">
              Register
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
