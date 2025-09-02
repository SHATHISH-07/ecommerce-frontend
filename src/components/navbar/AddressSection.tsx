import { useRef, useState } from "react";
import PopOverModal from "./PopoverModal";
import type { UserType } from "../../types/User";
import { useNavigate } from "react-router-dom";
import { UPDATE_USER_ADDRESS } from "../../graphql/mutations/user";
import { useApolloClient, useMutation } from "@apollo/client";
import { refetchAndStoreUser } from "../../utils/refetchUser";
import { useAppDispatch } from "../../app/store";
import { useAppToast } from "../../utils/useAppToast";

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

  const client = useApolloClient();
  const dispatch = useAppDispatch();

  const [newAddress, setNewAddress] = useState("");

  const { toastSuccess, toastError } = useAppToast();

  const [updateUserAddress, { loading }] = useMutation(UPDATE_USER_ADDRESS);

  const handleChangeAddress = async () => {
    try {
      const { data } = await updateUserAddress({
        variables: {
          input: {
            address: newAddress,
          },
        },
      });
      if (data) {
        await refetchAndStoreUser(client, dispatch);
        setNewAddress("");
        toastSuccess("Address updated successfully");
      }
    } catch (err) {
      console.error(err);
      toastError("Failed to update address");
    }
  };

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

            <textarea
              onChange={(e) => setNewAddress(e.target.value)}
              value={newAddress}
              placeholder="New address . . ."
              className="border border-black dark:border-gray-300 rounded-md px-3 py-2 w-full"
              cols={30}
              rows={3}
            ></textarea>
            <button
              onClick={handleChangeAddress}
              className="px-4 py-2 cursor-pointer text-white rounded-md bg-gradient-to-r from-[#c9812f] to-blue-500"
            >
              {loading ? "Saving..." : "Save Address"}
            </button>
          </div>
        </PopOverModal>
      )}
    </>
  );
};

export default AddressSection;
