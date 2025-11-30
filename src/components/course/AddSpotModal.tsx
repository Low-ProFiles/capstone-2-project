import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Container as MapDiv,
  NaverMap,
  Marker,
  useNavermaps,
} from "react-naver-maps";
import ImageUpload from "@/components/common/ImageUpload"; // Import ImageUpload

import type { SpotReq } from "@/types/course";

// Define the props for the modal
interface AddSpotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (spot: Omit<SpotReq, "orderNo">) => void; // A more specific type should be used
  orderNo: number; // This is for new spots, or the order of the spot being edited
  editingSpot?: SpotReq | null; // New prop for editing
}

export default function AddSpotModal({
  isOpen,
  onClose,
  onSave,
  editingSpot,
}: AddSpotModalProps) {
  const navermaps = useNavermaps();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stayMinutes, setStayMinutes] = useState("");
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [spotImageUrl, setSpotImageUrl] = useState<string | undefined>(
    undefined
  );
  const [map, setMap] = useState<naver.maps.Map | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (editingSpot) {
        setTitle(editingSpot.title);
        setDescription(editingSpot.description || "");
        setPrice(String(editingSpot.price || ""));
        setStayMinutes(String(editingSpot.stayMinutes || ""));
        if (editingSpot.lat && editingSpot.lng) {
          setPosition({ lat: editingSpot.lat, lng: editingSpot.lng });
        } else {
          setPosition(null);
        }
        setSpotImageUrl(
          editingSpot.images && editingSpot.images.length > 0
            ? editingSpot.images[0]
            : undefined
        );
      } else {
        // Reset for new spot
        setTitle("");
        setDescription("");
        setPrice("");
        setStayMinutes("");
        setPosition(null);
        setSpotImageUrl(undefined);
      }
    }
  }, [isOpen, editingSpot]);

  const handleMapClick = useCallback((e: naver.maps.PointerEvent) => {
    const newPos = { lat: e.coord.y, lng: e.coord.x };
    setPosition(newPos);
  }, []);

  useEffect(() => {
    if (!map || !navermaps) return;

    const listener = navermaps.Event.addListener(map, "click", handleMapClick);

    return () => {
      navermaps.Event.removeListener(listener);
    };
  }, [map, navermaps, handleMapClick]);

  const handleSave = () => {
    if (!title || !position) {
      alert("장소 이름과 위치를 모두 지정해야 합니다.");
      return;
    }
    onSave({
      title,
      description,
      price: Number(price) || 0,
      stayMinutes: Number(stayMinutes) || 0,
      lat: position.lat,
      lng: position.lng,
      images: spotImageUrl ? [spotImageUrl] : [],
    });
    onClose();
  };

  const handleNumericChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const { value } = e.target;
    if (/^[0-9]*$/.test(value)) {
      setter(value);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingSpot ? "장소 수정" : "새로운 장소 추가"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <MapDiv className="h-64 w-full">
            <NaverMap
              ref={setMap}
              defaultCenter={
                position
                  ? new navermaps.LatLng(position.lat, position.lng)
                  : new navermaps.LatLng(37.2305868, 127.1878064)
              } // Default to Seoul or editing spot's position
              defaultZoom={16}
            >
              {position && <Marker position={position} />}
            </NaverMap>
          </MapDiv>
          {position && (
            <p className="text-sm text-gray-500 mb-2">
              선택된 위치: {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
              {Number(stayMinutes) > 0 && `, 예상 체류 시간: ${stayMinutes}분`}
            </p>
          )}
          <div className="space-y-2">
            <Label htmlFor="spot-title">장소 이름</Label>
            <Input
              id="spot-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="spot-description">장소 설명</Label>
            <Input
              id="spot-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="spot-price">예상 비용 (원)</Label>
            <Input
              id="spot-price"
              type="text"
              inputMode="numeric"
              value={price}
              onChange={(e) => handleNumericChange(e, setPrice)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="spot-stay-minutes">예상 체류 시간 (분)</Label>
            <Input
              id="spot-stay-minutes"
              type="text"
              inputMode="numeric"
              value={stayMinutes}
              onChange={(e) => handleNumericChange(e, setStayMinutes)}
            />
          </div>
          <ImageUpload
            onUploadSuccess={setSpotImageUrl}
            currentImageUrl={spotImageUrl}
            label="장소 이미지"
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">취소</Button>
          </DialogClose>
          <Button onClick={handleSave}>저장</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
