import { useNavigate } from "react-router-dom";
import Logo from "./navbar/Logo";

const Footer = () => {
  const navigate = useNavigate();

  const handleNavigateHome = () => {
    window.scrollTo(0, 0);
    navigate("/");
  };

  return (
    <footer className="relative bg-white dark:bg-black footer-gradient-shadow">
      {/* Glass overlay */}
      <div className="absolute inset-0 "></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Logo & tagline */}
        <div className="flex flex-col items-center md:items-start justify-center space-y-4">
          <Logo />
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Where your wishlist comes to life.
          </p>
          <button
            onClick={handleNavigateHome}
            className="mt-3 px-1 py-2 text-sm font-semibold rounded-x cursor-pointer"
          >
            Back to Home
          </button>
        </div>

        {/* Middle: Navigation */}
        <div className="flex flex-col items-center md:items-center space-y-4">
          <h3 className="font-bold text-lg text-black dark:text-white">
            Quick Links
          </h3>
          <nav className="flex space-x-6 text-sm">
            <a
              href="https://shathish2004.github.io/Shathish-Portfolio/#/about"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition"
            >
              About
            </a>
            <a
              href="https://shathish2004.github.io/Shathish-Portfolio/#/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition"
            >
              Contact
            </a>
            <a
              href="https://shathish2004.github.io/Shathish-Portfolio/#/projects"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition"
            >
              Projects
            </a>
          </nav>
        </div>

        {/* Right: Social */}
        <div className="flex flex-col items-center md:items-end space-y-4">
          <h3 className="font-bold text-lg text-black dark:text-white">
            Connect
          </h3>
          <div className="flex space-x-5">
            <a
              href="https://github.com/SHATHISH-07"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-400 transition"
            >
              <i className="fa-brands fa-github text-2xl"></i>
            </a>
            <a
              href="https://www.linkedin.com/in/shathish-kumaran"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition"
            >
              <i className="fa-brands fa-linkedin-in text-2xl"></i>
            </a>
            <a
              href="https://shathish2004.github.io/Shathish-Portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-400 transition"
            >
              <i className="fa-solid fa-globe text-2xl"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="relative z-10 border-t border-white/10 py-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()}{" "}
        <a
          href="https://www.linkedin.com/in/shathish-kumaran"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Shathish Kumaran
        </a>{" "}
        · All Rights Reserved
      </div>
    </footer>
  );
};

export default Footer;
