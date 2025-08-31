import { BadgeX, UserCheck, UserX, Verified } from "lucide-react";
import { type UserType } from "../../types/User";

interface ProfileCardProps {
  user: UserType;
}

const ProfileCard = ({ user }: ProfileCardProps) => {
  return (
    <div className="flex flex-col justify-start items-center w-full sm:w-[90%] md:w-[400px] h-auto lg:h-[85vh] rounded-md bg-white dark:bg-black signup-shadow p-5 md:p-0">
      <div className="rounded-full mt-5 avatar-shadow">
        <img
          src="/logo.svg"
          alt="NxKart"
          className="bg-white dark:bg-black p-4 w-35 h-35 rounded-full object-contain"
        />
      </div>

      <div className="p-5 space-y-5 text-center w-full">
        {/* Name */}
        <h3 className="text-md md:text-xl font-semibold text-gray-900 dark:text-white">
          <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">
            Name
          </span>
          <div className="flex items-center justify-center gap-2 mt-1 flex-wrap">
            <span className="text-2xl">{user.name}</span>
            {user.isActive ? (
              <UserCheck size={20} className="text-green-500" />
            ) : (
              <UserX size={20} className="text-red-500" />
            )}
          </div>
        </h3>

        {/* Username */}
        <h3 className="text-md md:text-xl font-semibold text-gray-900 dark:text-white">
          <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">
            Username
          </span>
          {user.username}
        </h3>

        {/* Email */}
        <h3 className="text-md md:text-xl font-semibold text-gray-900 dark:text-white">
          <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">
            Email
          </span>
          <div className="flex items-center justify-center gap-2 mt-1 flex-wrap">
            <span>{user.email}</span>
            {user.emailVerified ? (
              <Verified size={20} className="text-green-500" />
            ) : (
              <BadgeX size={20} className="text-red-500" />
            )}
          </div>
        </h3>

        {/* Phone */}
        <h3 className="text-md md:text-xl font-semibold text-gray-900 dark:text-white">
          <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">
            Phone
          </span>
          {user.phone}
        </h3>

        {/* Address */}
        <h3 className="text-md md:text-xl font-semibold text-gray-900 dark:text-white">
          <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">
            Address
          </span>
          {user.address}
        </h3>
      </div>
    </div>
  );
};

export default ProfileCard;
