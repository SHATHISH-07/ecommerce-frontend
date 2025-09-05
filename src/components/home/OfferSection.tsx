import { useNavigate } from "react-router-dom";

const offerArray = [
  {
    id: "1",
    url: "https://res.cloudinary.com/dylmrhy5h/image/upload/v1757068361/offerImg3_btw3tp.jpg",
    redirectPath: "/categories/womens-dresses",
  },
  {
    id: "2",
    url: "https://res.cloudinary.com/dylmrhy5h/image/upload/v1757069685/offerImg8_wgghvl.jpg",
    redirectPath: "/categories/mens-shirts",
  },
  {
    id: "3",
    url: "https://res.cloudinary.com/dylmrhy5h/image/upload/v1757069685/offerImg7_mkhewz.jpg",
    redirectPath: "/categories/groceries",
  },
  {
    id: "4",
    url: "https://res.cloudinary.com/dylmrhy5h/image/upload/v1757068391/offerImg6_gxlzt9.jpg",
    redirectPath: "/categories/home-decoration",
  },
];

const OfferSection = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Special Offers for You
      </h2>

      {/* Mobile: Horizontal scroll */}
      <div className="flex md:hidden overflow-x-auto gap-4 no-scrollbar pb-4">
        {offerArray.map((offer) => (
          <div
            key={offer.id}
            onClick={() => navigate(offer.redirectPath)}
            className="flex-shrink-0 w-64 cursor-pointer rounded-lg overflow-hidden"
          >
            <img
              src={offer.url}
              alt={`Offer ${offer.id}`}
              className="w-full h-40 object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>

      {/* Desktop: Grid layout */}
      <div className="hidden md:flex flex-col md:flex-row gap-3">
        {/* Left tall Img1 */}
        <div
          onClick={() => navigate(offerArray[0].redirectPath)}
          className="md:w-[30%] cursor-pointer rounded-lg overflow-hidden"
        >
          <img
            src={offerArray[0].url}
            alt="Offer 1"
            className="w-full h-40 md:h-[73vh] object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Right column (Img2 + Img3 + Img4) */}
        <div className="flex-1 flex flex-col gap-5">
          {/* Img2 full width */}
          <div
            onClick={() => navigate(offerArray[1].redirectPath)}
            className="cursor-pointer rounded-lg overflow-hidden"
          >
            <img
              src={offerArray[1].url}
              alt="Offer 2"
              className="w-full h-40 md:h-[35vh] object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Img3 + Img4 side by side */}
          <div className="flex gap-5">
            <div
              onClick={() => navigate(offerArray[2].redirectPath)}
              className="flex-1 cursor-pointer rounded-lg overflow-hidden"
            >
              <img
                src={offerArray[2].url}
                alt="Offer 3"
                className="w-full h-40 md:h-[35vh] object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div
              onClick={() => navigate(offerArray[3].redirectPath)}
              className="flex-1 cursor-pointer rounded-lg overflow-hidden"
            >
              <img
                src={offerArray[3].url}
                alt="Offer 4"
                className="w-full h-40 md:h-[35vh] object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferSection;
