// DesktopNav.tsx
import OrdersSection from "./OrdersSection";
import CartSection from "./CartSection";
import ProfileSection from "./ProfileSection";
import { type UserType } from "../../types/User";

type DesktopNavProps = {
  user: UserType | null;
};

const DesktopNav = ({ user }: DesktopNavProps) => {
  return (
    <div className="hidden lg:flex items-center justify-between w-full">
      <OrdersSection user={user} />
      <CartSection user={user} />
      <ProfileSection user={user} />
    </div>
  );
};

export default DesktopNav;
