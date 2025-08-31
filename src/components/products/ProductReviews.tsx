import { Star } from "lucide-react";

interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
}

interface ProductReviewsProps {
  reviews: Review[];
}

const ProductReviews = ({ reviews }: ProductReviewsProps) => {
  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold mb-4">Customer Reviews</h2>
      {reviews?.length > 0 ? (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {reviews.map((review, idx) => (
            <div key={idx} className="py-4">
              {/* Header: name + stars inline */}
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-900 dark:text-white">
                  {review.reviewerName}
                </p>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < review.rating
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300 dark:text-gray-600"
                      }
                    />
                  ))}
                </div>
              </div>

              {/* Date */}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {new Date(review.date).toLocaleDateString()}
              </p>

              {/* Comment */}
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No reviews yet.</p>
      )}
    </div>
  );
};

export default ProductReviews;
