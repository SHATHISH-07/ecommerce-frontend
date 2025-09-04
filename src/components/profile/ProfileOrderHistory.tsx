import { GET_PRODUCTS_BY_IDS } from "../../graphql/queries/products.query";
import { useQuery } from "@apollo/client";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import type { UserType } from "../../types/User";
import { useNavigate } from "react-router-dom";

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
    skip: productIds.length === 0, // don't run if no ids
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data || data.getProductsByIds.length === 0)
    return <div>No products found in your history.</div>;

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
