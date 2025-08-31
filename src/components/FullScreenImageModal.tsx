import { useState } from "react";
import { ZoomIn, X } from "lucide-react";

const FullscreenImageModal = ({
  mainImage,
  setIsOpen,
}: {
  mainImage: string;
  setIsOpen: (open: boolean) => void;
}) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 5));

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
    setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging) {
      setPosition({ x: e.clientX - startPos.x, y: e.clientY - startPos.y });
    }
  };

  const handleMouseUp = () => setDragging(false);

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

      {/* Zoom In Button */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 flex gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleZoomIn();
          }}
          className="p-2 bg-white/30 backdrop-blur-md rounded-full hover:bg-white/50 transition"
        >
          <ZoomIn className="w-6 h-6 text-white" />
        </button>
      </div>

      <div
        className="overflow-hidden w-full h-full flex items-center justify-center"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <img
          src={mainImage}
          alt="fullscreen"
          style={{
            transform: `scale(${zoom}) translate(${position.x / zoom}px, ${
              position.y / zoom
            }px)`,
            transformOrigin: "center center",
            cursor: zoom > 1 ? "grab" : "default",
          }}
          className="object-contain transition-transform duration-200 select-none"
          onClick={(e) => e.stopPropagation()}
          draggable={false}
        />
      </div>
    </div>
  );
};

export default FullscreenImageModal;
