import { useState, useRef } from "react";
import Image from "next/image";
import { Place } from "@/lib/types";

type SpotDetailSheetProps = {
  spots: Place[];
  activeSpotIndex: number;
  onSetActiveSpotIndex: (index: number) => void;
};

const SpotDetailSheet = ({
  spots,
  activeSpotIndex,
  onSetActiveSpotIndex,
}: SpotDetailSheetProps) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [sheetHeight, setSheetHeight] = useState(200); // Initial height

  const activeSpot = spots[activeSpotIndex];

  // Basic drag logic (can be refined for snapping)
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setCurrentY(sheetRef.current?.getBoundingClientRect().top || 0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaY = e.touches[0].clientY - startY;
    const newHeight = window.innerHeight - (currentY + deltaY);
    setSheetHeight(Math.max(50, Math.min(window.innerHeight * 0.8, newHeight))); // Constrain height
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    // Optional: Snap to certain heights (e.g., half screen, full screen)
    // For now, just release
  };

  const handleNext = () => {
    if (activeSpotIndex < spots.length - 1) {
      onSetActiveSpotIndex(activeSpotIndex + 1);
    }
  };

  const handlePrev = () => {
    if (activeSpotIndex > 0) {
      onSetActiveSpotIndex(activeSpotIndex - 1);
    }
  };

  if (!activeSpot) return null;

  return (
    <div
      ref={sheetRef}
      className="fixed bottom-0 left-0 w-full bg-white rounded-t-2xl shadow-lg z-20 p-4 transition-all duration-300 ease-out flex flex-col min-h-[4rem]" // Added min-h-[4rem]
      style={{ height: `${sheetHeight}px` }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd} // Corrected to handleTouchEnd
    >
      {/* Drag handle */}
      <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4 cursor-grab" />

      {/* Spot Info */}
      <div className="flex mb-4 flex-grow overflow-y-auto pt-2">
        {/* Changed to flex container */}
        {activeSpot.imageUrl && (
          <div className="w-4/10 pr-4 flex-shrink-0">
            {/* 30% width for image */}
            <Image
              src={activeSpot.imageUrl}
              alt={activeSpot.name}
              width={150}
              height={150}
              className="w-full h-auto aspect-square object-cover rounded-lg shadow-md"
            />
          </div>
        )}
        <div className="w-6/10 flex flex-col">
          {" "}
          {/* 70% width for text, vertically split */}
          <h3 className="text-xl font-bold mb-1">{activeSpot.name}</h3>
          <p className="text-gray-600 text-sm">{activeSpot.desc}</p>
          {activeSpot.estimatedTime && (
            <p className="text-gray-700 text-xs mt-1">
              <span className="font-semibold">예상 시간:</span>{" "}
              {activeSpot.estimatedTime}
            </p>
          )}
          {activeSpot.budget && (
            <p className="text-gray-700 text-xs">
              <span className="font-semibold">예상 비용:</span>{" "}
              {activeSpot.budget}
            </p>
          )}
          {activeSpot.recommendation && (
            <p className="text-gray-700 text-xs">
              <span className="font-semibold">추천:</span>{" "}
              {activeSpot.recommendation}
            </p>
          )}
          {activeSpot.openingHours && (
            <p className="text-gray-700 text-xs">
              <span className="font-semibold">운영 시간:</span>{" "}
              {activeSpot.openingHours}
            </p>
          )}
          {activeSpot.contact && (
            <p className="text-gray-700 text-xs">
              <span className="font-semibold">연락처:</span>{" "}
              {activeSpot.contact}
            </p>
          )}
          {activeSpot.website && (
            <p className="text-gray-700 text-xs truncate">
              <span className="font-semibold">웹사이트:</span>{" "}
              <a
                href={activeSpot.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {activeSpot.website}
              </a>
            </p>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-auto">
        {" "}
        {/* Added mt-auto to push to bottom */}
        <button
          onClick={handlePrev}
          disabled={activeSpotIndex === 0}
          className="px-4 py-2 bg-gray-200 rounded-full disabled:opacity-50 font-semibold" // Added font-semibold
        >
          이전
        </button>
        <span className="text-lg font-semibold">
          {activeSpotIndex + 1} / {spots.length}
        </span>
        <button
          onClick={handleNext}
          disabled={activeSpotIndex === spots.length - 1}
          className="px-4 py-2 bg-gray-200 rounded-full disabled:opacity-50 font-semibold" // Added font-semibold
        >
          다음
        </button>
      </div>

      {/* Optional: Spot list/carousel here */}
    </div>
  );
};

export default SpotDetailSheet;
