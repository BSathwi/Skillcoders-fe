import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import CourseCard from "./CourseCard";
import { toast } from "react-hot-toast";
import { Loader, BookOpen, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { useCartCount } from "../context/Context";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [allCourses, setAllCourses] = useState([]);
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [loading, setLoading] = useState({ all: true, registered: false });
  const { cartCount, updateCartCount } = useCartCount();

  useEffect(() => {
    fetchNonRegisteredCourses();
  }, []);
  
  const fetchNonRegisteredCourses = async () => {
    setLoading((prev) => ({ ...prev, all: true }));
    const token = Cookies.get("access_token");
    if (!token) {
      toast.error("Authentication required! Please login.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/admin/non-registered-courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAllCourses(data.map((course) => ({ ...course, isRegistered: false })));
    } catch (err) {
    } finally {
      setLoading((prev) => ({ ...prev, all: false }));
    }
  };

  const fetchRegisteredCourses = async () => {
    if (registeredCourses.length > 0) return;
    setLoading((prev) => ({ ...prev, registered: true,justCourses:true }));

    const token = Cookies.get("access_token");
    if (!token) {
      toast.error("Authentication required! Please login.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/admin/registered-courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRegisteredCourses(data.map((course) => ({ ...course, isRegistered: true, justCourses:false })));
    } catch (err) {
    } finally {
      setLoading((prev) => ({ ...prev, registered: false }));
    }
  };

  const handleAddToCart = async (courseId) => {
    const token = Cookies.get("access_token");
    if (!token) {
      toast.error("Authentication required! Please login.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/carting/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ course_id: courseId }),
      });

      const data = await res.json();
      if (res.ok) {
        const newCount = parseInt(cartCount) + 1;
        updateCartCount(newCount);
        toast.success("Course added to cart successfully! 🎉");
      } else {
        toast.error(data.message || "Failed to add course to cart.");
      }
    } catch (error) {
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  

  return (
    <div className="min-h-screen bg-white mt-16">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 sm:mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-violet-100 flex items-center justify-center">
              <GraduationCap className="h-8 w-8 text-violet-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-black">
                Welcome back, {Cookies.get("username")}! 
              </h1>
              <p className="text-violet-600 mt-1">Continue your learning journey</p>
            </div>
          </div>
        </motion.div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex space-x-8 mb-8">
            <button
              className={`relative px-6 py-3 rounded-xl text-lg font-semibold transition-all duration-300 flex items-center gap-2
                ${activeTab === "all" 
                  ? "bg-violet-100 text-violet-700" 
                  : "text-gray-600 hover:bg-violet-50"}`}
              onClick={() => setActiveTab("all")}
            >
              <BookOpen className="w-5 h-5" />
              All Courses
            </button>
            <button
              className={`relative px-6 py-3 rounded-xl text-lg font-semibold transition-all duration-300 flex items-center gap-2
                ${activeTab === "registered" 
                  ? "bg-violet-100 text-violet-700" 
                  : "text-gray-600 hover:bg-violet-50"}`}
              onClick={() => {
                fetchRegisteredCourses();
                setActiveTab("registered");
                
              }}
            >
              <GraduationCap className="w-5 h-5" />
              My Courses
            </button>
          </div>

          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {activeTab === "all" && loading.all ? (
              <div className="col-span-full flex justify-center items-center h-32">
                <Loader className="h-8 w-8 animate-spin text-violet-600" />
              </div>
            ) : activeTab === "all" && allCourses.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center h-64">
                <BookOpen className="h-16 w-16 text-violet-300 mb-4" />
                <p className="text-xl font-semibold text-violet-900">No courses available yet</p>
                <p className="text-violet-600 mt-2">Check back later for new courses!</p>
              </div>
            ) : activeTab === "registered" && loading.registered ? (
              <div className="col-span-full flex justify-center items-center h-32">
                <Loader className="h-8 w-8 animate-spin text-violet-600" />
              </div>
            ) : activeTab === "registered" && registeredCourses.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center h-64">
                <GraduationCap className="h-16 w-16 text-violet-300 mb-4" />
                <p className="text-xl font-semibold text-black">No registered courses yet</p>
                <p className="text-violet-600 mt-2">Start your learning journey today!</p>
              </div>
            ) : (
              (activeTab === "all" ? allCourses : registeredCourses).map((course) => (
                <CourseCard key={course.id} course={course} onAddToCart={handleAddToCart} onPaymentSuccess={fetchNonRegisteredCourses}  />
              ))
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;