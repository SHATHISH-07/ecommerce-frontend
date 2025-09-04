import { useMutation, useApolloClient } from "@apollo/client";
import {
  UPDATE_USER_DETAILS,
  UPDATE_USER_EMAIL,
  UPDATE_USER_PASSWORD,
} from "../../graphql/mutations/user";
import { RESEND_EMAIL_OTP } from "../../graphql/mutations/auth";
import { type UserType } from "../../types/User";
import { useState } from "react";
import { useAppToast } from "../../utils/useAppToast";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/store";
import { refetchAndStoreUser } from "../../utils/refetchUser";

interface EditProfileFormProps {
  user: UserType;
}

const EditProfileForm = ({ user }: EditProfileFormProps) => {
  const { toastSuccess, toastError } = useAppToast();
  const navigate = useNavigate();
  const client = useApolloClient();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    name: user.name || "",
    username: user.username || "",
    phone: user.phone || "",
    city: user.city || "",
    state: user.state || "",
    country: user.country || "",
    zipCode: user.zipCode || "",
    address: user.address || "",
  });

  const [newEmail, setNewEmail] = useState(user.email || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // --- Profile Update ---
  const [updateUserProfile, { loading: profileLoading }] = useMutation(
    UPDATE_USER_DETAILS,
    {
      onCompleted: async () => {
        await refetchAndStoreUser(client, dispatch);
        toastSuccess("Profile updated successfully");
      },
      onError: (err) => {
        console.error(err);
        toastError("Failed to update profile");
      },
    }
  );

  // --- Update Email ---
  const [updateUserEmail, { loading: emailLoading }] = useMutation(
    UPDATE_USER_EMAIL,
    {
      onCompleted: async (data) => {
        const updatedEmail = data?.updateUserEmail?.email;
        if (updatedEmail && updatedEmail === newEmail) {
          localStorage.setItem("verifyEmail", updatedEmail);
          await refetchAndStoreUser(client, dispatch);
          toastSuccess("OTP sent to your new email. Please verify.");
          navigate("/verify-email");
        } else {
          toastError("Email not changed.");
        }
      },
      onError: (err) => {
        console.error(err);
        toastError("Failed to update email");
      },
    }
  );

  // --- Resend OTP ---
  const [resendEmailOtp, { loading: resendLoading }] = useMutation(
    RESEND_EMAIL_OTP,
    {
      onCompleted: async (data) => {
        if (data?.resendEmailOTP?.success) {
          await refetchAndStoreUser(client, dispatch);
          toastSuccess("OTP resent. Please check your email.");
          navigate("/verify-email");
        } else {
          toastError("Failed to resend OTP");
        }
      },
      onError: (err) => {
        console.error(err);
        toastError("Failed to resend OTP");
      },
    }
  );

  const [updatePassword, { loading: updatePasswordLoading }] = useMutation(
    UPDATE_USER_PASSWORD,
    {
      onCompleted: async (data) => {
        if (data?.updatePassword?.success) {
          toastSuccess("User password updated successfully");
        } else {
          toastError("Failed to update password");
        }
      },
      onError: (err) => {
        console.error(err);
        toastError("Failed to update password");
      },
    }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedFields: Partial<typeof formData> = {};
    Object.keys(formData).forEach((key) => {
      const typedKey = key as keyof typeof formData;
      if (formData[typedKey] !== (user[typedKey] || "")) {
        updatedFields[typedKey] = formData[typedKey];
      }
    });

    if (Object.keys(updatedFields).length === 0) {
      toastError("No changes detected");
      return;
    }

    updateUserProfile({ variables: { input: updatedFields } });
  };

  const handleEmailUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (newEmail === user.email) {
      toastError("No changes detected in email");
      return;
    }

    updateUserEmail({ variables: { input: { email: newEmail } } });
  };

  const handleVerifyEmail = () => {
    if (!newEmail) {
      toastError("Email not set for verification");
      return;
    }

    localStorage.setItem("verifyEmail", newEmail);
    resendEmailOtp({ variables: { email: newEmail } });
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword) {
      toastError("Please fill both current and new password fields");
      return;
    }

    if (currentPassword === newPassword) {
      toastError("New password cannot be the same as current password");
      return;
    }

    updatePassword({
      variables: {
        currentPassword,
        newPassword,
      },
    }).then(() => {
      setCurrentPassword("");
      setNewPassword("");
    });
  };

  return (
    <div className="w-full sm:w-[90%] md:w-[650px] h-auto md:h-[85vh] rounded-md bg-white dark:bg-black signup-shadow mb-5">
      <div className="p-2 md:p-8 overflow-y-auto h-full custom-scrollbar">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-300 text-center pb-5">
          Edit Profile
        </h2>

        {/* Profile Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Name & Username */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium">Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="p-2 border border-black dark:border-gray-300 rounded-md outline-none"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium">Username</label>
              <input
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="p-2 border border-black dark:border-gray-300 rounded-md outline-none"
              />
            </div>
          </div>

          {/* Phone & City */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium">Phone</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="p-2 border border-black dark:border-gray-300 rounded-md outline-none"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium">City</label>
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="p-2 border border-black dark:border-gray-300 rounded-md outline-none"
              />
            </div>
          </div>

          {/* State & Country */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium">State</label>
              <input
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="p-2 border border-black dark:border-gray-300 rounded-md outline-none"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium">Country</label>
              <input
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="p-2 border border-black dark:border-gray-300 rounded-md outline-none"
              />
            </div>
          </div>

          {/* Zipcode */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">Zipcode</label>
            <input
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              className="p-2 border border-black dark:border-gray-300 rounded-md outline-none"
            />
          </div>

          {/* Address */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="p-2 border border-black dark:border-gray-300 rounded-md h-24 outline-none"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={profileLoading}
              className="px-5 py-2 rounded-md text-white font-medium bg-gradient-to-r from-[#c9812f] to-blue-500 hover:opacity-90 transition cursor-pointer disabled:opacity-50"
            >
              {profileLoading ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </form>

        {/* Email Update */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Email Settings</h2>
          <form onSubmit={handleEmailUpdate} className="space-y-4">
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="p-2 border border-black dark:border-gray-300 rounded-md outline-none"
              />
            </div>
            <div className="flex gap-4 justify-end">
              <button
                type="submit"
                disabled={emailLoading}
                className="px-5 py-2 rounded-md text-white font-medium bg-gradient-to-r from-[#c9812f] to-blue-500 hover:opacity-90 transition cursor-pointer disabled:opacity-50"
              >
                {emailLoading ? "Updating..." : "Update Email"}
              </button>

              {!user.emailVerified && (
                <button
                  type="button"
                  onClick={handleVerifyEmail}
                  disabled={resendLoading}
                  className="px-5 py-2 rounded-md text-white font-medium bg-gradient-to-r from-[#c9812f] to-blue-500 hover:opacity-90 transition cursor-pointer disabled:opacity-50"
                >
                  {resendLoading ? "Sending..." : "Verify Email"}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Update Password */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Password Settings</h2>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium">
                Current Password
              </label>
              <input
                type="text"
                name="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="p-2 border border-black dark:border-gray-300 rounded-md outline-none"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium">New Password</label>
              <input
                type="text"
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="p-2 border border-black dark:border-gray-300 rounded-md outline-none"
              />
            </div>
            <div className="flex gap-4 justify-end">
              <button
                type="submit"
                disabled={updatePasswordLoading}
                className="px-5 py-2 rounded-md text-white font-medium bg-gradient-to-r from-[#c9812f] to-blue-500 hover:opacity-90 transition cursor-pointer disabled:opacity-50"
              >
                {updatePasswordLoading ? "Updating..." : "Update Password"}
              </button>

              {!user.emailVerified && (
                <button
                  type="button"
                  onClick={handleVerifyEmail}
                  disabled={resendLoading}
                  className="px-5 py-2 rounded-md text-white font-medium bg-gradient-to-r from-[#c9812f] to-blue-500 hover:opacity-90 transition cursor-pointer disabled:opacity-50"
                >
                  {resendLoading ? "Sending..." : "Verify Email"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfileForm;
