"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Container as MapDiv,
  NaverMap,
  Marker,
  useNavermaps,
} from "react-naver-maps";
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
import ImageUpload from "@/components/common/ImageUpload";

// UI-specific type for the spot editor
type UISpot = Omit<SpotReq, "price" | "stayMinutes"> & {
  price: string;
  stayMinutes: string;
};

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
  spot: UISpot;
  index: number;
  onSpotChange: (index: number, field: keyof UISpot, value: string) => void;
  onDelete: (index: number) => void;
  onMove: (index: number, direction: "up" | "down") => void;
  isFirst: boolean;
  isLast: boolean;
  isSelected: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const handleNumericChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "price" | "stayMinutes"
  ) => {
    const { value } = e.target;
    if (/^[0-9]*$/.test(value)) {
      onSpotChange(index, field, value);
    }
  };

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
      {Number(spot.stayMinutes) > 0 && (
        <p className="text-sm text-gray-600">
          예상 체류 시간: {spot.stayMinutes}분
        </p>
      )}
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
      <div>
        <Label htmlFor={`spot-price-${index}`}>Price</Label>
        <Input
          id={`spot-price-${index}`}
          type="text" // Use text to allow empty string
          inputMode="numeric" // Hint for numeric keyboard on mobile
          value={spot.price}
          onChange={(e) => handleNumericChange(e, "price")}
        />
      </div>
      <div>
        <Label htmlFor={`spot-stay-${index}`}>Stay Minutes</Label>
        <Input
          id={`spot-stay-${index}`}
          type="text" // Use text to allow empty string
          inputMode="numeric"
          value={spot.stayMinutes}
          onChange={(e) => handleNumericChange(e, "stayMinutes")}
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
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [regionCode] = useState("1100000000"); // Default: Seoul
  const [regionName] = useState("서울특별시");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [estimatedCost, setEstimatedCost] = useState(10000);
  const [tagsString, setTagsString] = useState("");
  const [spots, setSpots] = useState<UISpot[]>([]);
  const [selectedSpotIndex, setSelectedSpotIndex] = useState<number | null>(
    null
  );

  const navermaps = useNavermaps();
  const [map, setMap] = useState<naver.maps.Map | null>(null);

  const handleMapClick = useCallback(
    (e: naver.maps.PointerEvent) => {
      const newSpot: UISpot = {
        lat: e.coord.y,
        lng: e.coord.x,
        orderNo: spots.length + 1,
        title: `Spot ${spots.length + 1}`, // Placeholder title
        description: "",
        images: [],
        stayMinutes: "",
        price: "",
      };
      setSpots((prevSpots) => [...prevSpots, newSpot]);
    },
    [spots]
  );

  useEffect(() => {
    if (!map || !navermaps) return;

    const listener = navermaps.Event.addListener(map, "click", handleMapClick);

    return () => {
      navermaps.Event.removeListener(listener);
    };
  }, [map, navermaps, handleMapClick]);

  const handleSpotChange = (
    index: number,
    field: keyof UISpot,
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
    if (!title.trim()) {
      alert("코스 제목을 입력해주세요.");
      return;
    }
    if (!description.trim()) {
      alert("코스 설명을 입력해주세요.");
      return;
    }
    if (!categoryId) {
      alert("카테고리를 선택해주세요.");
      return;
    }
    if (!coverImageUrl) {
      alert("대표 이미지를 업로드해주세요.");
      return;
    }
    if (durationMinutes <= 0) {
      alert("예상 소요 시간은 0보다 커야 합니다.");
      return;
    }
    if (estimatedCost <= 0) {
      alert("예상 비용은 0보다 커야 합니다.");
      return;
    }
    if (spots.length < 2) {
      alert("코스는 최소 2개 이상의 스팟을 포함해야 합니다.");
      return;
    }

    // Convert UI state to API state before validation and submission
    const spotsForApi: SpotReq[] = spots.map((spot) => ({
      ...spot,
      price: Number(spot.price) || 0,
      stayMinutes: Number(spot.stayMinutes) || 0,
    }));

    // Validate each spot
    for (const spot of spotsForApi) {
      if (!spot.title?.trim()) {
        alert("모든 스팟의 제목을 입력해주세요.");
        return;
      }
      if (!spot.description?.trim()) {
        // Assuming description can be optional from UI perspective
        alert(`스팟 #${spot.orderNo}의 설명을 입력해주세요.`);
        return;
      }
      if (!spot.lat || !spot.lng) {
        alert(`스팟 #${spot.orderNo}의 위치를 지정해주세요.`);
        return;
      }
      if (spot.price < 0) {
        // Price can be 0, but not negative
        alert(`스팟 #${spot.orderNo}의 예상 비용을 0 이상으로 입력해주세요.`);
        return;
      }
      if (spot.stayMinutes < 0) {
        // StayMinutes can be 0, but not negative
        alert(
          `스팟 #${spot.orderNo}의 예상 체류 시간을 0분 이상으로 입력해주세요.`
        );
        return;
      }
    }

    createCourseMutation.mutate(
      {
        title,
        description,
        categoryId: categoryId!,
        coverImageUrl,
        regionCode,
        regionName,
        tags: tagsString
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t),
        spots: spotsForApi,
      },
      {
        onSuccess: (data) => {
          alert("코스가 성공적으로 생성되었습니다!");
          router.push(`/${data.id}`);
        },
        onError: (error) => {
          alert(`코스 생성에 실패했습니다: ${error.message}`);
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
              maxLength={20}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
          <div>
            <Label>Cover Image</Label>
            <ImageUpload
              onUploadSuccess={setCoverImageUrl}
              currentImageUrl={coverImageUrl}
              label="Upload Cover Image"
            />
          </div>
          <div>
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="cost">Estimated Cost (KRW)</Label>
            <Input
              id="cost"
              type="number"
              value={estimatedCost}
              onChange={(e) => setEstimatedCost(Number(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={tagsString}
              onChange={(e) => setTagsString(e.target.value)}
              placeholder="e.g., cafe, photo, date"
            />
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
