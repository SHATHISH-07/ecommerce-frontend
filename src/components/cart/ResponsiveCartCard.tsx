import { type Product } from "../../types/products";
import MobileCartCard from "./MobileCartCard";
import DesktopCartCard from "./DesktopCartCard";

const ResponsiveCartCard = ({
  product,
  productId,
  quantity,
}: {
  product: Product;
  productId: number;
  quantity: number;
}) => {
  return (
    <>
      <div className="lg:hidden">
        <MobileCartCard
          product={product}
          productId={productId}
          quantity={quantity}
        />
      </div>

      <div className="hidden lg:flex">
        <DesktopCartCard
          product={product}
          productId={productId}
          quantity={quantity}
        />
      </div>
    </>
  );
};

export default ResponsiveCartCard;
