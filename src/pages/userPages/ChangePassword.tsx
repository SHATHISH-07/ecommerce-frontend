import { useState } from "react";
import { useApolloClient, useMutation } from "@apollo/client";
import { RESET_PASSWORD } from "../../graphql/mutations/auth";
import { useNavigate } from "react-router-dom";
import { useAppToast } from "../../utils/useAppToast";
import { Eye, EyeOff } from "lucide-react";
import { checkUserStatus } from "../../utils/checkUserStatus";

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [reenterPassword, setReenterPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showReenterPassword, setShowReenterPassword] = useState(false);

  const client = useApolloClient();

  const navigate = useNavigate();
  const storedEmail = localStorage.getItem("resetPasswordEmail");
  const { toastSuccess, toastError } = useAppToast();

  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD, {
    onCompleted: (data) => {
      if (data.resetPassword.success) {
        toastSuccess(data.resetPassword.message);
        localStorage.removeItem("resetPasswordEmail");
        navigate("/login");
      } else {
        toastError(data.resetPassword.message);
      }
    },
    onError: (err) => toastError(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const valid = checkUserStatus(client);

    if (!valid) return;

    if (!newPassword || !reenterPassword)
      return toastError("All fields are required");
    if (newPassword !== reenterPassword)
      return toastError("Passwords do not match");
    if (!storedEmail)
      return toastError("Email not found. Please retry the reset process.");

    resetPassword({
      variables: { email: storedEmail, newPassword, reenterPassword },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-black p-6 rounded-lg space-y-4 signup-shadow w-full max-w-md"
      >
        <h2 className="text-xl font-semibold text-center text-gray-700 dark:text-gray-300">
          Change Password
        </h2>

        {/* New Password Field */}
        <div className="relative">
          <input
            type={showNewPassword ? "text" : "password"}
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border p-2 rounded outline-none border-gray-300 dark:border-gray-600 pr-10"
            required
          />
          <span
            className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
            onClick={() => setShowNewPassword((prev) => !prev)}
          >
            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>

        {/* Re-enter Password Field */}
        <div className="relative">
          <input
            type={showReenterPassword ? "text" : "password"}
            placeholder="Re-enter New Password"
            value={reenterPassword}
            onChange={(e) => setReenterPassword(e.target.value)}
            className="w-full border p-2 rounded outline-none border-gray-300 dark:border-gray-600 pr-10"
            required
          />
          <span
            className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
            onClick={() => setShowReenterPassword((prev) => !prev)}
          >
            {showReenterPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded cursor-pointer bg-gradient-to-r from-[#c9812f] to-blue-500 text-white font-semibold hover:opacity-90 transition"
        >
          {loading ? "Updating..." : "Change Password"}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
