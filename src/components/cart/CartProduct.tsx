import { useQuery } from "@apollo/client";
import LoadingSpinner from "../../components/products/LoadingSpinner";
import { GET_PRODUCT_BY_ID } from "../../graphql/queries/products.query";
import ResponsiveCartCard from "./ResponsiveCartCard";
import { type Product } from "../../types/products";

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
  if (!product) return null;

  return (
    <ResponsiveCartCard
      product={product}
      productId={productId}
      quantity={quantity}
    />
  );
};

export default CartProduct;
