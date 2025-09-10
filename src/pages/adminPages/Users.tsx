import { useState } from "react";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import { GET_USERS, GET_USER } from "../../graphql/queries/user.query";
import {
  ACTIVATE_USER,
  DEACTIVATE_USER,
  BAN_USER,
} from "../../graphql/mutations/user";
import { AlertTriangle, Ban, UserRoundCheck, UserX } from "lucide-react";
import LoadingSpinner from "../../components/products/LoadingSpinner";

interface UserData {
  userId: string;
  name: string;
  username: string;
  email: string;
  isActive: boolean;
  isBanned: boolean;
  role: string;
}

const Users = () => {
  const [filters, setFilters] = useState({
    userId: "",
    username: "",
    email: "",
  });
  const [isSearchMode, setIsSearchMode] = useState(false);

  const { data, loading, error, refetch } = useQuery(GET_USERS);
  const [searchUser, { data: searchData, loading: searchLoading }] =
    useLazyQuery(GET_USER);

  const [activateUser] = useMutation(ACTIVATE_USER, {
    onCompleted: () => refetch(),
  });
  const [deactivateUser] = useMutation(DEACTIVATE_USER, {
    onCompleted: () => refetch(),
  });
  const [banUser] = useMutation(BAN_USER, { onCompleted: () => refetch() });

  const handleToggleActive = (user: UserData) => {
    if (user.isActive) {
      deactivateUser({ variables: { userId: user.userId } });
    } else {
      activateUser({ variables: { userId: user.userId } });
    }
  };

  const handleBan = (user: UserData) => {
    banUser({ variables: { userId: user.userId } });
  };

  const handleSearch = () => {
    const variables: Record<string, string> = {};
    if (filters.userId) variables.userId = filters.userId;
    if (filters.username) variables.username = filters.username;
    if (filters.email) variables.email = filters.email;

    if (Object.keys(variables).length > 0) {
      searchUser({ variables });
      setIsSearchMode(true);
    }
  };

  const handleReset = () => {
    setFilters({ userId: "", username: "", email: "" });
    setIsSearchMode(false);
    refetch();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center my-20 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg max-w-lg mx-auto text-center">
        <AlertTriangle className="text-red-500 w-12 h-12 mb-4" />
        <h3 className="text-xl font-semibold text-red-800 dark:text-red-300">
          Oops! Something went wrong.
        </h3>
        <p className="text-red-600 dark:text-red-400 mt-2">
          We couldn't load the categories. Please try again later.
        </p>
        <p className="text-xs text-gray-500 mt-4 italic">
          Error: {error.message}
        </p>
      </div>
    );
  }

  const users: UserData[] =
    isSearchMode && searchData?.getUser
      ? [searchData.getUser]
      : data?.getUsers || [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Users Management</h2>

      {/* Filter Form */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="User ID"
          value={filters.userId}
          onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
          className="border px-3 py-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Username"
          value={filters.username}
          onChange={(e) => setFilters({ ...filters, username: e.target.value })}
          className="border px-3 py-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Email"
          value={filters.email}
          onChange={(e) => setFilters({ ...filters, email: e.target.value })}
          className="border px-3 py-2 rounded w-full"
        />
        <button
          onClick={handleSearch}
          className="border border-blue-600 dark:text-white text-black hover:text-white hover:bg-blue-600 cursor-pointer px-4 py-2 rounded"
        >
          {searchLoading ? "Searching..." : "Search"}
        </button>
        <button
          onClick={handleReset}
          className="border border-gray-500 dark:text-white text-black hover:text-white hover:bg-gray-500 cursor-pointer px-4 py-2 rounded"
        >
          Reset
        </button>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 dark:bg-[#242424]">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Username</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Active</th>
              <th className="p-3 text-left">Banned</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center p-4 text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.userId}
                  className="border-t hover:bg-gray-100 dark:hover:bg-[#242424]"
                >
                  {/* Each text is truncated but shows full on hover */}
                  <td
                    className="p-3 max-w-[150px] truncate"
                    title={user.userId}
                  >
                    {user.userId}
                  </td>
                  <td
                    className="p-3 font-medium max-w-[150px] truncate"
                    title={user.name}
                  >
                    {user.name}
                  </td>
                  <td
                    className="p-3 max-w-[150px] truncate"
                    title={user.username}
                  >
                    {user.username}
                  </td>
                  <td className="p-3 max-w-[200px] truncate" title={user.email}>
                    {user.email}
                  </td>
                  <td className="p-3 max-w-[120px] truncate" title={user.role}>
                    {user.role}
                  </td>
                  <td className="p-3 flex items-center gap-1">
                    {user.isActive ? (
                      <>
                        <UserRoundCheck size={18} className="text-green-600" />
                        <span>Active</span>
                      </>
                    ) : (
                      <>
                        <UserX size={18} className="text-red-600" />
                        <span>Inactive</span>
                      </>
                    )}
                  </td>
                  <td className="p-3">
                    {user.isBanned ? (
                      <span className="flex items-center gap-[2px]">
                        <Ban size={18} className="text-red-600" />
                        <span>Banned</span>
                      </span>
                    ) : (
                      <>---------</>
                    )}
                  </td>
                  <td className="p-3 flex gap-3">
                    {!user.isBanned ? (
                      <>
                        <button
                          onClick={() => handleToggleActive(user)}
                          className={`border px-3 py-1 rounded hover:text-white cursor-pointer ${
                            user.isActive
                              ? "border-yellow-500 hover:bg-yellow-600"
                              : "border-green-500 hover:bg-green-600"
                          }`}
                        >
                          {user.isActive ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          onClick={() => handleBan(user)}
                          className="border border-red-500 px-3 py-1 rounded hover:bg-red-600 hover:text-white cursor-pointer"
                        >
                          Ban
                        </button>
                      </>
                    ) : (
                      <span className="text-red-600 font-medium">
                        No actions
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
