import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  Users,
  FileText,
  PhoneCall,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const menuItems = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { id: "add-course", icon: PlusCircle, label: "Add Course", href: "/admin/add-course" },
  { id: "user-status", icon: Users, label: "User Status", href: "/admin/user-status" },
  { id: "internship-forms", icon: FileText, label: "Internship Forms", href: "/admin/internship-forms" },
  { id: "callbacks", icon: PhoneCall, label: "Callbacks", href: "/admin/callbacks" },
];

export default function AdminSidebar({ collapsed, setCollapsed }) {
  return (
    <div
      className={`bg-white border-r border-gray-200 h-full transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="p-4 flex justify-between items-center border-b">
        <h1
          className={`font-bold text-violet-600 transition-opacity ${
            collapsed ? "opacity-0 hidden" : "opacity-100"
          }`}
        >
          Admin Panel
        </h1>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
        >
          {collapsed ? (
            <ChevronRight size={20} className="text-violet-600" />
          ) : (
            <ChevronLeft size={20} className="text-violet-600" />
          )}
        </button>
      </div>

      <nav className="p-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.href}
            className={({ isActive }) =>
              `w-full flex items-center gap-4 px-3 py-2.5 rounded-lg transition-colors group ${
                isActive
                  ? "bg-violet-50 text-violet-600"
                  : "text-gray-700 hover:bg-violet-50 hover:text-violet-600"
              }`
            }
          >
            <item.icon size={20} className="shrink-0" />
            <span
              className={`transition-opacity ${collapsed ? "opacity-0 hidden" : "opacity-100"}`}
            >
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
