import { Star } from "lucide-react";

const StarRating = ({ rating }: { rating: number }) => {
  const totalStars = 5;
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = totalStars - fullStars - halfStar;

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={`full-${i}`}
          size={18}
          className="text-yellow-400 fill-current"
        />
      ))}
      {halfStar === 1 && (
        <Star
          size={18}
          className="text-yellow-400 fill-current"
          style={{ clipPath: "polygon(0 0, 50% 0, 50% 100%, 0% 100%)" }}
        />
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star
          key={`empty-${i}`}
          size={18}
          className="text-gray-300 fill-current"
        />
      ))}
      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

export default StarRating;
