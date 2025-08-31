import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_PRODUCT_COMPLETE_DETAILS_BY_ID } from "../../graphql/queries/products.query";
import LoadingSpinner from "../../components/products/LoadingSpinner";
import ProductDetailCard from "../../components/products/ProductDetailCard";
import ProductReviews from "../../components/products/ProductReviews";
import RelatedProducts from "../../components/products/RelatedProducts";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();

  const { data, loading, error } = useQuery(
    GET_PRODUCT_COMPLETE_DETAILS_BY_ID,
    {
      variables: { id: Number(id) },
      skip: !id,
    }
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );

  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  const product = data?.getProductById;

  if (!product) {
    return <p className="text-center mt-10">Product not found</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <ProductDetailCard product={product} />
      <ProductReviews reviews={product.reviews || []} />
      <RelatedProducts categorySlug={product.category} />
    </div>
  );
};

export default ProductDetails;
