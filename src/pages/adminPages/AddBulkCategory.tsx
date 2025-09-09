import { useState } from "react";
import { useMutation } from "@apollo/client";
import { UPLOAD_BULK_CATEGORIES } from "../../graphql/mutations/category";
import { GET_ALL_CATEGORIES } from "../../graphql/queries/category.query";
import { useNavigate } from "react-router-dom";
import { File } from "lucide-react";
import { useAppToast } from "../../utils/useAppToast";

const AddBulkCategory = () => {
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const { toastSuccess, toastError } = useAppToast();

  const [uploadBulkCategories, { loading }] = useMutation(
    UPLOAD_BULK_CATEGORIES,
    {
      refetchQueries: [{ query: GET_ALL_CATEGORIES }],
      awaitRefetchQueries: true,
    }
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toastError("Please upload a JSON file!");
      return;
    }

    try {
      await uploadBulkCategories({
        variables: { file },
      });
      toastSuccess("Bulk categories uploaded successfully!");
      setFile(null);
      navigate("/admin/categories");
    } catch (error) {
      console.error("Error uploading bulk categories:", error);
      toastError("Failed to upload categories");
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-30 p-6 bg-white dark:bg-[#09090b] shadow rounded-2xl">
      <h2 className="text-2xl text-center font-bold mb-4">
        Upload Bulk Categories
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-lg p-6 cursor-pointer text-gray-500 hover:border-blue-500 hover:text-blue-600 transition">
            {file ? (
              file.name
            ) : (
              <span className="flex flex-col items-center">
                <span>
                  <File size={150} />
                </span>
                Upload a JSON file
              </span>
            )}
            <input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full border border-blue-600 dark:text-white text-black hover:text-white cursor-pointer px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload Bulk Categories"}
        </button>
      </form>
    </div>
  );
};

export default AddBulkCategory;
