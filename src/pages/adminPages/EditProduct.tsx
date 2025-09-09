import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { GET_PRODUCT_BY_ID } from "../../graphql/queries/products.query";
import { UPDATE_PRODUCT } from "../../graphql/mutations/product";
import LoadingSpinner from "../../components/products/LoadingSpinner";
import { AlertTriangle, Trash2, Plus } from "lucide-react";
import { useAppToast } from "../../utils/useAppToast";

export interface UpdateDimensionsInput {
  width?: number;
  height?: number;
  depth?: number;
}

export interface UpdateMetaInput {
  createdAt?: string;
  updatedAt?: string;
  barcode?: string;
  qrCode?: string;
}

export interface DetailedProduct {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  weight: number;
  dimensions: UpdateDimensionsInput;
  warrantyInformation: string;
  availabilityStatus: string;
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: UpdateMetaInput;
  images: string[];
  thumbnail: string;
}

export interface UpdateProductInput {
  title?: string;
  description?: string;
  category?: string;
  price?: number;
  discountPercentage?: number;
  rating?: number;
  stock?: number;
  tags?: string[];
  brand?: string;
  weight?: number;
  dimensions?: UpdateDimensionsInput;
  warrantyInformation?: string;
  availabilityStatus?: string;
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  meta?: UpdateMetaInput;
  images?: string[];
  thumbnail?: string;
}

type ArrayField = "tags" | "images";

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { toastSuccess, toastError } = useAppToast();

  const { data, loading, error } = useQuery<{
    getProductById: DetailedProduct;
  }>(GET_PRODUCT_BY_ID, { variables: { id: Number(id) } });

  const [updateProduct] = useMutation(UPDATE_PRODUCT);

  const [form, setForm] = useState<UpdateProductInput>({});
  const [original, setOriginal] = useState<UpdateProductInput>({});

  useEffect(() => {
    if (data?.getProductById) {
      const p = data.getProductById;
      const initial: UpdateProductInput = {
        title: p.title,
        description: p.description,
        category: p.category,
        price: p.price,
        discountPercentage: p.discountPercentage,
        rating: p.rating,
        stock: p.stock,
        tags: p.tags ?? [],
        brand: p.brand,
        weight: p.weight,
        dimensions: p.dimensions ?? { width: 0, height: 0, depth: 0 },
        warrantyInformation: p.warrantyInformation,
        availabilityStatus: p.availabilityStatus,
        returnPolicy: p.returnPolicy,
        minimumOrderQuantity: p.minimumOrderQuantity,
        meta: p.meta ?? {
          createdAt: "",
          updatedAt: "",
          barcode: "",
          qrCode: "",
        },
        images: p.images ?? [],
        thumbnail: p.thumbnail,
      };
      setForm(initial);
      setOriginal(initial);
    }
  }, [data]);

  // ---------------- Handlers -----------------

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    const numberFields: (keyof UpdateProductInput)[] = [
      "price",
      "discountPercentage",
      "rating",
      "weight",
      "stock",
      "minimumOrderQuantity",
    ];

    setForm((prev) => ({
      ...prev,
      [name]: numberFields.includes(name as keyof UpdateProductInput)
        ? value === ""
          ? undefined
          : Number(value)
        : value,
    }));
  };

  const handleNestedChange = <
    K extends keyof UpdateDimensionsInput | keyof UpdateMetaInput
  >(
    field: "dimensions" | "meta",
    key: K,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [key]:
          key === "width" || key === "height" || key === "depth"
            ? value === ""
              ? undefined
              : Number(value)
            : value,
      },
    }));
  };

  const handleArrayChange = (
    field: ArrayField,
    index: number,
    value: string | number
  ) => {
    setForm((prev) => {
      const arr = [...(prev[field] || [])];
      arr[index] = value as string;
      return { ...prev, [field]: arr };
    });
  };

  const handleAddArrayItem = (field: ArrayField) => {
    setForm((prev) => {
      return { ...prev, [field]: [...(prev[field] || []), ""] };
    });
  };

  const handleRemoveArrayItem = (field: ArrayField, index: number) => {
    setForm((prev) => {
      const arr = [...(prev[field] || [])];
      arr.splice(index, 1);
      return { ...prev, [field]: arr };
    });
  };

  const getChangedFields = (): UpdateProductInput => {
    const changed: Partial<UpdateProductInput> = {};
    if (!original) return form;

    for (const key in form) {
      const k = key as keyof UpdateProductInput;
      const current = form[k];
      const orig = original[k];

      if (Array.isArray(current)) {
        if (JSON.stringify(current) !== JSON.stringify(orig)) {
          (changed as Record<string, unknown>)[k] = current;
        }
      } else if (current && typeof current === "object") {
        if (JSON.stringify(current) !== JSON.stringify(orig)) {
          (changed as Record<string, unknown>)[k] = current;
        }
      } else if (current !== orig) {
        (changed as Record<string, unknown>)[k] = current;
      }
    }

    return changed as UpdateProductInput;
  };

  function cleanObject<T>(obj: T): T {
    if (Array.isArray(obj)) {
      return obj.map((item) => cleanObject(item)) as unknown as T;
    } else if (obj !== null && typeof obj === "object") {
      const cleaned = {} as T;
      for (const key in obj) {
        if (key !== "__typename") {
          const value = (obj as Record<string, unknown>)[key];
          (cleaned as Record<string, unknown>)[key] = cleanObject(value);
        }
      }
      return cleaned;
    }
    return obj;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const changedFields = getChangedFields();
      const cleaned = cleanObject(changedFields);

      if (Object.keys(cleaned).length === 0) {
        toastError("No changes to update!");
        return;
      }

      await updateProduct({
        variables: { id: Number(id), input: cleaned },
      });
      toastSuccess("Product updated successfully!");
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      toastError("Failed to update product");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center my-20 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg max-w-lg mx-auto text-center">
        <AlertTriangle className="text-red-500 w-12 h-12 mb-4" />
        <h3 className="text-xl font-semibold text-red-800 dark:text-red-300">
          Oops! Something went wrong.
        </h3>
        <p className="text-red-600 dark:text-red-400 mt-2">
          We couldn't load the product. Please try again later.
        </p>
        <p className="text-xs text-gray-500 mt-4 italic">
          Error: {error.message}
        </p>
      </div>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Text Inputs */}
        {(
          [
            "title",
            "description",
            "category",
            "brand",
            "warrantyInformation",
            "availabilityStatus",
            "returnPolicy",
            "thumbnail",
          ] as (keyof UpdateProductInput)[]
        ).map((field) => (
          <div key={field}>
            <label className="block font-medium">{field}</label>
            <input
              type="text"
              name={field}
              value={(form[field] as string) ?? ""}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        ))}

        {/* Number Inputs */}
        {(
          [
            "price",
            "discountPercentage",
            "rating",
            "weight",
            "stock",
            "minimumOrderQuantity",
          ] as (keyof UpdateProductInput)[]
        ).map((field) => (
          <div key={field}>
            <label className="block font-medium">{field}</label>
            <input
              type="number"
              name={field}
              value={form[field] !== undefined ? (form[field] as number) : ""} // ✅ narrow to number
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        ))}

        {/* Tags */}
        <div>
          <label className="block font-medium">Tags</label>
          {(form.tags || []).map((tag, i) => (
            <div key={i} className="flex gap-2 mb-1">
              <input
                type="text"
                value={tag}
                onChange={(e) => handleArrayChange("tags", i, e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
              <button
                type="button"
                onClick={() => handleRemoveArrayItem("tags", i)}
              >
                <Trash2 />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddArrayItem("tags")}
            className="flex items-center gap-1 mt-1"
          >
            <Plus /> Add Tag
          </button>
        </div>

        {/* Images */}
        <div>
          <label className="block font-medium">Images</label>
          {(form.images || []).map((img, i) => (
            <div key={i} className="flex gap-2 mb-1">
              <input
                type="text"
                value={img}
                onChange={(e) => handleArrayChange("images", i, e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
              <button
                type="button"
                onClick={() => handleRemoveArrayItem("images", i)}
              >
                <Trash2 />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddArrayItem("images")}
            className="flex items-center gap-1 mt-1"
          >
            <Plus /> Add Image
          </button>
        </div>

        {/* Dimensions */}
        <div>
          <label className="block font-medium">Dimensions</label>
          {(
            ["width", "height", "depth"] as (keyof UpdateDimensionsInput)[]
          ).map((dim) => (
            <input
              key={dim}
              type="number"
              placeholder={dim}
              value={
                form.dimensions?.[dim] !== undefined
                  ? form.dimensions?.[dim]
                  : ""
              }
              onChange={(e) =>
                handleNestedChange("dimensions", dim, e.target.value)
              }
              className="w-full border px-3 py-2 rounded mb-1"
            />
          ))}
        </div>

        {/* Meta */}
        <div>
          <label className="block font-medium">Meta</label>
          {(
            [
              "createdAt",
              "updatedAt",
              "barcode",
              "qrCode",
            ] as (keyof UpdateMetaInput)[]
          ).map((key) => (
            <input
              key={key}
              type="text"
              placeholder={key}
              value={form.meta?.[key] ?? ""}
              onChange={(e) => handleNestedChange("meta", key, e.target.value)}
              className="w-full border px-3 py-2 rounded mb-1"
            />
          ))}
        </div>

        <button
          type="submit"
          className="border border-blue-600 dark:text-white text-black hover:text-white cursor-pointer px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
