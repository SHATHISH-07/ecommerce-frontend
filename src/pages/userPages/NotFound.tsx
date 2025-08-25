import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-black text-gray-800 dark:text-gray-200">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">Oops! Page not found.</p>
      <button
        onClick={() => navigate("/", { replace: true })}
        className="px-6 py-3 bg-gradient-to-r from-[#c9812f] to-blue-500 text-white rounded-md hover:opacity-90 transition"
      >
        Go Home
      </button>
    </div>
  );
};

export default NotFound;
