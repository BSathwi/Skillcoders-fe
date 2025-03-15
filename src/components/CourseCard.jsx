import React from "react";
import { Download, ShoppingCart, CheckCircle, PlusCircle, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";

const loadRazorpayScript = async () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const CourseCard = ({ course, onRegister, onPaymentSuccess, onAddToCart }) => {
  const handleDownload = () => {
    const fullUrl = `http://localhost:5000/download-curriculum/${course.curriculum_pdf.split("/").pop()}?courseName=${encodeURIComponent(course.course_name)}`;
  
    const link = document.createElement("a");
    link.href = fullUrl;
    link.download = `${course.course_name}_curriculum.pdf`; 
    link.target = "_blank"; // Open in a new tab (optional)
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const token = Cookies.get("access_token");

  const handleRegister = async () => {
    if (!token) {
      toast.error("Authentication required! Please login.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/amount/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ course_id: course.id, amount: course.price }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create Razorpay order.");

      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        toast.error("Failed to load Razorpay SDK. Please try again.");
        return;
      }

      const options = {
        key: data.key,
        amount: course.price * 100, // Razorpay expects amount in paise (INR)
        currency: "INR",
        name: "Live Courses",
        description: `Payment for ${course.course_name}`,
        order_id: data.orderId,
        handler: async (response) => {
          console.log("Razorpay Response:", response);

          if (!response.razorpay_order_id || !response.razorpay_signature) {
            toast.error("Missing order_id or signature from Razorpay response.");
            return;
          }

          await verifyPayment(response, data.amount);
        },
        prefill: {
          name: Cookies.get("username"),
          email: "user@example.com",
          contact: "630044072343",
        },
        theme: { color: "#6d28d9" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error(error.message || "Error during registration. Please try again.");
    }
  };

  const verifyPayment = async (response, amount) => {
    console.log(response);
    try {
      const res = await fetch("http://localhost:5000/amount/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          course_id: course.id,
          amount: amount,
          order_id: response.razorpay_order_id,
          payment_id: response.razorpay_payment_id,
          signature: response.razorpay_signature,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        onPaymentSuccess();
        toast.success("Payment successfully! 🎉");
      } else {
        toast.error(data.message || "Payment verification failed.");
      }
    } catch (error) {
      toast.error("Error verifying payment. Please try again.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-violet-100 hover:border-violet-300 transition-all">
      <div className="relative">
        <img
          src={course.course_image}
          alt={course.course_name}
          className="w-full h-48 object-cover rounded-t-lg lg:rounded-t-xl"
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-center text-white bg-gradient-to-t from-black/70 to-transparent">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="text-sm">1.2k students</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="text-sm">2-3 months</span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-violet-900 mb-2 line-clamp-2">
          {course.course_name}
        </h3>

        <div className="flex items-center gap-2 mb-3">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(course.instructor_name)}&background=6d28d9&color=fff`}
            alt={course.instructor_name}
            className="w-8 h-8 rounded-full"
          />
          <p className="text-violet-600 font-medium">{course.instructor_name}</p>
        </div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-2xl font-bold text-violet-700">₹{course.price}</p>
          <button
            onClick={handleDownload}
            className="text-violet-600 hover:text-violet-700 flex items-center gap-1"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm">Curriculum</span>
          </button>
        </div>

        {course.isRegistered ? (
          <button className="w-full bg-green-500 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 cursor-not-allowed">
            <CheckCircle className="w-5 h-5" />
            Enrolled
          </button>
        ) : course.justCourses ? (
          <Link to={token ? "/dashboard" : "/login"}>
            <button className="w-full bg-violet-600 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-violet-700">
              <ShoppingCart className="w-5 h-5" />
              Register Now
            </button>
          </Link>
        ) : (
          <div className="space-y-2">
            <button
              className="w-full bg-violet-600 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-violet-700"
              onClick={handleRegister}
            >
              <ShoppingCart className="w-5 h-5" />
              Register Now
            </button>
            <button
              className="w-full bg-violet-100 text-violet-700 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-violet-200"
              onClick={() => onAddToCart(course.id)}
            >
              <PlusCircle className="w-5 h-5" />
              Add to Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCard;