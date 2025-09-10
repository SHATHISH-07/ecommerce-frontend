import { useState } from "react";
import { useApolloClient, useMutation } from "@apollo/client";
import { VERIFY_OTP } from "../../graphql/mutations/auth";
import { useNavigate } from "react-router-dom";
import { useAppToast } from "../../utils/useAppToast";
import { checkUserStatus } from "../../utils/checkUserStatus";

const PasswordVerify = () => {
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();

  const client = useApolloClient();

  const storedEmail = localStorage.getItem("resetPasswordEmail");

  const { toastSuccess, toastError } = useAppToast();

  const [verifyOtp, { loading }] = useMutation(VERIFY_OTP, {
    onCompleted: (data) => {
      if (data.verifyPasswordResetOtp.success) {
        toastSuccess("OTP verified successfully!");
        navigate("/changePassword");
      } else {
        toastError(data.verifyPasswordResetOtp.message);
      }
    },
    onError: (err) => toastError(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const valid = checkUserStatus(client);

    if (!valid) return;

    if (!otp) return toastError("OTP is required");
    if (!storedEmail)
      return toastError("Email not found. Please retry the reset process.");

    verifyOtp({ variables: { email: storedEmail, otp } });
  };

  return (
    <div className="h-100">
      <div className="flex justify-center p-6 mt-20">
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-black p-6 rounded-lg space-y-4 signup-shadow w-full max-w-md"
        >
          <h2 className="text-xl font-semibold text-center text-gray-700 dark:text-gray-300">
            Verify OTP
          </h2>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border text-center tracking-[0.5rem] text-2xl p-2 rounded outline-none border-gray-300 dark:border-gray-600"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 cursor-pointer rounded bg-gradient-to-r from-[#c9812f] to-blue-500 text-white font-semibold hover:opacity-90 transition"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordVerify;
