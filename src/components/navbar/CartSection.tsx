import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { UserType } from "../../types/User";
import { GET_USER_CART_COUNT } from "../../graphql/queries/cart.query";
import { useQuery } from "@apollo/client";

interface CartSectionProps {
  user: UserType | null;
}

const CartSection = ({ user }: CartSectionProps) => {
  const navigate = useNavigate();

  const { data, loading } = useQuery(GET_USER_CART_COUNT, {
    fetchPolicy: "network-only",
    skip: !user,
  });

  const cartCount = loading ? null : data?.getUserCart?.totalItems;

  return (
    <div
      onClick={() => (user ? navigate("/cart") : navigate("/login"))}
      className="cart-section flex items-center cursor-pointer hover:text-black dark:hover:text-white relative"
    >
      <ShoppingCart size={20} />
      <span className="hidden md:inline ml-1">Cart</span>
      {user && (
        <span className="absolute -top-3 -right-3 bg-gradient-to-r from-[#c9812f] to-blue-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
          {cartCount}
        </span>
      )}
    </div>
  );
};

export default CartSection;
