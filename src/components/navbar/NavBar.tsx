import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import ProfileSection from "./ProfileSection";
import CartSection from "./CartSection";
import OrdersSection from "./OrdersSection";
import AddressSection from "./AddressSection";

const NavBar = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="navbar py-3 px-5 gradient-shadow bg-white dark:bg-black relative">
      <div className="hidden lg:flex items-center justify-between">
        <Logo />
        <AddressSection
          user={user}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
        <SearchBar className="flex-1 max-w-lg mx-4 hidden md:flex" />
        <div className="hidden md:flex items-center space-x-10 text-gray-700 dark:text-gray-400">
          <OrdersSection user={user} />
          <CartSection user={user} />
        </div>
        <ProfileSection user={user} />
      </div>

      <div className="hidden sm:flex lg:hidden items-center justify-between">
        <Logo />
        <SearchBar className="flex-1 max-w-md mx-4" />
        <ProfileSection user={user} />
      </div>

      <div className="flex sm:hidden flex-col space-y-2">
        <div className="flex items-center justify-between">
          <Logo />
          <ProfileSection user={user} />
        </div>
        <SearchBar className="w-full" />
      </div>
    </div>
  );
};

export default NavBar;
