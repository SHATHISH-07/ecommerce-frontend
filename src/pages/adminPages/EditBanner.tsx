import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ALL_BANNERS } from "../../graphql/queries/banner.query";
import { UPDATE_BANNER } from "../../graphql/mutations/banner";
import LoadingSpinner from "../../components/products/LoadingSpinner";
import { useAppToast } from "../../utils/useAppToast";

interface BannerInput {
  title?: string;
  description?: string;
  imageUrl?: string;
  isActive?: boolean;
}

interface BannerData {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}

const EditBanner = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toastSuccess, toastError } = useAppToast();

  const { data, loading, error } = useQuery(GET_ALL_BANNERS, {
    fetchPolicy: "network-only",
  });

  const [updateBanner] = useMutation(UPDATE_BANNER);

  const [form, setForm] = useState<BannerInput>({
    title: "",
    description: "",
    imageUrl: "",
    isActive: true,
  });

  // Pre-fill form
  useEffect(() => {
    if (data && id) {
      const banner = data.getAllBanners.find((b: BannerData) => b.id === id);
      if (banner) {
        setForm({
          title: banner.title ?? "",
          description: banner.description ?? "",
          imageUrl: banner.imageUrl ?? "",
          isActive: banner.isActive ?? true,
        });
      }
    }
  }, [data, id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error: {error.message}</div>;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      await updateBanner({
        variables: { id, ...form },
        refetchQueries: [{ query: GET_ALL_BANNERS }],
      });
      toastSuccess("Banner updated successfully!");
      navigate("/admin/banner");
    } catch (err: unknown) {
      console.error("Update failed:", err);
      toastError("Failed to update banner");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Edit Banner</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {(["title", "description", "imageUrl"] as (keyof BannerInput)[]).map(
          (field) => (
            <div key={field}>
              <label className="block font-medium capitalize">{field}</label>
              {field === "description" ? (
                <textarea
                  name={field}
                  value={form[field] as string}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                />
              ) : (
                <input
                  type="text"
                  name={field}
                  value={form[field] as string}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                />
              )}
            </div>
          )
        )}

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive ?? false}
            onChange={handleChange}
          />
          <label>Active</label>
        </div>

        <div className="flex gap-4 mt-4">
          <button
            type="submit"
            className="border border-blue-600 dark:text-white text-black hover:text-white cursor-pointer px-4 py-2 rounded hover:bg-blue-700"
          >
            Update Banner
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/banner")}
            className="border border-gray-500 dark:text-white text-black hover:text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBanner;
