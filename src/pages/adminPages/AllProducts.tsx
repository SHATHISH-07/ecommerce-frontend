import { useState } from "react";
import LoadingSpinner from "../../components/products/LoadingSpinner";
import {
  GET_ALL_PRODUCTS,
  SEARCH_PRODUCTS,
  GET_PRODUCT_BY_ID,
} from "../../graphql/queries/products.query";
import { DELETE_PRODUCT } from "../../graphql/mutations/product";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import type { Product } from "../../types/products";
import { useNavigate } from "react-router-dom";
import { useAppToast } from "../../utils/useAppToast";

type Mode = "all" | "search" | "id";

const AllProducts = () => {
  const [page, setPage] = useState(1);
  const [pageBlock, setPageBlock] = useState(0);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchId, setSearchId] = useState("");
  const [mode, setMode] = useState<Mode>("all");

  const limit = 10;
  const pagesPerBlock = 10;
  const skip = (page - 1) * limit;

  const { toastSuccess, toastError } = useAppToast();

  const navigate = useNavigate();

  // Base query (pagination)
  const { data, loading, error, refetch } = useQuery(GET_ALL_PRODUCTS, {
    variables: { limit, skip },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
  });

  // Lazy queries for search (network-only so we always hit server)
  const [
    searchProducts,
    { data: searchData, loading: searchLoading, refetch: refetchSearch },
  ] = useLazyQuery(SEARCH_PRODUCTS, { fetchPolicy: "network-only" });

  const [
    getProductById,
    { data: idData, loading: idLoading, refetch: refetchById },
  ] = useLazyQuery(GET_PRODUCT_BY_ID, { fetchPolicy: "network-only" });

  const [deleteProduct] = useMutation(DELETE_PRODUCT, {
    refetchQueries: [
      { query: GET_ALL_PRODUCTS, variables: { limit, skip: 0 } },
    ],
  });

  // derive products & total based on current mode
  const products: Product[] =
    mode === "search"
      ? searchData?.searchProducts?.products ?? []
      : mode === "id"
      ? idData?.getProductById
        ? [idData.getProductById]
        : []
      : data?.getAllProducts?.products ?? [];

  const total =
    mode === "search"
      ? searchData?.searchProducts?.total ?? 0
      : mode === "id"
      ? idData?.getProductById
        ? 1
        : 0
      : data?.getAllProducts?.total ?? 0;

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const handleDelete = async (id: string | number) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await deleteProduct({ variables: { removeProductId: Number(id) } });
      toastSuccess("Product deleted successfully!");

      if (mode === "all") {
        await refetch({ limit, skip: (page - 1) * limit });
      } else if (mode === "search") {
        if (typeof refetchSearch === "function") {
          await refetchSearch({ query: searchTitle, limit, skip: 0 });
        } else {
          await searchProducts({
            variables: { query: searchTitle, limit, skip: 0 },
          });
        }
      } else if (mode === "id") {
        if (typeof refetchById === "function") {
          await refetchById({ id: Number(searchId) });
        } else {
          await getProductById({ variables: { id: Number(searchId) } });
        }
      }
    } catch (err) {
      console.error("Delete failed:", err);
      toastError("Delete failed");
    }
  };

  const handleSearchByTitle = async () => {
    const q = searchTitle.trim();
    if (!q) return;
    setPage(1);
    setPageBlock(0);
    setMode("search");

    if (searchData && typeof refetchSearch === "function") {
      await refetchSearch({ query: q, limit, skip: 0 });
    } else {
      await searchProducts({ variables: { query: q, limit, skip: 0 } });
    }
  };

  const handleSearchById = async () => {
    const id = searchId.trim();
    if (!id) return;
    setPage(1);
    setPageBlock(0);
    setMode("id");

    if (idData && typeof refetchById === "function") {
      await refetchById({ id: Number(id) });
    } else {
      await getProductById({ variables: { id: Number(id) } });
    }
  };

  const handleReset = async () => {
    setSearchTitle("");
    setSearchId("");
    setPage(1);
    setPageBlock(0);
    setMode("all");
    await refetch({ limit, skip: 0 });
  };

  const startPage = pageBlock * pagesPerBlock + 1;
  const endPage = Math.min(startPage + pagesPerBlock - 1, totalPages);
  const pageNumbers = Array.from(
    { length: Math.max(0, endPage - startPage + 1) },
    (_, i) => startPage + i
  );

  const isLoading =
    (mode === "all" && loading) ||
    (mode === "search" && searchLoading) ||
    (mode === "id" && idLoading);

  if (isLoading && !products.length) {
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

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-20 mb-6">
        {/* Search by Title */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search by title"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearchByTitle()}
            className="border px-3 py-2 rounded w-64"
          />
          <button
            onClick={handleSearchByTitle}
            className="border border-blue-600 dark:text-white text-black hover:bg-blue-600 cursor-pointer px-4 py-2 rounded"
          >
            Search
          </button>
        </div>

        {/* Search by ID */}
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Search by ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearchById()}
            className="border px-3 py-2 rounded w-40"
          />
          <button
            onClick={handleSearchById}
            className="border border-green-600 dark:text-white text-black hover:bg-green-600 cursor-pointer px-4 py-2 rounded"
          >
            Get by ID
          </button>
        </div>

        {/* Reset */}
        <button
          onClick={handleReset}
          className="border border-gray-500 dark:text-white text-black hover:bg-gray-500 cursor-pointer px-4 py-2 rounded"
        >
          Reset
        </button>
      </div>

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
                    className="border border-yellow-500 cursor-pointer px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="border border-red-500 px-3 py-1 rounded hover:bg-red-600 cursor-pointer"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination (only when in "all" mode) */}
      {mode === "all" && (
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
      )}
    </div>
  );
};

export default AllProducts;
