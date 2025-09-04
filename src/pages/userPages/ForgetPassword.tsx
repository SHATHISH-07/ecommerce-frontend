import { useState } from "react";
import { useMutation } from "@apollo/client";
import { INITIATE_RESET_PASSWORD } from "../../graphql/mutations/auth";
import { useNavigate } from "react-router-dom";
import { useAppToast } from "../../utils/useAppToast";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { toastSuccess, toastError } = useAppToast();

  const [initiateResetPassword, { loading }] = useMutation(
    INITIATE_RESET_PASSWORD,
    {
      onCompleted: (data) => {
        if (data.initiateResetPassword.success) {
          toastSuccess(data.initiateResetPassword.message);
          navigate("/reset-password-verify");
        } else {
          toastError(data.initiateResetPassword.message);
        }
      },
      onError: (err) => toastError(err.message),
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toastError("Email is required");

    localStorage.setItem("resetPasswordEmail", email);

    initiateResetPassword({ variables: { email } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-black p-6 rounded-lg space-y-4 signup-shadow w-full max-w-md"
      >
        <h2 className="text-xl font-semibold text-center text-gray-700 dark:text-gray-300">
          Reset Password
        </h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded outline-none border-gray-300 dark:border-gray-600"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 cursor-pointer rounded bg-gradient-to-r from-[#c9812f] to-blue-500 text-white font-semibold hover:opacity-90 transition"
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
      </form>
    </div>
  );
};

export default ForgetPassword;
