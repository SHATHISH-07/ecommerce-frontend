import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { useAppSelector, type RootState } from "../../app/store";
import {
  GET_ALL_PRODUCTS,
  SEARCH_PRODUCTS,
} from "../../graphql/queries/products.query";
import { GET_USER_CART } from "../../graphql/queries/cart.query";
import { type Product } from "../../types/products";
import LoadingSpinner from "../../components/products/LoadingSpinner";
import ResponsiveProductCard from "../../components/products/ResponsiveProductCard";
import CartProductCard from "../../components/products/CartProductCard";
import { AlertTriangle, PartyPopper, ShoppingCart } from "lucide-react";
import { useState } from "react";

const Products = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");
  const LIMIT = 10;

  const [fetchingMore, setFetchingMore] = useState(false);

  const navigate = useNavigate();

  const user = useAppSelector((state: RootState) => state.user.user);

  const isSearching = !!searchQuery;
  const queryToRun = isSearching ? SEARCH_PRODUCTS : GET_ALL_PRODUCTS;

  const variables = {
    limit: LIMIT,
    skip: 0,
    ...(isSearching && { query: searchQuery }),
  };

  const { data, loading, error, fetchMore } = useQuery(queryToRun, {
    variables,
  });

  const {
    data: cartData,
    loading: cartLoading,
    error: cartError,
  } = useQuery(GET_USER_CART, {
    fetchPolicy: "network-only",
    skip: !user,
  });

  const handleLoadMore = async () => {
    const results = data?.getAllProducts || data?.searchProducts;
    if (!results) return;

    try {
      setFetchingMore(true);
      await fetchMore({
        variables: {
          skip: results.products.length,
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          const dataKey = isSearching ? "searchProducts" : "getAllProducts";

          if (!fetchMoreResult || !fetchMoreResult[dataKey]) {
            return prevResult;
          }

          const newProducts = fetchMoreResult[dataKey].products;
          return {
            [dataKey]: {
              ...prevResult[dataKey],
              products: [...prevResult[dataKey].products, ...newProducts],
            },
          };
        },
      });
    } finally {
      setFetchingMore(false);
    }
  };

  if (loading && !data)
    return (
      <div className="flex justify-center items-center h-screen ">
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

  const results = data?.getAllProducts || data?.searchProducts;
  const products = results?.products ?? [];
  const total = results?.total ?? 0;

  const cartProducts = cartData?.getUserCart?.products ?? [];

  return (
    <div className="flex h-screen">
      <div className="w-full md:w-[85%] overflow-y-auto custom-scrollbar">
        <div className="p-2">
          <h1 className="text-3xl dark:text-gray-300 text-gray-800 font-normal ml-2">
            {isSearching ? `Results for "${searchQuery}"` : "All Products"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 ml-2 mb-4">
            Check each product page for other buying options.
          </p>
        </div>

        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 [@media(min-width:400px)_and_(max-width:639px)]:grid-cols-2 sm:grid-cols-2 lg:grid-cols-1  items-stretch">
              {products.map((product: Product) => (
                <ResponsiveProductCard key={product.id} product={product} />
              ))}
            </div>

            {products.length < total && (
              <div className="text-center mt-8 mb-15">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className=" text-white px-6 py-2 rounded-lg disabled:bg-gray-400 bg-gradient-to-r from-[#c9812f] to-blue-500 cursor-pointer "
                >
                  {fetchingMore ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </>
        ) : (
          <p>No products found.</p>
        )}
      </div>

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
                className="w-full cursor-pointer rounded-lg  px-4 py-2 text-center font-semibold text-white bg-gradient-to-r from-[#c9812f] to-blue-500"
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
                Your cart is empty.Please Login or Signup to add products.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Products;
