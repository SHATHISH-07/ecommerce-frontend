import {
  History,
  Package,
  ShoppingBag,
  ShoppingBasket,
  ShoppingCart,
  User,
} from "lucide-react";
import { useAppSelector, type RootState } from "../../app/store";
import ProfileCard from "../../components/profile/ProfileCard";
import EditProfileForm from "../../components/profile/EditProfileForm";
import ProfileOrderHistory from "../../components/profile/ProfileOrderHistory";
import { useNavigate } from "react-router-dom";
import AccountSettings from "../../components/profile/AccountSettings";

const Profile = () => {
  const user = useAppSelector((state: RootState) => state.user.user);

  const navigate = useNavigate();

  if (!user) return null;

  const navItems = [
    {
      path: "/cart",
      label: "View Cart",
      IconComponent: ShoppingCart,
    },
    {
      path: "/orders",
      label: "View Orders",
      IconComponent: ShoppingBag,
    },
    {
      path: "/products",
      label: "All Products",
      IconComponent: ShoppingBasket,
    },
    {
      path: "/categories",
      label: "All Category",
      IconComponent: Package,
    },
  ];

  return (
    <div className="mt-10 px-4 md:px-0">
      <div className="flex items-center justify-center gap-2 mb-5">
        <User size={35} />
        <h2 className="text-4xl text-gray-800 dark:text-gray-300 text-center ">
          User Profile
        </h2>
      </div>

      <div className="flex justify-center items-center min-h-screen px-4 md:px-0">
        <div className="flex flex-wrap justify-center items-start gap-8 w-full max-w-[1200px] mb-5">
          <ProfileCard user={user} />
          <EditProfileForm user={user} />
        </div>
      </div>

      <div className="flex md:flex-row flex-col flex-wrap items-center justify-center gap-10 mb-13">
        {navItems.map((item) => (
          <div
            key={item.path}
            onClick={() => navigate(item.path)}
            className="flex items-center justify-center w-[70%] md:w-[20%] lg-[15%] max-w-3xl h-[30vh] signup-shadow bg-white dark:bg-black rounded-md cursor-pointer"
          >
            <span className="flex items-center justify-center gap-2 text-2xl text-gray-700  dark:text-gray-300">
              <item.IconComponent size={30} />
              {item.label}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center justify-center gap-3 mb-5">
        <div className="flex items-center justify-center gap-2 mb-5 ">
          <History size={35} />
          <h2 className=" text-4xl text-gray-800 dark:text-gray-300 text-center">
            Order History
          </h2>
        </div>
        <div className="flex flex-col items-center gap-3">
          <ProfileOrderHistory user={user} />
        </div>
      </div>

      <div>
        <AccountSettings />
      </div>
    </div>
  );
};

export default Profile;
