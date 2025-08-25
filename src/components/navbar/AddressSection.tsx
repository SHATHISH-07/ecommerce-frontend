import { useRef } from "react";
import PopOverModal from "../PopoverModal";
import type { UserType } from "../../types/User";
import { useNavigate } from "react-router-dom";

interface AddressSectionProps {
  user: UserType | null;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

const AddressSection = ({
  user,
  isModalOpen,
  setIsModalOpen,
}: AddressSectionProps) => {
  const addressRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  return (
    <>
      <div
        ref={addressRef}
        onClick={() => {
          if (!user) {
            navigate("/login");
            return;
          }
          setIsModalOpen(true);
        }}
        className="lg:hidden xl:block hidden md:flex items-center text-gray-600 dark:text-gray-400 cursor-pointer hover:text-black dark:hover:text-white"
      >
        <div className="flex items-center whitespace-nowrap overflow-hidden">
          <span className="text-sm">Deliver to</span>
          <span className="ml-2 font-medium text-md block max-w-[100px] truncate overflow-hidden">
            {user?.address ?? "Login to set address"}
          </span>
        </div>
      </div>

      {user && (
        <PopOverModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          title="Your Address"
          anchorRef={addressRef}
        >
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300 border border-black dark:border-white p-3 rounded-lg mb-6">
              {user.address || "No address set yet."}
            </p>
            <button className="px-4 py-2 cursor-pointer text-white rounded-md bg-gradient-to-r from-[#c9812f] to-blue-500">
              Change Address
            </button>
          </div>
        </PopOverModal>
      )}
    </>
  );
};

export default AddressSection;
