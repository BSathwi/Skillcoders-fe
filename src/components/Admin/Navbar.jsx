import React, { useState, useEffect } from 'react';
import { Code, User, LogOut, Bell, Mail, Phone, Edit } from 'lucide-react';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AdminNavbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [profile, setProfile] = useState({
    name: "Admin",
    mail_id: "admin@example.com",
    phone_number: "+1234567890",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = Cookies.get("access_token");
      try {
        const response = await fetch("http://localhost:5000/auth/api/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      const token = Cookies.get("access_token");
  
      // Call the logout API
      const response = await fetch("http://localhost:5000/auth/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        return toast.error("Something went Wrong! Please try again");
      }
      localStorage.clear();
      Cookies.remove("access_token");
      Cookies.remove("secret_key");
      Cookies.remove("username");
  
      window.location.href = "/login";
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const renderUserAvatar = () => {
    if (profile?.user_image) {
      return (
        <img
          src={profile.user_image}
          alt="User"
          className="w-8 h-8 rounded-full object-cover"
        />
      );
    } else {
      const firstChar = profile?.name ? profile.name.charAt(0).toUpperCase() : 'A';
      return (
        <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white font-medium">
          {firstChar}
        </div>
      );
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 h-[76px] flex items-center justify-between px-6 py-4">
      <div className="flex items-center">
        <Code className="h-8 w-8 text-indigo-600" />
        <span className="ml-2 text-xl font-bold text-gray-800">SkillCoders</span>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-lg hover:bg-gray-100">
          <Bell size={20} className="text-gray-600" />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
          >
            {renderUserAvatar()}
            <span className="font-medium">Admin</span>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
              {/* Profile Information */}
              <div className="px-4 py-2 text-gray-700 w-64">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-indigo-600" />
                  <p className="font-bold">{profile.name}</p>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <p className="text-sm text-gray-500">{profile.mail_id}</p>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <p className="text-sm text-gray-500">{profile.phone_number}</p>
                </div>
              </div>

              <hr className="my-2" />

              <Link
                to="/profile"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
              >
                <div className="flex items-center space-x-2">
                  <Edit className="h-4 w-4 text-indigo-600" />
                  <span>Update Profile</span>
                </div>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 rounded-md transition-colors duration-200"
              >
                <div className="flex items-center space-x-2">
                  <LogOut className="h-4 w-4 text-red-600" />
                  <span>Logout</span>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}