import React, { useEffect, useState } from "react";
import { FileText, CheckCircle, Loader } from "lucide-react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

export default function InternshipForms() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchForms = async () => {
      const token = Cookies.get("access_token");
      try {
        const res = await fetch("http://localhost:5000/intern/internship-forms", {
          method: "GET",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setForms(data);
      } catch (error) {
        console.error("Error fetching internship forms:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchForms();
  }, []);

  const handleMarkSelected = async (id, applicant_email , applicant_name, status) => {
    const token = Cookies.get("access_token");
    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:5000/auth/api/approve-internship", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          applicant_email,
          applicant_name,
          id,
          status,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setForms((prevForms) =>
          prevForms.map((form) =>
            form.id === id ? { ...form, status: "complete" } : form
          )
        );
        
        toast.success("Selected Student Name is " + applicant_name);
      } else {
        toast.error(data.message || "An error occurred");
      }
    } catch (error) {
      toast.error("Network error: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Internship Form Submissions</h1>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader className="h-6 w-6 animate-spin text-indigo-600" />
        </div>
      ) : forms.length === 0 ? (
        <div className="text-center text-gray-500 font-medium text-lg">
          No Internship Forms Available
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    College
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Domain
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Passout Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {forms.map((form) => (
                  <tr key={form.id}>
                    <td className="px-6 py-4 whitespace-nowrap flex items-center">
                      {form.user_image ? (
                        <img
                          src={form.user_image}
                          alt={form.name}
                          className="h-8 w-8 rounded-full object-cover mr-2"
                        />
                      ) : (
                        <div className="h-8 w-8 flex items-center justify-center bg-violet-600 text-white rounded-full mr-2">
                          {form.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="text-sm font-medium text-gray-900">{form.name}</span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {form.phone_number} <br />
                      <span className="text-gray-500">{form.email}</span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{form.college}</td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-violet-600 mr-2" />
                        <span className="text-sm font-medium text-gray-900">{form.domain}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{form.year_of_passout}</td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          form.status === "complete"
                            ? "bg-green-200 text-green-700"
                            : form.status === "Rejected"
                            ? "bg-red-200 text-red-700"
                            : "bg-yellow-200 text-yellow-700"
                        }`}
                      >
                        {form.status || "Pending"}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        className={`flex items-center ${
                          form.status === "complete"
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-green-600 hover:text-green-900"
                        }`}
                        onClick={() =>
                          handleMarkSelected(form.id, form.email, form.name, form.status)
                        }
                        disabled={form.status === "complete" || submitting}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        {submitting ? "Submitting" : "Mark Complete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}