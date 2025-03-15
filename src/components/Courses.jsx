import React, { useState, useEffect } from "react";
import CourseCard from "./CourseCard";
import { Loader, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/admin/courses");
      const data = await res.json();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-8 py-8 mt-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 "
      >
        <h1 className="text-3xl font-bold text-black">Available Courses</h1>
        <p className="text-violet-600 mt-1">Explore and start learning today!</p>
      </motion.div>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="h-8 w-8 animate-spin text-violet-600" />
          </div>
        ) : courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <BookOpen className="h-16 w-16 text-violet-300 mb-4" />
            <p className="text-xl font-semibold text-black">No courses available</p>
            <p className="text-violet-600 mt-2">Check back later for new courses!</p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {courses.map((course) => (
              <CourseCard key={course.id} course={{ ...course, isRegistered: false,justCourses:true }} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
    </>
  );
};

export default Courses;
