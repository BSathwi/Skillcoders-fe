import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Code, User, LogIn, ShoppingCart, Loader, LogOut, Edit, Phone, Mail } from "lucide-react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useCartCount } from "../context/Context";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const { cartCount,updateCartCount } = useCartCount();
  const [loadingProfile, setLoadingProfile] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const profileFetched = useRef(false);
  const token = Cookies.get("access_token");

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
      if (!profileFetched.current) {
        profileFetched.current = true;
        fetchProfile();
      }
    }
  }, []);

  const fetchProfile = async () => {
    if (loadingProfile || profile) return;
    setLoadingProfile(true);

    try {
      const token = Cookies.get("access_token");
      const response = await fetch("http://localhost:5000/auth/api/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        updateCartCount(data.total_cart_count);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/auth/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("access_token")}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        Cookies.remove("access_token");
        localStorage.clear();
        setIsLoggedIn(false);
        setProfile(null);
        Cookies.remove("secret_key");
        Cookies.remove("username");
        toast.success("Successfully Logout!");
        navigate("/");
      } else {
        throw new Error(data.message || "Something went wrong, please try again!");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowProfileDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 left-0 z-50">
      <div className="max-w mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to={token ? "/dashboard" : "/"} className="flex items-center">
              <Code className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">SkillCoders</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/courses" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md">
              Courses
            </Link>
            <Link to="/internships" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md">
              Internships
            </Link>
            <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md">
              Support
            </Link>
            <Link to="/cartItems" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md relative">
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="text-white px-4 py-2 rounded-md flex items-center"
                >
                  {loadingProfile ? (
                    <div className="h-8 w-8 rounded-full bg-gray-300 animate-pulse shadow-lg"></div>
                  ) : profile ? (
                    <>
                      {profile.user_image ? (
                        <img
                          src={profile.user_image}
                          alt="User"
                          className="h-8 w-8 rounded-full shadow-lg"
                        />
                      ) : (
                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-violet-600 text-white font-bold shadow-lg">
                          {profile.name[0].toUpperCase()}
                        </div>
                      )}
                    </>
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </button>

                {/* Dropdown */}
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md py-2 z-10">
                    {loadingProfile ? (
                      <div className="h-16 flex justify-center items-center">
                        <Loader className="h-6 w-6 animate-spin text-indigo-600" />
                      </div>
                    ) : (
                      <>
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
                      </>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link to="/register" className="bg-white text-indigo-600 border border-indigo-600 px-4 py-2 rounded-md flex items-center hover:bg-indigo-50">
                  Register
                </Link>
                <Link to="/login" className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center">
                  <LogIn className="h-5 w-5 mr-2" />
                  Login
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/courses" className="block text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md">
                Courses
              </Link>
              <Link to="/internships" className="block text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md">
                Internships
              </Link>
              <Link to="/dashboard" className="block text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md">
                Support
              </Link>
              <Link to="/cartItems" className="block text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md relative">
                <ShoppingCart className="h-6 w-6 inline-block" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {isLoggedIn ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="block w-full text-left text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md"
                  >
                    {loadingProfile ? (
                      <div className="h-8 w-8 rounded-full bg-gray-300 animate-pulse shadow-lg"></div>
                    ) : profile ? (
                      <>
                        {profile.user_image ? (
                          <img
                            src={profile.user_image}
                            alt="User"
                            className="h-8 w-8 rounded-full shadow-lg inline-block mr-2"
                          />
                        ) : (
                          <div className="h-10 w-10 flex items-center justify-center rounded-full bg-violet-600 text-white font-bold shadow-lg inline-block mr-2">
                            {profile.name[0].toUpperCase()}
                          </div>
                        )}
                        <span>{profile.name}</span>
                      </>
                    ) : (
                      <User className="h-5 w-5 inline-block mr-2" />
                    )}
                  </button>

                  {/* Dropdown */}
                  {showProfileDropdown && (
                    <div className="mt-2 w-full bg-white shadow-lg rounded-md py-2 z-10">
                      {loadingProfile ? (
                        <div className="h-16 flex justify-center items-center">
                          <Loader className="h-6 w-6 animate-spin text-indigo-600" />
                        </div>
                      ) : (
                        <>
                          <div className="px-4 py-2 text-gray-700">
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
                        </>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <Link to="/register" className="block bg-white text-indigo-600 border border-indigo-600 px-4 py-2 rounded-md text-center hover:bg-indigo-50">
                    Register
                  </Link>
                  <Link to="/login" className="block bg-indigo-600 text-white px-4 py-2 rounded-md text-center">
                    <LogIn className="h-5 w-5 inline-block mr-2" />
                    Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;