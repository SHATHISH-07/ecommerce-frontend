import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { DELETE_ACCOUNT } from "../../graphql/mutations/user";
import { useAppToast } from "../../utils/useAppToast";
import { useAppSelector, type RootState } from "../../app/store";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearUser } from "../../app/slices/userSlice";

const AccountSettings = () => {
  const user = useAppSelector((state: RootState) => state.user.user);

  const { toastSuccess, toastError } = useAppToast();

  const [showModal, setShowModal] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [deleteAccount, { loading }] = useMutation(DELETE_ACCOUNT, {
    onCompleted: (data) => {
      if (data.deleteAccount.success) {
        toastSuccess(data.deleteAccount.message);
        dispatch(clearUser());
        localStorage.clear();
        navigate("/login");
      } else {
        toastError(data.deleteAccount.message);
      }
    },
    onError: (err) => {
      console.error(err);
      toastError("Failed to delete account");
    },
  });

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

  if (!user) {
    return null;
  }

  const handleDelete = () => {
    if (emailInput !== user.email) {
      toastError("Email does not match");
      return;
    }
    if (!passwordInput) {
      toastError("Password is required");
      return;
    }

    deleteAccount({
      variables: {
        email: emailInput,
        password: passwordInput,
      },
    });
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-5 m-10">
      <button
        className="w-48 py-2 px-4 rounded-lg border border-red-500 text-red-500 font-medium hover:bg-red-500 cursor-pointer hover:text-white transition"
        onClick={() => {
          localStorage.clear();
          window.location.href = "/login";
        }}
      >
        Sign Out
      </button>

      <button
        className="w-48 py-2 px-4 cursor-pointer rounded-lg border border-red-500 text-red-500 font-medium hover:bg-red-500 hover:text-white transition"
        onClick={() => setShowModal(true)}
      >
        Delete Account
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-300/90 dark:bg-black/90 z-50">
          <div className="bg-white dark:bg-[#1c1c1c] p-6 rounded-lg w-80 flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Confirm Account Deletion
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Enter your email and password to confirm.
            </p>
            <input
              type="email"
              placeholder="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-md outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-md outline-none"
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                className="px-4 py-2 rounded-md cursor-pointer hover:bg-gray-300  text-black dark:text-white hover:text-black border border-gray-300"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 cursor-pointer rounded-md border border-red-500 hover:bg-red-600 text-black hover:text-white dark:text-white"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;
