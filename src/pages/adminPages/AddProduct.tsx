import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_PRODUCT } from "../../graphql/mutations/product"; // adjust path if needed

interface Dimensions {
  width: number;
  height: number;
  depth: number;
}

interface Meta {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
}

export interface ProductInput {
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
  dimensions: Dimensions;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: Meta;
  images: string[];
  thumbnail: string;
}

const initialFormData: ProductInput = {
  title: "",
  description: "",
  category: "",
  price: "" as unknown as number,
  discountPercentage: "" as unknown as number,
  rating: "" as unknown as number,
  stock: "" as unknown as number,
  tags: [],
  brand: "",
  weight: "" as unknown as number,
  dimensions: {
    width: "" as unknown as number,
    height: "" as unknown as number,
    depth: "" as unknown as number,
  },
  warrantyInformation: "",
  shippingInformation: "",
  availabilityStatus: "",
  returnPolicy: "",
  minimumOrderQuantity: "" as unknown as number,
  meta: {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    barcode: "",
    qrCode: "",
  },
  images: [],
  thumbnail: "",
};

const AddProduct = () => {
  const [formData, setFormData] = useState<ProductInput>(initialFormData);

  const [addProduct, { loading, error }] = useMutation(ADD_PRODUCT, {
    onCompleted: (data) => {
      console.log("✅ Product Added:", data.addProduct);
      alert(`Product "${data.addProduct.title}" added successfully!`);
      setFormData(initialFormData);
    },
  });

  // handle form input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("dimensions.")) {
      const key = name.split(".")[1] as keyof Dimensions;
      setFormData((prev) => ({
        ...prev,
        dimensions: { ...prev.dimensions, [key]: parseFloat(value) },
      }));
    } else if (name.startsWith("meta.")) {
      const key = name.split(".")[1] as keyof Meta;
      setFormData((prev) => ({
        ...prev,
        meta: { ...prev.meta, [key]: value },
      }));
    } else if (name === "tags" || name === "images") {
      setFormData((prev) => ({
        ...prev,
        [name]: value.split(",").map((item) => item.trim()),
      }));
    } else if (
      [
        "price",
        "discountPercentage",
        "rating",
        "stock",
        "weight",
        "minimumOrderQuantity",
      ].includes(name)
    ) {
      setFormData((prev) => ({ ...prev, [name]: parseFloat(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({ variables: { productInput: formData } });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-[#09090b] shadow rounded-2xl">
      <h2 className="text-2xl font-bold mb-4">Add Product</h2>
      {error && <p className="text-red-600">❌ Error: {error.message}</p>}
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        {/* Title, Brand */}
        <input
          name="title"
          value={formData.title}
          placeholder="Title"
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          name="brand"
          value={formData.brand}
          placeholder="Brand"
          onChange={handleChange}
          className="p-2 border rounded"
        />

        {/* Description */}
        <textarea
          name="description"
          value={formData.description}
          placeholder="Description"
          onChange={handleChange}
          className="col-span-2 p-2 border rounded"
        />

        {/* Category & Pricing */}
        <input
          name="category"
          value={formData.category}
          placeholder="Category"
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          name="price"
          type="number"
          value={formData.price}
          placeholder="Price"
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          name="discountPercentage"
          type="number"
          value={formData.discountPercentage}
          placeholder="Discount %"
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          name="rating"
          type="number"
          value={formData.rating}
          placeholder="Rating"
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          name="stock"
          type="number"
          value={formData.stock}
          placeholder="Stock"
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          name="weight"
          type="number"
          value={formData.weight}
          placeholder="Weight (kg)"
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          name="minimumOrderQuantity"
          type="number"
          value={formData.minimumOrderQuantity}
          placeholder="Min Order Qty"
          onChange={handleChange}
          className="p-2 border rounded"
        />

        {/* Dimensions */}
        <input
          name="dimensions.width"
          type="number"
          value={formData.dimensions.width}
          placeholder="Width (cm)"
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          name="dimensions.height"
          type="number"
          value={formData.dimensions.height}
          placeholder="Height (cm)"
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          name="dimensions.depth"
          type="number"
          value={formData.dimensions.depth}
          placeholder="Depth (cm)"
          onChange={handleChange}
          className="p-2 border rounded"
        />

        {/* Warranty & Shipping */}
        <input
          name="warrantyInformation"
          value={formData.warrantyInformation}
          placeholder="Warranty Info"
          onChange={handleChange}
          className="col-span-2 p-2 border rounded"
        />
        <input
          name="shippingInformation"
          value={formData.shippingInformation}
          placeholder="Shipping Info"
          onChange={handleChange}
          className="col-span-2 p-2 border rounded"
        />
        <input
          name="availabilityStatus"
          value={formData.availabilityStatus}
          placeholder="Availability"
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          name="returnPolicy"
          value={formData.returnPolicy}
          placeholder="Return Policy"
          onChange={handleChange}
          className="p-2 border rounded"
        />

        {/* Meta */}
        <input
          name="meta.barcode"
          value={formData.meta.barcode}
          placeholder="Barcode"
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          name="meta.qrCode"
          value={formData.meta.qrCode}
          placeholder="QR Code URL"
          onChange={handleChange}
          className="col-span-2 p-2 border rounded"
        />

        {/* Tags, Images */}
        <input
          name="tags"
          placeholder="Tags (comma separated)"
          value={formData.tags.join(", ")}
          onChange={handleChange}
          className="col-span-2 p-2 border rounded"
        />
        <input
          name="images"
          placeholder="Images (comma separated URLs)"
          value={formData.images.join(", ")}
          onChange={handleChange}
          className="col-span-2 p-2 border rounded"
        />
        <input
          name="thumbnail"
          value={formData.thumbnail}
          placeholder="Thumbnail URL"
          onChange={handleChange}
          className="col-span-2 p-2 border rounded"
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
