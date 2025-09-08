import { useState } from "react";
import LoadingSpinner from "../../components/products/LoadingSpinner";
import { GET_ALL_PRODUCTS } from "../../graphql/queries/products.query";
import { DELETE_PRODUCT } from "../../graphql/mutations/product";
import { useQuery, useMutation } from "@apollo/client";
import type { Product } from "../../types/products";
import { useNavigate } from "react-router-dom";

const AllProducts = () => {
  const [page, setPage] = useState(1);
  const [pageBlock, setPageBlock] = useState(0);
  const limit = 10;
  const pagesPerBlock = 10;

  const navigate = useNavigate();

  const skip = (page - 1) * limit;

  const { data, loading, error } = useQuery(GET_ALL_PRODUCTS, {
    variables: { limit, skip },
    notifyOnNetworkStatusChange: true,
  });

  const [deleteProduct] = useMutation(DELETE_PRODUCT, {
    refetchQueries: [
      { query: GET_ALL_PRODUCTS, variables: { limit, skip: 0 } },
    ],
  });

  const products: Product[] = data?.getAllProducts?.products ?? [];
  const total = data?.getAllProducts?.total ?? 0;
  const totalPages = Math.ceil(total / limit);

  const handleDelete = async (id: string | number) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await deleteProduct({ variables: { removeProductId: Number(id) } });
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const startPage = pageBlock * pagesPerBlock + 1;
  const endPage = Math.min(startPage + pagesPerBlock - 1, totalPages);
  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  if (loading && !products.length) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center my-20 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg max-w-lg mx-auto text-center">
        <h3 className="text-xl font-semibold text-red-800 dark:text-red-300">
          Oops! Something went wrong.
        </h3>
        <p className="text-red-600 dark:text-red-400 mt-2">
          We couldn't load the products. Please try again later.
        </p>
        <p className="text-xs text-gray-500 mt-4 italic">
          Error: {error.message}
        </p>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center my-20 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg max-w-lg mx-auto text-center">
        <h3 className="text-xl font-semibold text-red-800 dark:text-red-300">
          No products found
        </h3>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">All Products</h2>

      {/* Products Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 dark:bg-[#242424]">
            <tr>
              <th className="p-3 text-left">Thumbnail</th>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Stock</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-t hover:bg-gray-100 dark:hover:bg-[#242424]"
              >
                <td className="p-3">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td className="p-3 font-medium">{product.title}</td>
                <td className="p-3">{product.category}</td>
                <td className="p-3 text-blue-600 font-bold">
                  ${product.price}
                </td>
                <td className="p-3">{product.availabilityStatus}</td>
                <td className="p-3 flex gap-5">
                  <button
                    onClick={() =>
                      navigate(`/admin/products/edit/${product.id}`)
                    }
                    className="border border-yellow-500 cursor-pointer  px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="border border-red-500  px-3 py-1 rounded hover:bg-red-600 cursor-pointer"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        {pageBlock > 0 && (
          <button
            onClick={() => setPageBlock(pageBlock - 1)}
            className="px-3 py-1 rounded border bg-gray-200 hover:bg-gray-300"
          >
            &lt; Prev 10
          </button>
        )}

        {pageNumbers.map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`px-3 py-1 rounded border ${
              page === p
                ? "bg-blue-600 text-white border-blue-600"
                : "hover:text-black border-gray-300 hover:bg-gray-100"
            }`}
          >
            {p}
          </button>
        ))}

        {endPage < totalPages && (
          <button
            onClick={() => setPageBlock(pageBlock + 1)}
            className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 hover:text-black"
          >
            Next 10 &gt;
          </button>
        )}
      </div>
    </div>
  );
};

export default AllProducts;
