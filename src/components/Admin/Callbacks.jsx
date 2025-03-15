import React, { useEffect, useState } from "react";
import { Phone, CheckCircle, Loader } from "lucide-react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

export default function Callbacks() {
  const [callbacks, setCallbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusLoader,setStatusLoader]=useState(false);

  useEffect(() => {
    const fetchCallbacks = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = Cookies.get("access_token");
        const response = await fetch("http://localhost:5000/support/get/callbacks", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch callbacks");
        }

        const data = await response.json();
        setCallbacks(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCallbacks();
  }, []);

  const handleMarkComplete = async (id) => {
    try {
      const token = Cookies.get("access_token");
      setStatusLoader(true);
      const response = await fetch(`http://localhost:5000/support/callbacks/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to mark callback as completed");
      }

      setStatusLoader(false);
      const updatedCallbacks = callbacks.map((callback) =>
        callback.id === id ? { ...callback, status: "Completed" } : callback
      );
      toast.success("Updated Successfully!!");
      setCallbacks(updatedCallbacks);
    } catch (err) {
      toast.error("Error marking callback as completed:");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Callback Requests</h1>

      {error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center">
                      <Loader className="h-6 w-6 animate-spin text-indigo-600 mx-auto" />
                    </td>
                  </tr>
                ) : (
                  callbacks.map((callback) => (
                    <tr key={callback.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-violet-100 flex items-center justify-center">
                            <Phone className="h-5 w-5 text-violet-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {callback.first_name} {callback.last_name}
                            </div>
                            <div className="text-sm text-gray-500">{callback.phone_number}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{callback.comment}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            callback.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {callback.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(callback.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          className={`flex items-center ${
                            callback.status === "Completed"
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-green-600 hover:text-green-900"
                          }`}
                          onClick={() => handleMarkComplete(callback.id)}
                          disabled={callback.status === "Completed"}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          {statusLoader ? "Submitting" : "Mark Complete" }
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
