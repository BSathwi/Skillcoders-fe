import React, { useState, useEffect, useRef } from 'react';
import { Book, Users, UserCheck, IndianRupee } from 'lucide-react';
import StatsCard from './Statscard';
import Cookies from "js-cookie";

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState({
    total_courses: 0,
    total_registrations: 0,
    active_users: 0,
    total_revenue: 0,
  });

  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [courseCategories, setCourseCategories] = useState([]);

  // Use useRef to track if the API has been called
  const isDataFetched = useRef(false);

  useEffect(() => {
    // Only fetch data if it hasn't been fetched already
    if (isDataFetched.current) return;
    isDataFetched.current = true;

    const fetchDashboardData = async () => {
      const token = Cookies.get("access_token");

      if (!token) {
        console.error("No access token found");
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/auth/api/dashboard", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    const fetchMonthlyRevenue = async () => {
      const token = Cookies.get("access_token");

      if (!token) {
        console.error("No access token found");
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/auth/api/monthly-revenue", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch monthly revenue data");
        }

        const data = await response.json();
        setMonthlyRevenue(data);
      } catch (error) {
        console.error("Error fetching monthly revenue data:", error);
      }
    };

    const fetchCoursesByCategory = async () => {
      const token = Cookies.get("access_token");

      if (!token) {
        console.error("No access token found");
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/auth/api/courses-by-category", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch courses by category data");
        }

        const data = await response.json();
        setCourseCategories(data);
      } catch (error) {
        console.error("Error fetching courses by category data:", error);
      }
    };

    // Call all fetch functions
    fetchDashboardData();
    fetchMonthlyRevenue();
    fetchCoursesByCategory();
  }, []); // Empty dependency array ensures this runs only once

  const stats = [
    { title: "Total Courses", value: dashboardData.total_courses, icon: Book },
    { title: "Total Registrations", value: dashboardData.total_registrations, icon: Users },
    { title: "Active Users", value: dashboardData.active_users, icon: UserCheck },
    { title: "Total Revenue", value: `₹${dashboardData.total_revenue}`, icon: IndianRupee },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Monthly Revenue</h2>
          <div className="space-y-4">
            {monthlyRevenue.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-600">{item.month}</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 bg-violet-500 rounded" style={{
                    width: `${(item.revenue / 30000) * 200}px`
                  }} />
                  <span className="font-medium">₹{item.revenue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Courses by Category</h2>
          <div className="space-y-4">
            {courseCategories.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-600">{item.category}</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 bg-violet-500 rounded" style={{
                    width: `${(item.course_count / 50) * 200}px`
                  }} />
                  <span className="font-medium">{item.course_count} courses</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}