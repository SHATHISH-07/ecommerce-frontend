import { useNavigate } from "react-router-dom";
import Logo from "./navbar/Logo";

const Footer = () => {
  const navigate = useNavigate();

  const handleNavigateHome = () => {
    window.scrollTo(0, 0);
    navigate("/");
  };

  return (
    <footer className="bg-white dark:bg-black footer-gradient-shadow text-gray-800 dark:text-gray-200 py-6">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0 md:space-x-8">
        {/* Logo & Description */}
        <div className="flex flex-col items-center text-center md:flex-1 md:items-start md:text-left">
          <Logo />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Where your wishlist comes to life.
          </p>
          <a
            href="https://shathish2004.github.io/Shathish-Portfolio/#/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="block py-5 text-lg font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <i className="fa-regular fa-comment"></i> Give FeedBack
          </a>
        </div>

        {/* Navigation & Social Links */}
        <div className="flex-1 flex flex-col items-center space-y-8">
          {/* Navigation */}
          <div className="flex space-x-6">
            <p
              onClick={handleNavigateHome}
              className="cursor-pointer hover:text-gray-400 dark:hover:text-gray-600 transition-colors"
            >
              Home
            </p>
            <a
              href="https://shathish2004.github.io/Shathish-Portfolio/#/about"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-400 dark:hover:text-gray-600 transition-colors"
            >
              About
            </a>
            <a
              href="https://shathish2004.github.io/Shathish-Portfolio/#/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-400 dark:hover:text-gray-600 transition-colors"
            >
              Contact
            </a>
          </div>

          {/* Social Links */}
          <div className="flex flex-row items-center justify-center space-x-8">
            <a
              href="https://github.com/SHATHISH-07"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 hover:text-gray-400 dark:hover:text-gray-600 transition-colors"
              aria-label="GitHub"
            >
              <i className="fa-brands fa-github text-2xl"></i>
              <span className="hidden sm:inline">GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/shathish-kumaran"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              aria-label="LinkedIn"
            >
              <i className="fa-brands fa-linkedin-in text-2xl"></i>
              <span className="hidden sm:inline">LinkedIn</span>
            </a>
            <a
              href="https://shathish2004.github.io/Shathish-Portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 hover:text-green-600 dark:hover:text-green-400 transition-colors"
              aria-label="Portfolio"
            >
              <i className="fa-solid fa-globe text-2xl"></i>
              <span className="hidden sm:inline">Portfolio</span>
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="flex-1 text-center md:text-right text-sm text-gray-500 dark:text-gray-400">
          © 2025{" "}
          <a
            href="https://www.linkedin.com/in/shathish-kumaran"
            className="hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Shathish Kumaran
          </a>
          . All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
