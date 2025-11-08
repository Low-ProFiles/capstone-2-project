
"use client";

import { UseFormRegister } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SpotRequest } from "@/types/course";
import { CourseFormValues } from "@/types/form";

interface SpotEditorProps {
  spot: SpotRequest;
  index: number;
  register: UseFormRegister<CourseFormValues>;  onDelete: (index: number) => void;
  onMove: (index: number, direction: "up" | "down") => void;
  isFirst: boolean;
  isLast: boolean;
  isSelected: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const SpotEditor = ({
  spot,
  index,
  register,
  onDelete,
  onMove,
  isFirst,
  isLast,
  isSelected,
  onMouseEnter,
  onMouseLeave,
}: SpotEditorProps) => {
  return (
    <div
      className={`p-4 border rounded-lg space-y-2 ${
        isSelected ? "bg-blue-50 border-blue-400" : "bg-gray-50"
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex justify-between items-center">
        <h3 className="font-bold">Spot #{index + 1}</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMove(index, "up")}
            disabled={isFirst}
          >
            Up
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMove(index, "down")}
            disabled={isLast}
          >
            Down
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(index)}
          >
            Delete
          </Button>
        </div>
      </div>
      <p className="text-sm text-gray-600">
        Lat: {spot.lat?.toFixed(4)}, Lng: {spot.lng?.toFixed(4)}
      </p>
      <div>
        <Label htmlFor={`spot-title-${index}`}>Title</Label>
        <Input
          id={`spot-title-${index}`}
          {...register(`spots.${index}.title`)}
          placeholder="e.g., Main Gate"
        />
      </div>
      <div>
        <Label htmlFor={`spot-desc-${index}`}>Description</Label>
        <Input
          id={`spot-desc-${index}`}
          {...register(`spots.${index}.description`)}
          placeholder="A brief note about this spot"
        />
      </div>
    </div>
  );
};

export default SpotEditor;
