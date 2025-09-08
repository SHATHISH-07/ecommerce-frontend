import * as React from "react";
import {
  LayoutDashboard,
  Package,
  Users,
  LogOut,
  MenuIcon,
  ChevronDown,
  ChevronRight,
  TicketCheck,
  ShoppingBag,
  Boxes,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DarkModeToggle from "../DarkThemeToggler";
import logo from "/logo.svg";
import { clearUser } from "../../app/slices/userSlice";
import { useDispatch } from "react-redux";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/admin" },
  {
    label: "Products",
    icon: Package,
    children: [
      { label: "All Products", to: "/admin/products" },
      { label: "Add Product", to: "/admin/products/new" },
      { label: "Bulk Add Product", to: "/admin/products/new/bulk" },
    ],
  },
  {
    label: "Categories",
    icon: Boxes,
    children: [
      { label: "All Categories", to: "/admin/categories" },
      { label: "Add Category", to: "/admin/categories/new" },
      { label: "Bulk Add Category", to: "/admin/categories/new/bulk" },
    ],
  },
  { label: "Users", icon: Users, to: "/admin/users" },
  { label: "Orders", icon: ShoppingBag, to: "/admin/orders" },
  { label: "Banner", icon: TicketCheck, to: "/admin/banner" },
];

const AdminNav = () => {
  const [open, setOpen] = React.useState(false);
  const [expanded, setExpanded] = React.useState<string | null>(null);
  const location = useLocation();

  const toggleExpand = (label: string) => {
    setExpanded(expanded === label ? null : label);
  };
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearUser());
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-screen flex flex-col transition-all duration-300 overflow-hidden",
        "bg-gray-100 border-r border-gray-300 text-gray-900",
        "dark:bg-[#1f1f1f] dark:border-gray-700 dark:text-white",
        open ? "w-64" : "w-15"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-gray-300 dark:border-gray-700">
        {open && (
          <div>
            <img src={logo} alt="NxKart" className="w-20 h-12 object-cover" />
          </div>
        )}
        <button
          onClick={() => setOpen(!open)}
          className="text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <MenuIcon size={20} />
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-2">
        {sidebarItems.map((item, idx) => (
          <div key={idx}>
            {item.children ? (
              <div>
                <button
                  onClick={() => toggleExpand(item.label)}
                  className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg 
                  hover:bg-gray-200 dark:hover:bg-[#3c3c3c]"
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={20} />
                    {open && <span>{item.label}</span>}
                  </div>
                  {open &&
                    (expanded === item.label ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    ))}
                </button>
                {/* Children */}
                <div
                  className={cn(
                    "pl-10 space-y-1 transition-all duration-200 overflow-hidden",
                    expanded === item.label && open ? "max-h-40" : "max-h-0"
                  )}
                >
                  {item.children.map((sub, subIdx) => (
                    <Link
                      key={subIdx}
                      to={sub.to}
                      className={cn(
                        "block px-2 py-1 rounded-md text-sm",
                        "hover:bg-gray-200 dark:hover:bg-[#4c4c4c]",
                        location.pathname === sub.to &&
                          "bg-gray-300 dark:bg-[#4c4c4c]"
                      )}
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                to={item.to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg",
                  "hover:bg-gray-200 dark:hover:bg-[#3c3c3c]",
                  location.pathname === item.to &&
                    "bg-gray-300 dark:bg-[#3c3c3c]"
                )}
              >
                <item.icon size={20} />
                {open && <span>{item.label}</span>}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* Dark Mode Toggle */}
      <div className={`${open ? "flex" : "hidden"} px-3 py-2`}>
        <DarkModeToggle />
      </div>

      {/* Footer */}
      <div className="border-t border-gray-300 dark:border-gray-700 flex flex-col gap-3">
        <button
          onClick={() => handleLogout()}
          className="flex items-center gap-2 w-full justify-start px-3 py-2 rounded-lg 
        hover:bg-red-500 dark:hover:bg-red-600 text-gray-700 dark:text-white cursor-pointer"
        >
          <LogOut size={20} />
          {open && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default AdminNav;
