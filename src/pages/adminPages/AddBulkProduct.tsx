import { useState } from "react";
import { useMutation } from "@apollo/client";
import { UPLOAD_BULK_PRODUCTS } from "../../graphql/mutations/product";
import { File } from "lucide-react";

const AddBulkProduct = () => {
  const [file, setFile] = useState<File | null>(null);

  const [uploadBulkProducts, { loading, error, data }] = useMutation(
    UPLOAD_BULK_PRODUCTS,
    {
      onCompleted: () => {
        setFile(null);
      },
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
      alert("Please select a JSON file.");
      return;
    }
    try {
      await uploadBulkProducts({ variables: { file } });
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-30 p-6 bg-white dark:bg-[#09090b] shadow rounded-2xl">
      <h2 className="text-2xl text-center font-bold mb-4">
        Upload Bulk Products
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Styled file input with placeholder */}
        <label
          htmlFor="file-upload"
          className="flex items-center justify-center border-2 border-dashed border-gray-400 rounded-lg p-6 cursor-pointer text-gray-500 hover:border-blue-500 hover:text-blue-600 transition"
        >
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
        </label>
        <input
          id="file-upload"
          type="file"
          accept="application/json"
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
          ❌ {error.message}
        </div>
      )}

      {data && (
        <div
          className={`mt-4 p-2 rounded ${
            data.uploadBulkProductsJSON.success
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {data.uploadBulkProductsJSON.message} (Total:{" "}
          {data.uploadBulkProductsJSON.total})
        </div>
      )}
    </div>
  );
};

export default AddBulkProduct;
