import { useState } from "react";

interface QuantitySelectorProps {
  initialQuantity: number;
  onChange: (newQuantity: number) => void;
}

const QuantitySelector = ({
  initialQuantity,
  onChange,
}: QuantitySelectorProps) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onChange(newQuantity);
    }
  };

  const handleIncrease = () => {
    if (quantity <= 9) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      onChange(newQuantity);
    }
  };

  return (
    <div className="flex items-center gap-2 border border-gray-800 dark:border-gray-300 rounded-md px-2 py-1 w-fit">
      <button
        onClick={handleDecrease}
        className="px-2 py-1 text-lg cursor-pointer font-bold text-gray-700 dark:text-gray-300 "
      >
        -
      </button>
      <span className="min-w-[2ch] text-center">{quantity}</span>
      <button
        onClick={handleIncrease}
        className="px-2 py-1 cursor-pointer text-lg font-bold text-gray-700 dark:text-gray-300 "
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;
