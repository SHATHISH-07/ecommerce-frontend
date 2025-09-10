import { useState, useEffect } from "react";
import { useApolloClient, useMutation } from "@apollo/client";
import {
  VERIFY_EMAIL_OTP,
  RESEND_EMAIL_OTP,
  VERIFY_EMAIL_UPDATE_OTP,
} from "../../graphql/mutations/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppToast } from "../../utils/useAppToast";
import { checkUserStatus } from "../../utils/checkUserStatus";

const VerifyEmail = () => {
  const [otp, setOtp] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [resendCount, setResendCount] = useState(0);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const { toastSuccess, toastError } = useAppToast();

  const isSignupFlow = !!localStorage.getItem("signupEmail");

  const client = useApolloClient();

  const navigate = useNavigate();
  const location = useLocation();

  const email =
    location.state?.email ||
    localStorage.getItem("verifyEmail") ||
    localStorage.getItem("signupEmail");

  // Mutations
  const [verifySignupOtp, { loading }] = useMutation(VERIFY_EMAIL_OTP);
  const [verifyUpdateOtp, { loading: updateLoading }] = useMutation(
    VERIFY_EMAIL_UPDATE_OTP
  );
  const [resendOtp, { loading: resendLoading }] = useMutation(RESEND_EMAIL_OTP);

  // Restore cooldown & resend count from localStorage
  useEffect(() => {
    const savedCooldown = localStorage.getItem("otpCooldown");
    const savedResendCount = localStorage.getItem("otpResendCount");

    if (savedCooldown) setCooldown(parseInt(savedCooldown));
    if (savedResendCount) setResendCount(parseInt(savedResendCount));
  }, []);

  useEffect(() => {
    localStorage.setItem("otpCooldown", cooldown.toString());

    let timer: ReturnType<typeof setInterval>;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => {
          const newVal = prev - 1;
          localStorage.setItem("otpCooldown", newVal.toString());
          return newVal;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    localStorage.setItem("otpResendCount", resendCount.toString());
  }, [resendCount]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    const valid = checkUserStatus(client);

    if (!valid) return;

    try {
      let data;

      if (isSignupFlow) {
        if (!email) {
          setMessage({
            type: "error",
            text: "No email found for verification.",
          });
          toastError("No email found for verification.");
          return;
        }
        const res = await verifySignupOtp({ variables: { email, otp } });
        data = res.data;
      } else {
        const res = await verifyUpdateOtp({ variables: { email, otp } });
        data = res.data;
      }

      if (
        (isSignupFlow && data?.verifyEmailOtp) ||
        (!isSignupFlow && data?.verifyEmailUpdateOtp)
      ) {
        localStorage.removeItem("signupEmail");
        localStorage.removeItem("verifyEmail");
        localStorage.removeItem("otpCooldown");
        localStorage.removeItem("otpResendCount");
        setMessage({ type: "success", text: "Email verified successfully!" });

        toastSuccess("Email verified successfully!");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setMessage({ type: "error", text: "Invalid OTP. Try again." });

        toastError("Invalid OTP. Try again.");
      }
    } catch (err: unknown) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Verification failed",
      });

      toastError("Verification failed");
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      setMessage({ type: "error", text: "No email found for OTP resend." });
      return;
    }

    try {
      const valid = checkUserStatus(client);

      if (!valid) return;

      await resendOtp({ variables: { email } });
      setResendCount((prev) => prev + 1);
      setCooldown(60);
      setMessage({ type: "success", text: "OTP resent successfully!" });
      toastSuccess("OTP resent successfully!");
    } catch (err: unknown) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to resend OTP",
      });
      toastError("Failed to resend OTP");
    }
  };

  return (
    <div className="h-100">
      <div className="flex justify-center p-6 mt-20">
        <form
          className="bg-white dark:bg-black p-6 rounded-lg signup-shadow max-w-md w-full"
          onSubmit={handleVerify}
        >
          <h2 className="text-xl font-bold text-center text-gray-700 dark:text-gray-300 mb-6">
            Verify Your Email
          </h2>

          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            placeholder="Enter 6-digit OTP"
            className="w-full border border-gray-300 p-2 rounded text-center tracking-[0.5em] text-lg md:text-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            disabled={loading || updateLoading}
            className="mt-4 w-full py-2 font-semibold border bg-gradient-to-r from-[#c9812f] to-blue-500 border-gray-300 text-white rounded cursor-pointer"
          >
            {loading || updateLoading ? "Verifying..." : "Verify"}
          </button>

          {/* Success/Error Message */}
          {message && (
            <p
              className={`mt-3 text-center font-medium ${
                message.type === "success" ? "text-green-600" : "text-red-500"
              }`}
            >
              {message.text}
            </p>
          )}

          {/* Resend OTP Section */}
          <div className="text-center mt-3">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Didn’t get the OTP?{" "}
              <span
                onClick={
                  cooldown > 0 || resendCount >= 5 || resendLoading
                    ? undefined
                    : handleResendOtp
                }
                className={`font-semibold cursor-pointer ${
                  cooldown > 0 || resendCount >= 5 || resendLoading
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-blue-500 hover:underline"
                }`}
              >
                {resendCount >= 5
                  ? "Limit Reached"
                  : cooldown > 0
                  ? `Resend in ${cooldown}s`
                  : "Resend OTP"}
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;
