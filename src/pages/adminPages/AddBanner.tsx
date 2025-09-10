import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { ADD_PRODUCT } from "../../graphql/mutations/banner";
import { GET_ALL_BANNERS } from "../../graphql/queries/banner.query";
import { useAppToast } from "../../utils/useAppToast";

interface BannerInput {
  title?: string;
  description?: string;
  imageUrl: string;
}

const AddBanner = () => {
  const navigate = useNavigate();
  const { toastSuccess, toastError } = useAppToast();

  const [form, setForm] = useState<BannerInput>({
    title: "",
    description: "",
    imageUrl: "",
  });

  const [addBanner, { loading }] = useMutation(ADD_PRODUCT, {
    refetchQueries: [{ query: GET_ALL_BANNERS }],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.imageUrl) {
      toastError("Image URL is required");
      return;
    }

    try {
      await addBanner({ variables: { ...form } });
      toastSuccess("Banner added successfully!");
      navigate("/admin/banner");
    } catch (err: unknown) {
      console.error("Add failed:", err);
      toastError("Failed to add banner");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add Banner</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={form.title ?? ""}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea
            name="description"
            value={form.description ?? ""}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Image URL</label>
          <input
            type="text"
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div className="flex gap-4 mt-4">
          <button
            type="submit"
            disabled={loading}
            className="border border-blue-600 dark:text-white text-black hover:text-white cursor-pointer px-4 py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Adding..." : "Add Banner"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/banner")}
            className="border border-gray-500 dark:text-white text-black hover:text-white px-4 py-2 rounded cursor-pointer hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBanner;
