import { useQuery } from "@apollo/client";
import LoadingSpinner from "../../components/products/LoadingSpinner";
import { GET_PRODUCT_BY_ID } from "../../graphql/queries/products.query";
import ResponsiveCartCard from "./ResponsiveCartCard";
import { type Product } from "../../types/products";
import { AlertTriangle } from "lucide-react";

const CartProduct = ({
  productId,
  quantity,
}: {
  productId: number;
  quantity: number;
}) => {
  const { data, loading } = useQuery(GET_PRODUCT_BY_ID, {
    variables: { id: productId },
  });

  if (loading)
    return (
      <div className="flex justify-center items-center h-40">
        <LoadingSpinner />
      </div>
    );

  const product: Product | undefined = data?.getProductById;
  if (!product) {
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
          Error: Product not found
        </p>
      </div>
    );
  }

  return (
    <ResponsiveCartCard
      product={product}
      productId={productId}
      quantity={quantity}
    />
  );
};

export default CartProduct;
