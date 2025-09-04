import {
  CircleUser,
  ShoppingCart,
  ShoppingBag,
  LogOut,
  ShoppingBasket,
  Package,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearUser } from "../../app/slices/userSlice";
import type { UserType } from "../../types/User";
import { LogIn, UserPlus } from "lucide-react";
import DarkModeToggle from "../DarkThemeToggler";

interface ProfileMenuProps {
  user: UserType | null;
  onClose?: () => void;
}

const ProfileMenu = ({ user, onClose }: ProfileMenuProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearUser());
    localStorage.removeItem("token");
    navigate("/");
    onClose?.();
  };

  const menuBtn =
    "flex items-center gap-3 w-full px-3 py-2 rounded-md text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#3c3c3c] transition cursor-pointer outline-none";

  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center space-y-2 w-full">
        <button
          onClick={() => {
            navigate("/login");
            onClose?.();
          }}
          className="flex items-center outline-none justify-center cursor-pointer w-full px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#3c3c3c] rounded-md transition gap-2"
        >
          <LogIn size={18} />
          Sign In
        </button>

        <button
          onClick={() => {
            navigate("/signup");
            onClose?.();
          }}
          className="flex items-center outline-none justify-center cursor-pointer w-full px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#3c3c3c] rounded-md transition gap-2"
        >
          <UserPlus size={18} />
          Sign Up
        </button>

        <button
          onClick={() => {
            navigate("/products");
            onClose?.();
          }}
          className="flex items-center outline-none justify-center cursor-pointer w-full px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#3c3c3c] rounded-md transition gap-2"
        >
          <ShoppingBasket size={18} />
          View Products
        </button>

        <div className="flex items-center justify-center w-full px-3 py-2 hover:bg-transparent dark:hover:bg-transparent">
          <DarkModeToggle />
        </div>
      </div>
    );
  }

  // Signed-in user menu
  return (
    <div className="flex flex-col space-y-2">
      {/* Address block */}
      <div className="text-sm text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 p-3 rounded-lg">
        <p className="font-semibold text-lg pb-2">Hi, {user.name}</p>
        <p>{user.address || "No address set yet."}</p>
      </div>

      {/* Divider */}
      <hr className="border-gray-300 dark:border-gray-700 my-1" />

      {/* Menu items */}
      <button
        onClick={() => {
          navigate("/profile");
          onClose?.();
        }}
        className={menuBtn}
      >
        <CircleUser size={18} /> <span>Go to Profile</span>
      </button>

      <button
        onClick={() => {
          navigate("/products");
          onClose?.();
        }}
        className={menuBtn}
      >
        <ShoppingBasket size={18} /> <span>View All Products</span>
      </button>

      <button
        onClick={() => {
          navigate("/categories");
          onClose?.();
        }}
        className={menuBtn}
      >
        <Package size={18} /> <span>View All Categories</span>
      </button>

      <button
        onClick={() => {
          navigate("/cart");
          onClose?.();
        }}
        className={menuBtn}
      >
        <ShoppingCart size={18} /> <span>Your Cart</span>
      </button>

      <button
        onClick={() => {
          navigate("/orders");
          onClose?.();
        }}
        className={menuBtn}
      >
        <ShoppingBag size={18} /> <span>Your Orders</span>
      </button>

      <button
        onClick={handleLogout}
        className={`${menuBtn} text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30`}
      >
        <LogOut size={18} /> <span>Sign Out</span>
      </button>

      {/* DarkMode Toggle */}
      <div className="flex items-center justify-start px-3 py-2 hover:bg-transparent dark:hover:bg-transparent">
        <DarkModeToggle />
      </div>
    </div>
  );
};

export default ProfileMenu;
