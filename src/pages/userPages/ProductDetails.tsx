import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_PRODUCT_COMPLETE_DETAILS_BY_ID } from "../../graphql/queries/products.query";
import LoadingSpinner from "../../components/products/LoadingSpinner";
import ProductDetailCard from "../../components/products/ProductDetailCard";
import ProductReviews from "../../components/products/ProductReviews";
import RelatedProducts from "../../components/products/RelatedProducts";
import { AlertTriangle } from "lucide-react";

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

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center my-20 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg max-w-lg mx-auto text-center">
        <AlertTriangle className="text-red-500 w-12 h-12 mb-4" />
        <h3 className="text-xl font-semibold text-red-800 dark:text-red-300">
          Oops! Something went wrong.
        </h3>
        <p className="text-red-600 dark:text-red-400 mt-2">
          We couldn't load the product. Please try again later.
        </p>
      </div>
    );
  }

  const product = data?.getProductById;

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center my-20 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg max-w-lg mx-auto text-center">
        <AlertTriangle className="text-red-500 w-12 h-12 mb-4" />
        <h3 className="text-xl font-semibold text-red-800 dark:text-red-300">
          Oops! Something went wrong.
        </h3>
        <p className="text-red-600 dark:text-red-400 mt-2">
          We couldn't find the product. Please try again later.
        </p>
      </div>
    );
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
