import { GET_PRODUCTS_BY_IDS } from "../../graphql/queries/products.query";
import { useQuery } from "@apollo/client";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import type { UserType } from "../../types/User";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../products/LoadingSpinner";
import { AlertTriangle } from "lucide-react";

interface Product {
  id: number;
  title: string;
  thumbnail?: string;
  price: number;
  returnPolicy?: string;
}

interface QueryResult {
  getProductsByIds: Product[];
}

const ProfileOrderHistory = ({ user }: { user: UserType | null }) => {
  const navigate = useNavigate();

  const productIds =
    user?.userOrderHistory?.map((order) => order.orderId) ?? [];

  // console.log("productIds", productIds);

  const { loading, error, data } = useQuery<QueryResult>(GET_PRODUCTS_BY_IDS, {
    variables: { ids: productIds },
    skip: productIds.length === 0,
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center my-20 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg max-w-lg mx-auto text-center">
        <AlertTriangle className="text-red-500 w-12 h-12 mb-4" />
        <h3 className="text-xl font-semibold text-red-800 dark:text-red-300">
          Oops! Something went wrong.
        </h3>
        <p className="text-red-600 dark:text-red-400 mt-2">
          We couldn't load the Order History. Please try again later.
        </p>
        <p className="text-xs text-gray-500 mt-4 italic">
          Error: {error.message}
        </p>
      </div>
    );
  }
  if (!data || data.getProductsByIds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center my-20 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg max-w-lg mx-auto text-center">
        <p className="text-red-600 dark:text-red-400 mt-2">
          We couldn't find any Order History. Buy some products.
        </p>
      </div>
    );
  }

  const products = data.getProductsByIds;

  return (
    <Collapsible className="w-full">
      <div className="w-full max-w-6xl mx-auto">
        {/* Trigger */}
        <CollapsibleTrigger asChild>
          <button className="w-[80vw] mx-auto flex justify-between items-center cursor-pointer p-4 mb-4 font-semibold text-2xl text-left text-gray-700 dark:text-gray-200 border dark:border-gray-300 border-black rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition">
            <span className="flex items-center mx-auto gap-5 ">
              Your Ordered Products{" "}
              <span className="text-md text-gray-500 dark:text-gray-400">
                ({products.length})
              </span>
            </span>
          </button>
        </CollapsibleTrigger>

        {/* Content */}
        <CollapsibleContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/products/${product.id}`)}
                className="flex flex-col justify-between cursor-pointer border rounded-lg shadow-sm border-black dark:border-gray-300 bg-white dark:bg-[#1e1e1e] p-4 h-full hover:shadow-md transition"
              >
                {/* Image */}
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-full h-48 object-contain rounded-md mb-4"
                />

                {/* Product info */}
                <div className="flex flex-col flex-1 justify-between">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-base text-center mb-2">
                    {product.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-1">
                    ${product.price}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    {product.returnPolicy || "No return policy"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export default ProfileOrderHistory;
