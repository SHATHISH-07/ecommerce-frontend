import { type Product } from "../../types/products";
// Import both card components
import MobileProductCard from "./MobileProductCard"; // <-- Rename your original ProductCard
import DesktopProductCard from "./DesktopProductCard";

const ResponsiveProductCard = ({ product }: { product: Product }) => {
  return (
    <>
      <div className="lg:hidden">
        <MobileProductCard product={product} />
      </div>

      <div className="hidden lg:flex">
        <DesktopProductCard product={product} />
      </div>
    </>
  );
};

export default ResponsiveProductCard;
