import { SIGNUP_MUTATION } from "../../graphql/mutations/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { SignupInput } from "../../graphql/types/auth.types";
import { useMutation } from "@apollo/client";
import { useAppToast } from "../../utils/useAppToast";

const SignUp = () => {
  const navigate = useNavigate();

  const { toastError } = useAppToast();

  const [step, setStep] = useState<number>(1);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<SignupInput>({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  });

  const [signupMutation, { loading, error }] = useMutation(SIGNUP_MUTATION);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const nextStep = () => setStep(2);
  const prevStep = () => setStep(1);

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    try {
      const { data } = await signupMutation({
        variables: { input: formData },
      });

      // console.log("Signup response:", data);

      if (data?.signup?.success) {
        setSuccessMessage("Account created! Please verify your email.");
        navigate("/verify-email", { state: { email: formData.email } });
        localStorage.setItem("signupEmail", formData.email);
      } else {
        toastError("Failed to create account");
      }
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      <div className="max-w-lg w-full">
        <h2 className="text-3xl font-bold text-center text-gray-700 dark:text-gray-300 my-10">
          Register to NexKart
        </h2>

        <form
          onSubmit={handleSignUpSubmit}
          className="bg-white dark:bg-black p-6 rounded-lg signup-shadow"
        >
          {/* Feedback messages */}
          {loading && (
            <p className="text-blue-500 text-center mb-4">
              Creating account...
            </p>
          )}
          {error && (
            <p className="text-red-500 text-center mb-4">
              {error.message || "Something went wrong"}
            </p>
          )}
          {successMessage && (
            <p className="text-green-600 text-center mb-4">{successMessage}</p>
          )}

          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-7">
              {/* Name */}
              <div>
                <label className="block text-md font-medium text-gray-700 dark:text-gray-300">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  placeholder="name"
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-md font-medium text-gray-700 dark:text-gray-300">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  placeholder="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-md font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-md font-medium text-gray-700 dark:text-gray-300">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-md font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-4 py-2 border text-white border-white bg-gradient-to-r from-[#c9812f] to-blue-500 rounded cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-4">
              {/* Address */}
              <div>
                <label className="block text-md font-medium text-gray-700 dark:text-gray-300">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  placeholder="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-md font-medium text-gray-700 dark:text-gray-300">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  placeholder="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-md font-medium text-gray-700 dark:text-gray-300">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  placeholder="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-md font-medium text-gray-700 dark:text-gray-300">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  placeholder="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Zipcode */}
              <div>
                <label className="block text-md font-medium text-gray-700 dark:text-gray-300">
                  ZipCode
                </label>
                <input
                  type="text"
                  name="zipCode"
                  placeholder="zipcode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-4 py-2 font-semibold border bg-gradient-to-r from-[#c9812f] to-blue-500 border-gray-300 text-white rounded cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 font-semibold border bg-gradient-to-r from-[#c9812f] to-blue-500 border-gray-300 text-white rounded cursor-pointer"
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          )}

          <p className="text-md text-center mt-15 text-gray-600 dark:text-gray-300">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:underline cursor-pointer dark:text-blue-400"
            >
              sign in
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
