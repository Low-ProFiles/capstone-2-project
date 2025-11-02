"use client";

import { useState, useEffect, useCallback } from "react";
import { Container as MapDiv, NaverMap, Marker, useNavermaps } from "react-naver-maps";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateCourse } from "@/lib/apis/course.api";
import { useGetCategories } from "@/lib/apis/category.api";
import { useRouter } from "next/navigation";
import type { SpotReq } from "@/types";

// A component to manage a single spot's details
function SpotEditor({
  spot,
  index,
  onSpotChange,
  onDelete,
  onMove,
  isFirst,
  isLast,
  isSelected,
  onMouseEnter,
  onMouseLeave,
}: {
  spot: SpotReq;
  index: number;
  onSpotChange: (index: number, field: keyof SpotReq, value: string) => void;
  onDelete: (index: number) => void;
  onMove: (index: number, direction: "up" | "down") => void;
  isFirst: boolean;
  isLast: boolean;
  isSelected: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
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
          value={spot.title}
          onChange={(e) => onSpotChange(index, "title", e.target.value)}
          placeholder="e.g., Main Gate"
        />
      </div>
      <div>
        <Label htmlFor={`spot-desc-${index}`}>Description</Label>
        <Input
          id={`spot-desc-${index}`}
          value={spot.description || ""}
          onChange={(e) => onSpotChange(index, "description", e.target.value)}
          placeholder="A brief note about this spot"
        />
      </div>
    </div>
  );
}

export default function NewCoursePage() {
  const router = useRouter();
  const createCourseMutation = useCreateCourse();
  const { data: categories, isLoading: areCategoriesLoading } =
    useGetCategories();

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [spots, setSpots] = useState<SpotReq[]>([]);
  const [selectedSpotIndex, setSelectedSpotIndex] = useState<number | null>(
    null
  );

  const navermaps = useNavermaps();
  const [map, setMap] = useState<naver.maps.Map | null>(null);

  const handleMapClick = useCallback((e: naver.maps.PointerEvent) => {
    const newSpot: SpotReq = {
      lat: e.coord.y,
      lng: e.coord.x,
      orderNo: spots.length + 1,
      title: `Spot ${spots.length + 1}`, // Placeholder title
    };
    setSpots((prevSpots) => [...prevSpots, newSpot]);
  }, [spots]);

  useEffect(() => {
    if (!map || !navermaps) return;

    const listener = navermaps.Event.addListener(map, "click", handleMapClick);

    return () => {
      navermaps.Event.removeListener(listener);
    };
  }, [map, navermaps, handleMapClick]);

  const handleSpotChange = (
    index: number,
    field: keyof SpotReq,
    value: string
  ) => {
    const newSpots = [...spots];
    newSpots[index] = { ...newSpots[index], [field]: value };
    setSpots(newSpots);
  };

  const handleDeleteSpot = (index: number) => {
    const newSpots = spots.filter((_, i) => i !== index);
    const reorderedSpots = newSpots.map((spot, i) => ({
      ...spot,
      orderNo: i + 1,
    }));
    setSpots(reorderedSpots);
  };

  const handleMoveSpot = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === spots.length - 1)
    ) {
      return;
    }

    const newSpots = [...spots];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const temp = newSpots[index];
    newSpots[index] = newSpots[targetIndex];
    newSpots[targetIndex] = temp;

    const reorderedSpots = newSpots.map((spot, i) => ({
      ...spot,
      orderNo: i + 1,
    }));
    setSpots(reorderedSpots);
  };

  const handleSubmit = () => {
    if (!title || !categoryId || spots.length === 0) {
      alert("Please fill out all fields and add at least one spot.");
      return;
    }

    createCourseMutation.mutate(
      { title, summary, spots, categoryId },
      {
        onSuccess: (data) => {
          alert("Course created successfully!");
          router.push(`/courses/${data.id}`);
        },
        onError: (error) => {
          alert(`Failed to create course: ${error.message}`);
        },
      }
    );
  };

  return (
    <div className="flex h-[calc(100vh-65px)]">
      {/* Form & Spots Panel */}
      <aside className="w-1/3 lg:w-1/4 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Create New Course</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Course Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., A walk in the park"
            />
          </div>
          <div>
            <Label htmlFor="summary">Summary</Label>
            <Input
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="A short description"
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select onValueChange={setCategoryId} value={categoryId}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {areCategoriesLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading...
                  </SelectItem>
                ) : (
                  categories?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <hr />
          <h3 className="font-semibold">Spots</h3>
          <div className="space-y-2">
            {spots.map((spot, index) => (
              <SpotEditor
                key={index}
                spot={spot}
                index={index}
                onSpotChange={handleSpotChange}
                onDelete={handleDeleteSpot}
                onMove={handleMoveSpot}
                isFirst={index === 0}
                isLast={index === spots.length - 1}
                isSelected={selectedSpotIndex === index}
                onMouseEnter={() => setSelectedSpotIndex(index)}
                onMouseLeave={() => setSelectedSpotIndex(null)}
              />
            ))}
          </div>
          {spots.length === 0 && (
            <p className="text-sm text-gray-500">
              Click on the map to add a spot.
            </p>
          )}
          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={createCourseMutation.isPending}
          >
            {createCourseMutation.isPending ? "Saving..." : "Save Course"}
          </Button>
        </div>
      </aside>

      {/* Main Map Area */}
      <main className="w-2/3 lg:w-3/4">
        <MapDiv style={{ width: "100%", height: "100%" }}>
          <NaverMap ref={setMap}>
            {spots.map((spot, index) => (
              <Marker
                key={index}
                position={{ lat: spot.lat!, lng: spot.lng! }}
                icon={{
                  content: `<div style="background-color: ${
                    selectedSpotIndex === index ? "blue" : "red"
                  }; width: 20px; height: 20px; border-radius: 50%;"></div>`,
                }}
              />
            ))}
          </NaverMap>
        </MapDiv>
      </main>
    </div>
  );
}
