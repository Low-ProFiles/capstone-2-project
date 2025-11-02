'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Container as MapDiv, NaverMap, Marker, useNavermaps } from 'react-naver-maps';

// Define the props for the modal
interface AddSpotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (spot: any) => void; // A more specific type should be used
  orderNo: number;
}

export default function AddSpotModal({ isOpen, onClose, onSave, orderNo }: AddSpotModalProps) {
  const navermaps = useNavermaps();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // Reset form when modal opens
    if (isOpen) {
      setTitle('');
      setDescription('');
      setPosition(null);
    }
  }, [isOpen]);

  const handleMapClick = (e: any) => {
    const { coord } = e;
    setPosition({ lat: coord.y, lng: coord.x });
  };

  const handleSave = () => {
    if (!title || !position) {
      alert('장소 이름과 위치를 모두 지정해야 합니다.');
      return;
    }
    onSave({
      orderNo,
      title,
      description,
      lat: position.lat,
      lng: position.lng,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-lg">
        <DialogHeader>
          <DialogTitle>새로운 장소 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <MapDiv className="h-64 w-full">
            <NaverMap
              defaultCenter={new navermaps.LatLng(37.5665, 126.9780)} // Default to Seoul
              defaultZoom={15}
              onClick={handleMapClick}
            >
              {position && <Marker position={position} />}
            </NaverMap>
          </MapDiv>
          <div className="space-y-2">
            <Label htmlFor="spot-title">장소 이름</Label>
            <Input id="spot-title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="spot-description">장소 설명</Label>
            <Input id="spot-description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          {position && (
            <div className="text-sm text-gray-500">
              선택된 위치: {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
            </div>
          )}
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
