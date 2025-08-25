import { ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { UserType } from "../../types/User";

interface OrdersSectionProps {
  user: UserType | null;
}

const OrdersSection = ({ user }: OrdersSectionProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => (user ? navigate("/orders") : navigate("/login"))}
      className="orders-section flex items-center cursor-pointer hover:text-black dark:hover:text-white"
    >
      <ShoppingBag size={20} className="mr-1" />
      <span className="hidden md:inline">Orders</span>
    </div>
  );
};

export default OrdersSection;
