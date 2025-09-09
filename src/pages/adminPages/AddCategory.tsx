import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_CATEGORY } from "../../graphql/mutations/category";
import { GET_ALL_CATEGORIES } from "../../graphql/queries/category.query";
import { useNavigate } from "react-router-dom";
import { useAppToast } from "../../utils/useAppToast";

const AddCategory = () => {
  const [form, setForm] = useState({
    name: "",
    slug: "",
    thumbnail: "",
  });
  const navigate = useNavigate();

  const { toastSuccess, toastError } = useAppToast();

  const [addCategory, { loading }] = useMutation(ADD_CATEGORY, {
    refetchQueries: [{ query: GET_ALL_CATEGORIES }],
    awaitRefetchQueries: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addCategory({
        variables: { categoryInput: form },
      });
      toastSuccess("Category added successfully!");
      setForm({ name: "", slug: "", thumbnail: "" });
      navigate("/admin/categories");
    } catch (error) {
      console.error("Error adding category:", error);
      toastError("Failed to add category");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add Category</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {["name", "slug", "thumbnail"].map((field) => (
          <div key={field}>
            <label className="block font-medium capitalize">{field}</label>
            <input
              type="text"
              name={field}
              value={form[field as keyof typeof form]}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required={field !== "thumbnail"}
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={loading}
          className="border border-blue-600 dark:text-white text-black hover:text-white cursor-pointer px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Category"}
        </button>
      </form>
    </div>
  );
};

export default AddCategory;
