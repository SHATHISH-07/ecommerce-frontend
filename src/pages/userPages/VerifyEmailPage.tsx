import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import {
  VERIFY_EMAIL_OTP,
  RESEND_EMAIL_OTP,
} from "../../graphql/mutations/auth";
import { useNavigate, useLocation } from "react-router-dom";

const VerifyEmail = () => {
  const [otp, setOtp] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [resendCount, setResendCount] = useState(0);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || localStorage.getItem("signupEmail");

  const [verifyEmailOtp, { loading }] = useMutation(VERIFY_EMAIL_OTP);
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

    if (!email) {
      setMessage({ type: "error", text: "No email found for verification." });
      return;
    }

    try {
      const { data } = await verifyEmailOtp({ variables: { email, otp } });

      if (data?.verifyEmailOtp) {
        localStorage.removeItem("signupEmail");
        localStorage.removeItem("otpCooldown");
        localStorage.removeItem("otpResendCount");
        setMessage({ type: "success", text: "Email verified successfully!" });

        setTimeout(() => navigate("/login"), 1500);
      } else {
        setMessage({ type: "error", text: "Invalid OTP. Try again." });
      }
    } catch (err: unknown) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Verification failed",
      });
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      setMessage({ type: "error", text: "No email found for OTP resend." });
      return;
    }

    try {
      await resendOtp({ variables: { email } });
      setResendCount((prev) => prev + 1);
      setCooldown(60);
      setMessage({ type: "success", text: "OTP resent successfully!" });
    } catch (err: unknown) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to resend OTP",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
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
          className="w-full border border-gray-300 p-2 rounded text-center tracking-[0.5em] text-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full py-2 font-semibold border bg-gradient-to-r from-[#c9812f] to-blue-500 border-gray-300 text-white rounded cursor-pointer"
        >
          {loading ? "Verifying..." : "Verify"}
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
  );
};

export default VerifyEmail;
