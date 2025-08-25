import logo from "/logo.svg";
import { useNavigate } from "react-router-dom";

const Logo = () => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate("/")}
      className="flex items-center cursor-pointer"
    >
      <img src={logo} alt="NexKart" className="w-20 h-12 object-cover" />
    </div>
  );
};

export default Logo;
