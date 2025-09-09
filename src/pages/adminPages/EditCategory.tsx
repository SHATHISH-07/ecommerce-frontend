import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_ALL_CATEGORIES,
  SEARCH_CATEGORY_BY_SLUG,
} from "../../graphql/queries/category.query";
import { UPDATE_CATEGORY } from "../../graphql/mutations/category";
import LoadingSpinner from "../../components/products/LoadingSpinner";
import { AlertTriangle } from "lucide-react";
import { useAppToast } from "../../utils/useAppToast";

export interface CategoryInput {
  name?: string;
  slug?: string;
  thumbnail?: string;
}

const EditCategory = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { toastSuccess, toastError } = useAppToast();

  const { data, loading, error } = useQuery<{
    searchByCategory: CategoryInput[];
  }>(SEARCH_CATEGORY_BY_SLUG, {
    variables: { categorySlug: slug },
    fetchPolicy: "network-only",
  });

  const [updateCategory] = useMutation(UPDATE_CATEGORY, {
    fetchPolicy: "network-only",
  });

  const [form, setForm] = useState<CategoryInput>({
    name: "",
    slug: "",
    thumbnail: "",
  });

  const category = data?.searchByCategory;

  useEffect(() => {
    if (category && category.length > 0) {
      const c = category[0];
      setForm({
        name: c.name,
        slug: c.slug,
        thumbnail: c.thumbnail,
      });
    }
  }, [category]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug) return;

    try {
      await updateCategory({
        variables: {
          slug,
          categoryInput: {
            name: form.name,
            slug: form.slug,
          },
        },
        refetchQueries: [{ query: GET_ALL_CATEGORIES }],
        awaitRefetchQueries: true,
      });
      toastSuccess("Category updated successfully!");
      navigate("/admin/categories");
    } catch (err: unknown) {
      console.error("Update failed:", err);
      toastError("Failed to update category");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error)
    return (
      <div className="flex flex-col items-center justify-center my-20 p-6 bg-red-50 border border-red-200 rounded-lg max-w-lg mx-auto text-center">
        <AlertTriangle className="text-red-500 w-12 h-12 mb-4" />
        <h3 className="text-xl font-semibold text-red-800">
          Failed to load category
        </h3>
        <p className="text-xs text-gray-500 mt-4 italic">
          Error: {error.message}
        </p>
      </div>
    );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Edit Category</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {(["name", "slug", "thumbnail"] as (keyof CategoryInput)[]).map(
          (field) => (
            <div key={field}>
              <label className="block font-medium capitalize">{field}</label>
              <input
                type="text"
                name={field}
                value={form[field] ?? ""}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
          )
        )}
        <button
          type="submit"
          className="border border-blue-600 dark:text-white text-black hover:text-white cursor-pointer px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Category
        </button>
      </form>
    </div>
  );
};

export default EditCategory;
