import Logo from "./Logo";
import SearchBar from "./SearchBar";
import ProfileSection from "./ProfileSection";
import type { UserType } from "../../types/User";

type MobileNavProps = {
  user: UserType | null;
};

const MobileNav = ({ user }: MobileNavProps) => {
  return (
    <div className="flex flex-col gap-3 md:hidden w-full">
      {/* Row 1: Logo + Profile */}
      <div className="flex items-center justify-between">
        <Logo />
        <ProfileSection user={user} />
      </div>

      {/* Row 2: Search full width */}
      <div className="w-full">
        <SearchBar />
      </div>
    </div>
  );
};

export default MobileNav;
