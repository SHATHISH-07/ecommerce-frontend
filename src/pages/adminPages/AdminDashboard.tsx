import { useQuery } from "@apollo/client";
import { GET_ADMIN_DASHBOARD_STATS } from "../../graphql/queries/adminDashboard.query";
import {
  ShoppingCart,
  DollarSign,
  XCircle,
  RotateCcw,
  Package,
  Boxes,
  Users,
  UserCheck,
  UserX,
  UserMinus,
  AlertTriangle,
} from "lucide-react";
import LoadingSpinner from "../../components/products/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const CountUpNumber = ({
  end,
  duration = 1000,
}: {
  end: number;
  duration?: number;
}) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 16);
    const counter = () => {
      start += increment;
      if (start < end) {
        setValue(Math.floor(start));
        requestAnimationFrame(counter);
      } else {
        setValue(end);
      }
    };
    requestAnimationFrame(counter);
  }, [end, duration]);

  return <>{value.toLocaleString()}</>;
};

const statsConfig = [
  {
    key: "totalOrders",
    label: "Total Orders",
    icon: ShoppingCart,
    to: "/admin/orders",
  },
  { key: "totalRevenue", label: "Total Revenue", icon: DollarSign },
  {
    key: "cancelledOrders",
    label: "Cancelled Orders",
    icon: XCircle,
    to: "/admin/orders",
  },
  {
    key: "returnedOrders",
    label: "Returned Orders",
    icon: RotateCcw,
    to: "/admin/orders",
  },
  {
    key: "totalProducts",
    label: "Products",
    icon: Package,
    to: "/admin/products",
  },
  {
    key: "totalCategories",
    label: "Categories",
    icon: Boxes,
    to: "/admin/categories",
  },
  { key: "totalUsers", label: "Users", icon: Users, to: "/admin/users" },
  {
    key: "activeUsers",
    label: "Active Users",
    icon: UserCheck,
    to: "/admin/users",
  },
  {
    key: "bannedUsers",
    label: "Banned Users",
    icon: UserX,
    to: "/admin/users",
  },
  {
    key: "deactivatedUsers",
    label: "Deactivated Users",
    icon: UserMinus,
    to: "/admin/users",
  },
];

const AdminDashboard = () => {
  const { data, loading, error } = useQuery(GET_ADMIN_DASHBOARD_STATS);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center my-20 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg max-w-lg mx-auto text-center">
        <AlertTriangle className="text-red-500 w-12 h-12 mb-4" />
        <h3 className="text-xl font-semibold text-red-800 dark:text-red-300">
          Oops! Something went wrong.
        </h3>
        <p className="text-red-600 dark:text-red-400 mt-2">
          We couldn't load the categories. Please try again later.
        </p>
        <p className="text-xs text-gray-500 mt-4 italic">
          Error: {error.message}
        </p>
      </div>
    );
  }

  const stats = data?.getAdminDashboardStats;

  return (
    <div className="flex flex-col h-screen p-6 bg-gray-50 dark:bg-[#121212] text-black dark:text-white">
      <h1 className="text-3xl font-semibold mb-8">Admin Dashboard</h1>

      <div className="flex-1 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {statsConfig.map(({ key, label, icon: Icon, to }) => (
          <div
            key={key}
            onClick={() => to && navigate(to)}
            className={`cursor-pointer rounded-2xl p-5 flex items-center shadow-md hover:shadow-xl transition
                bg-white dark:bg-[#1f1f1f] ${
                  to ? "dark:hover:bg-[#2d2d2d]" : ""
                }`}
          >
            <div className="p-3 rounded-full bg-gray-100 dark:bg-[#2d2d2d] mr-4">
              <Icon size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-400">
                {label}
              </p>
              <p className="text-2xl font-bold">
                {key === "totalRevenue" ? (
                  <>
                    ₹<CountUpNumber end={stats[key]} />
                  </>
                ) : (
                  <CountUpNumber end={stats[key]} />
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
