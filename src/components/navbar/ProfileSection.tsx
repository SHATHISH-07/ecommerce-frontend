import { CircleUser, User } from "lucide-react";
import ProfileHoverModal from "../ProfileHoverModal";
import ProfileMenu from "./ProfileMenu";
import type { UserType } from "../../types/User";
import { useNavigate } from "react-router-dom";

interface ProfileSectionProps {
  user: UserType | null;
}

const ProfileSection = ({ user }: ProfileSectionProps) => {
  const navigate = useNavigate();

  return (
    <ProfileHoverModal
      trigger={
        <div className="flex items-center cursor-pointer text-gray-700 dark:text-gray-400 hover:text-black dark:hover:text-white pr-3">
          {user ? (
            <>
              <CircleUser size={20} className="mr-1" />
              <span className="inline">
                <span className="hidden md:inline">Hi,</span> {user.name}
              </span>
            </>
          ) : (
            <div className="flex" onClick={() => navigate("/login")}>
              <User size={20} className="mr-1" />
              <span className="hidden md:inline">Sign In</span>
            </div>
          )}
        </div>
      }
    >
      <ProfileMenu user={user} />
    </ProfileHoverModal>
  );
};

export default ProfileSection;
