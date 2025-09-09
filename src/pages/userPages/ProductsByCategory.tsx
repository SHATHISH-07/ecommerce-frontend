import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { useAppSelector, type RootState } from "../../app/store";
import { GET_PRODUCTS_BY_CATEGORY } from "../../graphql/queries/category.query";
import { GET_USER_CART } from "../../graphql/queries/cart.query";
import LoadingSpinner from "../../components/products/LoadingSpinner";
import ResponsiveProductCard from "../../components/products/ResponsiveProductCard";
import CartProductCard from "../../components/products/CartProductCard";
import { AlertTriangle, PartyPopper, ShoppingCart } from "lucide-react";
import { type Product } from "../../types/products";

const ProductsByCategory = () => {
  const { categorySlug } = useParams();
  const navigate = useNavigate();

  const user = useAppSelector((state: RootState) => state.user.user);

  const { data, loading, error } = useQuery(GET_PRODUCTS_BY_CATEGORY, {
    variables: { categorySlug },
    skip: !categorySlug,
  });

  const {
    data: cartData,
    loading: cartLoading,
    error: cartError,
  } = useQuery(GET_USER_CART, {
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
          We couldn't load the products. Please try again later.
        </p>
      </div>
    );
  }

  const products = data?.getProductsByCategory?.products ?? [];
  const cartProducts = cartData?.getUserCart?.products ?? [];

  return (
    <div className="flex h-screen">
      {/* Left side - Products */}
      <div className="w-full md:w-[85%] overflow-y-auto custom-scrollbar">
        <div className="p-3">
          <h1 className="text-3xl dark:text-gray-300 text-gray-800 font-normal ml-2">
            Products in {categorySlug}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 ml-2 mb-4">
            Browse all products under this category.
          </p>
        </div>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 [@media(min-width:352px)_and_(max-width:639px)]:grid-cols-2 sm:grid-cols-2 lg:grid-cols-1">
            {products.map((product: Product) => (
              <ResponsiveProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No products found.</p>
        )}
      </div>

      {/* Right side - Cart */}
      <div className="hidden md:block md:w-[15%] p-3 border-l overflow-y-scroll custom-scrollbar dark:border-gray-800">
        {user && (
          <div className="flex justify-center gap-3 pb-3">
            <ShoppingCart size={24} color="#c9812f" />
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">
              Your Cart
            </h3>
          </div>
        )}
        {cartLoading && (
          <p className="text-sm text-gray-400">Loading cart...</p>
        )}
        {cartError && (
          <p className="text-sm text-red-500">Could not load cart.</p>
        )}

        {cartProducts.length > 0 ? (
          <div>
            {cartProducts.map((item: { productId: number }) => (
              <CartProductCard
                key={item.productId}
                productId={item.productId}
              />
            ))}
            <div className="mt-4 px-2 mb-16">
              <button
                onClick={() => navigate("/cart")}
                className="w-full cursor-pointer rounded-lg px-4 py-2 text-center font-semibold text-white bg-gradient-to-r from-[#c9812f] to-blue-500"
              >
                Go to Cart
              </button>
            </div>
          </div>
        ) : (
          !cartLoading && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <PartyPopper
                size={24}
                className="text-gray-600 dark:text-gray-400"
                color="#c9812f"
              />
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                Your cart is empty. Please Login or Signup to add products.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ProductsByCategory;
