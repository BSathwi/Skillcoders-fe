import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Navbar from "./Navbar";

const Register = () => {
  const navigate = useNavigate(); // Initialize navigation
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/auth/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.username,
          mail_id: formData.email,
          password: formData.password,
          phone_number: "+91"+formData.phone,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Registration successful!");
        setFormData({ username: "", email: "", password: "", phone: "" });
        setTimeout(() => navigate("/login"), 1000);
      } else {
        toast.error(data.message || "Registration failed!");
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
    <Navbar />
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-center text-3xl font-bold text-gray-800">Join Us Today</h2>
        <p className="text-center text-gray-500 mt-2">Create your account</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={formData.username}
              placeholder="Enter Your Username"
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter Your Email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
            <div className="mt-1 relative rounded-lg shadow-sm">
              <span className="absolute inset-y-0 left-0 flex items-center px-3 text-gray-500">+91</span>
              <input
                id="phone"
                name="phone"
                type="tel"
                pattern="[0-9]{10}"
                required
                value={formData.phone}
                onChange={handleChange}
                className="pl-12 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="1234567890"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter Your Password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition"
          >
            Register
          </button>
        </form>

        <p className="text-center text-gray-500 mt-4">
          Already have an account? <Link to="/login" className="text-indigo-600 font-semibold">Sign in</Link>
        </p>
      </div>
    </div>
    </>
  );
};

export default Register;
