import { useQuery, useMutation } from "@apollo/client";
import { GET_ALL_BANNERS } from "../../graphql/queries/banner.query";
import { DELETE_BANNER } from "../../graphql/mutations/banner";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/products/LoadingSpinner";
import { useAppToast } from "../../utils/useAppToast";

interface BannerData {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}

const BannerAdmin = () => {
  const { data, loading, error, refetch } = useQuery(GET_ALL_BANNERS);
  const [deleteBanner] = useMutation(DELETE_BANNER);

  const { toastSuccess, toastError } = useAppToast();

  const navigate = useNavigate();

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;
    await deleteBanner({ variables: { id } });
    toastSuccess("Banner deleted successfully!");
    refetch();
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  if (error) {
    toastError(error.message);

    return (
      <div className="py-6 text-red-600 flex items-center justify-center h-screen">
        Error: {error.message}
      </div>
    );
  }

  const banners: BannerData[] = data?.getAllBanners || [];

  if (!banners.length) {
    return (
      <div className="text-center py-6 text-gray-500 h-screen flex items-center justify-center">
        No banners available
      </div>
    );
  }

  return (
    <div className="p-6 overflow-x-auto">
      <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-100 dark:bg-[#242424]">
          <tr>
            <th className="p-3 text-left">Image</th>
            <th className="p-3 text-left">Title</th>
            <th className="p-3 text-left">Description</th>
            <th className="p-3 text-left">Active</th>
            <th className="p-3 text-left">Created At</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {banners.map((b) => (
            <tr
              key={b.id}
              className="border-t hover:bg-gray-100 dark:hover:bg-[#242424]"
            >
              <td className="p-3">
                {b.imageUrl ? (
                  <img
                    src={b.imageUrl}
                    alt={b.title || "Banner"}
                    className="w-16 h-16 object-cover rounded "
                  />
                ) : (
                  "null"
                )}
              </td>
              <td className="p-3">{b.title || "null"}</td>
              <td className="p-3">{b.description || "null"}</td>
              <td className="p-3">{b.isActive ? "Yes" : "No"}</td>
              <td className="p-3">{b.createdAt.slice(0, 10) || "null"}</td>
              <td className="p-3 flex gap-2">
                <button
                  onClick={() => navigate(`/admin/banner/edit/${b.id}`)}
                  className="border border-yellow-500 px-3 py-1 rounded hover:bg-yellow-600 cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(b.id)}
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
  );
};

export default BannerAdmin;
