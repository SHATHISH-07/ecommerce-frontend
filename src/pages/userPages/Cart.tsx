import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useAppSelector, type RootState } from "../../app/store";

import { GET_USER_CART } from "../../graphql/queries/cart.query";
import LoadingSpinner from "../../components/products/LoadingSpinner";
import { AlertTriangle, ShoppingCart } from "lucide-react";
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

  const cart = data?.getUserCart;
  const cartProducts = cart?.products ?? [];

  return (
    <div>
      {cartProducts.length > 0 ? (
        <>
          <div className="p-4">
            <h1 className="text-4xl font-normal text-gray-800 dark:text-gray-300">
              <span className="flex items-center gap-2">
                <ShoppingCart size={32} />
                Your Cart
              </span>
            </h1>
            <p className="text-gray-800 dark:text-gray-400">
              Save your favorite items here.
            </p>
          </div>
          <div className="grid grid-cols-1 [@media(min-width:420px)_and_(max-width:639px)]:grid-cols-2 sm:grid-cols-2 lg:grid-cols-1 ">
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
        <div className="flex flex-col items-center justify-center h-[80vh] text-center">
          <div className="w-20 h-20 mb-4 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-300">
            <ShoppingCart size={32} color="#c9812f" />
          </div>
          <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
            Your Cart is Empty
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            Looks like you haven’t added any items yet.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 px-6 py-2 bg-gradient-to-r from-[#c9812f] to-blue-500 text-white rounded-lg shadow hover:opacity-90 transition"
          >
            Start Shopping
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
