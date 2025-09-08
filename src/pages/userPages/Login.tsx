import { useState } from "react";
import { useMutation, useApolloClient } from "@apollo/client";
import { LOGIN_MUTATION } from "../../graphql/mutations/auth";
import { GET_CURRENT_USER } from "../../graphql/queries/user.query";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/store";
import { setCurrentUser } from "../../app/slices/userSlice";
import type { LoginInput } from "../../graphql/types/auth.types";
import { refetchAndStoreUser } from "../../utils/refetchUser";
import { Eye, EyeOff } from "lucide-react";
import { useAppToast } from "../../utils/useAppToast";

const Login = () => {
  const [formData, setFormData] = useState<LoginInput>({
    loginIdentifier: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const client = useApolloClient();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { toastSuccess, toastError } = useAppToast();

  const [login, { loading, error }] = useMutation(LOGIN_MUTATION);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    localStorage.removeItem("token");

    try {
      const { data } = await login({
        variables: {
          loginIdentifier: formData.loginIdentifier,
          password: formData.password,
        },
      });

      if (data?.login?.token) {
        localStorage.setItem("token", data.login.token);
        await client.resetStore();
        await refetchAndStoreUser(client, dispatch);

        const { data: userData } = await client.query({
          query: GET_CURRENT_USER,
          fetchPolicy: "network-only",
        });

        if (userData?.getCurrentUser) {
          const currentUser = userData.getCurrentUser;
          dispatch(setCurrentUser(currentUser));
        }

        setSuccessMessage("Login successful! Redirecting...");
        toastSuccess("Login successful!");
        if (userData?.getCurrentUser?.role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          setTimeout(() => {
            navigate("/", { replace: true });
          }, 1500);
        }
      }
    } catch (err) {
      console.error("Login failed:", err);
      toastError("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      <div className="max-w-lg w-full">
        <h2 className="text-3xl font-bold text-center text-gray-700 dark:text-gray-300 my-10">
          Login to NexKart
        </h2>
        <form
          className="bg-white dark:bg-black p-6 rounded-lg shadow-md space-y-5 signup-shadow"
          onSubmit={handleLoginSubmit}
        >
          {/* Username / Email */}
          <div>
            <label className="block text-md font-medium text-gray-700 dark:text-gray-300">
              Username or Email
            </label>
            <input
              type="text"
              name="loginIdentifier"
              value={formData.loginIdentifier}
              placeholder="username or email"
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password with Show/Hide */}
          <div>
            <label className="block text-md font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                placeholder="password"
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <span
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
            <p className="text-md text-center mt-4 text-gray-600 dark:text-gray-300">
              <span
                onClick={() => navigate("/forgetPassword")}
                className="text-blue-600 hover:underline cursor-pointer dark:text-blue-400"
              >
                Forgot Password?
              </span>
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-[40%] mt-10 mx-auto block bg-gradient-to-r from-[#c9812f] to-blue-500 text-white font-bold py-2 px-4 rounded cursor-pointer hover:opacity-90 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Messages */}
          {error && (
            <p className="text-red-500 text-center mt-2"> {error.message}</p>
          )}
          {successMessage && (
            <p className="text-green-600 text-center mt-2">{successMessage}</p>
          )}

          <p className="text-md text-center mt-5 text-gray-600 dark:text-gray-300">
            Don&apos;t have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-blue-600 hover:underline cursor-pointer dark:text-blue-400"
            >
              Sign up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
