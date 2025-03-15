import React, { useState } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

const InternshipForm = () => {
  const [formData, setFormData] = useState({
    name: Cookies.get("username") || "",
    mail_id: "",
    phone_number: "",
    college: "",
    year_of_passout: "2025",
    branch: "B.Tech",
    domain: "",
  });

  const [loading, setLoading] = useState(false); // Loader state

  const domains = [
    "Artificial Intelligence", "Web Development", "Cloud Computing",
    "Cybersecurity", "Data Science", "Blockchain", "Machine Learning",
    "DevOps", "UI/UX Design", "Game Development", "Mobile App Development",
    "Internet of Things (IoT)", "Embedded Systems", "Networking",
    "Big Data", "Software Testing", "Business Intelligence",
    "Automation", "Database Management", "Full Stack Development",
  ];

  const years = Array.from({ length: 11 }, (_, i) => (2025 + i).toString());

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token=Cookies.get("access_token");
  
    try {
      const response = await fetch("http://localhost:5000/intern/submit-internship/", {
        method: "POST",
        headers: { "Content-Type": "application/json",Authorization:`Bearer ${token}` },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json(); 
  
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }
  
      toast.success("Your application was submitted successfully!");
      setFormData({
        name: Cookies.get("username") || "",
        mail_id: "",
        phone_number: "",
        college: "",
        year_of_passout: "2025",
        branch: "B.Tech",
        domain: "",
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg mt-32 shadow-lg">
        <h2 className="text-2xl font-bold text-violet-700 mb-4 text-center">
          Internship Application
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              readOnly
              className="w-full border rounded-lg px-4 py-2 bg-gray-100 text-gray-700 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-1">Email</label>
            <input
              type="email"
              name="mail_id"
              value={formData.mail_id}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full border rounded-lg px-4 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-1">Mobile Number</label>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="Enter your mobile number"
              className="w-full border rounded-lg px-4 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-1">College Name</label>
            <input
              type="text"
              name="college"
              value={formData.college}
              onChange={handleChange}
              placeholder="Enter your college name"
              className="w-full border rounded-lg px-4 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-1">Year of Passout</label>
            <select
              name="year_of_passout"
              value={formData.year_of_passout}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
              required
            >
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-1">Branch</label>
            <select
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
              required
            >
              <option value="B.Tech">B.Tech</option>
              <option value="ECE">ECE</option>
              <option value="Mech">Mech</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-1">Domain</label>
            <select
              name="domain"
              value={formData.domain}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
              required
            >
              <option value="" disabled>Select a domain</option>
              {domains.map((domain) => (
                <option key={domain} value={domain}>{domain}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-600 text-white py-2 rounded-lg font-semibold flex items-center justify-center space-x-2 disabled:bg-violet-400"
          >
            {loading ? (
              <>
                <Loader className="h-6 w-6 animate-spin text-indigo-600" />
              </>
            ) : (
              "Submit Application"
            )}
          </button>
        </form>
      </div>
    </>
  );
};

export default InternshipForm;
