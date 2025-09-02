import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useAppSelector, type RootState } from "../../app/store";

import { GET_USER_CART } from "../../graphql/queries/cart.query";
import LoadingSpinner from "../../components/products/LoadingSpinner";
import { PartyPopper, ShoppingCart } from "lucide-react";
import CartProduct from "../../components/cart/CartProduct";

const Cart = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state: RootState) => state.user.user);

  const { data, loading, error } = useQuery(GET_USER_CART, {
    fetchPolicy: "network-only",
    skip: !user,
  });

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Failed to load cart.</p>
      </div>
    );

  const cart = data?.getUserCart;
  const cartProducts = cart?.products ?? [];

  return (
    <div className="p-4 min-h-screen">
      <div className="mb-4 ml-2">
        <h1 className="text-4xl font-normal text-gray-800 dark:text-gray-300">
          <span>
            <ShoppingCart size={32} className="inline-block mr-2" />
            Your Cart
          </span>
        </h1>
        <p className="text-gray-800 dark:text-gray-400">
          Save your favorite items here.
        </p>
      </div>

      {cartProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 [@media(min-width:352px)_and_(max-width:639px)]:grid-cols-2 sm:grid-cols-2 lg:grid-cols-1 gap-2">
            {cartProducts.map(
              (item: { productId: number; quantity: number }) => (
                <CartProduct
                  key={item.productId}
                  productId={item.productId}
                  quantity={item.quantity}
                />
              )
            )}
          </div>

          <div className="flex justify-center md:justify-end mt-6">
            <button
              onClick={() => navigate("/cart-checkout")}
              className="px-6 py-2 font-semibold text-white rounded-lg bg-gradient-to-r from-[#c9812f] to-blue-500 cursor-pointer"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-[70vh] text-center">
          <PartyPopper size={32} className="text-gray-600 dark:text-gray-400" />
          <p className="text-gray-600 dark:text-gray-400 mt-3">
            Your cart is empty.
          </p>
        </div>
      )}
    </div>
  );
};

export default Cart;
