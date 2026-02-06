import {
  LayoutDashboard,
  Users,
  Car,
  ShoppingBag,
  CreditCard,
  LogOut,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { MdReviews } from "react-icons/md";

const Sidebar = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const navItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/admin/dashboard",
    },
    {
      name: "Users",
      icon: <Users size={20} />,
      path: "/admin/users",
    },
    {
      name: "Cars",
      icon: <Car size={20} />,
      path: "/admin/cars",
    },
    {
      name: "Orders",
      icon: <ShoppingBag size={20} />,
      path: "/admin/orders",
    },
    {
      name: "Payments",
      icon: <CreditCard size={20} />,
      path: "/admin/payments",
    },
    {
      name: "Reviews",
      icon: <MdReviews size={20} />,
      path: "/admin/reviews",
    },
  ];

  const handleLogout = () => {
    auth?.logout();
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-[#0f111a] border-r border-gray-800 flex flex-col h-screen sticky top-0">
      {/* Logo Section */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">
          B
        </div>
        <span className="text-xl font-bold tracking-tight text-white">
          BMW Admin
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                  : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200"
              }`
            }
          >
            {item.icon}
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
