import React, { useState } from "react";
import { Phone, Loader } from "lucide-react";
import toast from "react-hot-toast";

export function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    mailId: "",
    comment: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/support/callbacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to submit request");

      toast.success("Callback request submitted successfully!");
      setFormData({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        mailId: "",
        comment: "",
      });
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Request a Callback
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Have questions? Let us call you back and help you choose the right course.
          </p>
        </div>
        <div className="mt-12 max-w-lg mx-auto">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number (India)</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 flex items-center">
                  <span className="text-gray-500 sm:text-sm px-3">+91</span>
                </div>
                <input
                  type="tel"
                  name="phoneNumber"
                  required
                  pattern="[0-9]{10}"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="block w-full pl-14 pr-3 py-2 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 px-4"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                name="mailId"
                required
                value={formData.mailId}
                onChange={handleChange}
                placeholder="Enter your email address"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Your Query</label>
              <textarea
                name="comment"
                rows={4}
                value={formData.comment}
                onChange={handleChange}
                placeholder="Tell us how we can help you..."
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={loading}
              >
                {loading ? (
                  <Loader className="h-6 w-6 animate-spin text-white" />
                ) : (
                  <Phone className="h-5 w-5 mr-2" />
                )}
                {loading ? "Submitting..." : "Request Callback"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
