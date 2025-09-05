import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sophia Williams",
    review:
      "Amazing shopping experience! The quality of products exceeded my expectations and delivery was super fast.",
    avatar: "https://i.pravatar.cc/150?img=32",
    rating: 5,
  },
  {
    id: 2,
    name: "James Anderson",
    review:
      "Great service and friendly support team. The checkout process was smooth and easy.",
    avatar: "https://i.pravatar.cc/150?img=12",
    rating: 4,
  },
  {
    id: 3,
    name: "Emma Johnson",
    review:
      "I love the variety of products available here. Definitely my go-to store for online shopping!",
    avatar: "https://i.pravatar.cc/150?img=56",
    rating: 5,
  },
];

const TestimonialSection = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-800 dark:text-white">
        What Our Customers Say
      </h2>

      {/* Mobile: Horizontal scroll */}
      <div className="flex md:hidden overflow-x-auto gap-4 no-scrollbar pb-4">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="flex-shrink-0 w-72 bg-white dark:bg-[#101010] shadow-md rounded-xl p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow"
          >
            <img
              src={t.avatar}
              alt={t.name}
              className="w-16 h-16 rounded-full mb-4 object-cover"
            />
            <p className="text-gray-600 dark:text-gray-300 mb-4 italic">
              "{t.review}"
            </p>
            <h3 className="font-semibold text-gray-800 dark:text-white">
              {t.name}
            </h3>
            <div className="flex mt-2">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 text-yellow-500 fill-yellow-500"
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: Grid */}
      <div className="hidden md:grid gap-6 md:grid-cols-3">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="bg-white dark:bg-[#101010] shadow-md rounded-xl p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow"
          >
            <img
              src={t.avatar}
              alt={t.name}
              className="w-16 h-16 rounded-full mb-4 object-cover"
            />
            <p className="text-gray-600 dark:text-gray-300 mb-4 italic">
              "{t.review}"
            </p>
            <h3 className="font-semibold text-gray-800 dark:text-white">
              {t.name}
            </h3>
            <div className="flex mt-2">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 text-yellow-500 fill-yellow-500"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialSection;
