import { X } from "lucide-react";

const FullscreenImageModal = ({
  mainImage,
  setIsOpen,
}: {
  mainImage: string;
  setIsOpen: (open: boolean) => void;
}) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 cursor-pointer"
      onClick={() => setIsOpen(false)}
    >
      {/* Close Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(false);
        }}
        className="absolute top-5 right-5 p-2 bg-white/30 backdrop-blur-md rounded-full hover:bg-white/50 transition"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      <div className="overflow-hidden w-full h-full flex items-center justify-center">
        <img
          src={mainImage}
          alt="fullscreen"
          className="object-contain max-w-[95%] max-h-[95%] rounded-lg shadow-lg select-none cursor-default"
          onClick={(e) => e.stopPropagation()}
          draggable={false}
        />
      </div>
    </div>
  );
};

export default FullscreenImageModal;
