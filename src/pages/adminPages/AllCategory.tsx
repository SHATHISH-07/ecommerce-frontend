import { useQuery, useMutation } from "@apollo/client";
import { GET_ALL_CATEGORIES } from "../../graphql/queries/category.query";
import { REMOVE_CATEGORY } from "../../graphql/mutations/category";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/products/LoadingSpinner";
import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { useAppToast } from "../../utils/useAppToast";

interface Category {
  name: string;
  slug: string;
  thumbnail: string;
}

const AllCategory = () => {
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useQuery(GET_ALL_CATEGORIES);

  const { toastSuccess, toastError } = useAppToast();

  const [removeCategory, { loading: deleting }] = useMutation(REMOVE_CATEGORY, {
    onCompleted: () => refetch(),
  });

  const [search, setSearch] = useState("");

  const handleDelete = async (slug: string) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

    try {
      await removeCategory({ variables: { slug } });
      toastSuccess("Category deleted successfully!");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(" Delete failed:", err.message);
        toastError(err.message);
      } else {
        console.error("Delete failed:", err);
        toastError("Delete failed");
      }
    }
  };

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
          We couldn't load the categories. Please try again later.
        </p>
        <p className="text-xs text-gray-500 mt-4 italic">
          Error: {error.message}
        </p>
      </div>
    );
  }

  let categories: Category[] = data?.getCategories || [];

  if (search) {
    categories = categories.filter((cat) =>
      cat.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">All Categories</h2>

      {/* Search */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && setSearch(search)}
          className="border px-3 py-2 rounded w-full"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 dark:bg-[#242424]">
            <tr>
              <th className="p-3 text-left">Thumbnail</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Slug</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center p-4 text-gray-500">
                  No categories found.
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr
                  key={cat.slug}
                  className="border-t hover:bg-gray-100 dark:hover:bg-[#242424]"
                >
                  <td className="p-3">
                    <img
                      src={cat.thumbnail}
                      alt={cat.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="p-3 font-medium">{cat.name}</td>
                  <td className="p-3">{cat.slug}</td>
                  <td className="p-3 flex gap-3">
                    <button
                      onClick={() =>
                        navigate(`/admin/categories/edit/${cat.slug}`)
                      }
                      className="border border-yellow-500 px-3 py-1 rounded hover:bg-yellow-600  hover:text-white cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat.slug)}
                      disabled={deleting}
                      className="border border-red-500 px-3 py-1 rounded hover:bg-red-600  hover:text-white cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllCategory;
