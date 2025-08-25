import Logo from "./Logo";
import SearchBar from "./SearchBar";
import ProfileSection from "./ProfileSection";
import type { UserType } from "../../types/User";

interface TabletNavProps {
  user: UserType | null;
}

const TabletNav = ({ user }: TabletNavProps) => {
  return (
    <div className="hidden md:flex lg:hidden items-center justify-between gap-4 w-full">
      <Logo />
      <div className="flex-1 max-w-md">
        <SearchBar placeholder="Search..." />
      </div>
      <ProfileSection user={user} />
    </div>
  );
};

export default TabletNav;
