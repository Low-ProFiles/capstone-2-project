'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Place } from '@/lib/types';

// Dynamically import MapView with ssr: false
const MapView = dynamic(() => import('./MapView'), { ssr: false });

type AddPlaceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (place: Place) => void;
};

const AddPlaceModal = ({ isOpen, onClose, onSave }: AddPlaceModalProps) => {
  const [placeName, setPlaceName] = useState('');
  const [placeDescription, setPlaceDescription] = useState('');
  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number }>({ lat: 37.5665, lng: 126.9780 }); // Default to Seoul City Hall area
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSave = () => {
    if (!placeName.trim()) {
      alert('장소 이름을 입력해주세요.');
      return;
    }
    const newPlace: Place = {
      id: Date.now().toString(), // Simple unique ID
      name: placeName,
      desc: placeDescription,
      lat: markerPosition.lat,
      lng: markerPosition.lng,
    };
    onSave(newPlace);
    setPlaceName('');
    setPlaceDescription('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-6 space-y-4 relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold text-center mb-4">스팟 추가하기</h2>

        {/* Map View */}
        <div className="w-full h-48 rounded-lg overflow-hidden border border-gray-300">
          <MapView
            center={markerPosition}
            zoom={14}
            markers={[{ id: 'draggable-marker', name: '새 장소', lat: markerPosition.lat, lng: markerPosition.lng }]} // Pass a single draggable marker
            onMarkerDragEnd={(lat, lng) => setMarkerPosition({ lat, lng })}
            draggableMarkers={true}
          />
        </div>

        {/* Place Name Input */}
        <div>
          <label htmlFor="placeName" className="block text-sm font-medium text-gray-700 mb-1">
            장소 이름
          </label>
          <input
            type="text"
            id="placeName"
            value={placeName}
            onChange={(e) => setPlaceName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Place Description Input */}
        <div>
          <label htmlFor="placeDescription" className="block text-sm font-medium text-gray-700 mb-1">
            장소 설명
          </label>
          <textarea
            id="placeDescription"
            value={placeDescription}
            onChange={(e) => setPlaceDescription(e.target.value)}
            rows={2}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-3 border border-gray-300 rounded-full bg-white text-gray-800 font-semibold shadow-sm"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-3 bg-black text-white rounded-full font-semibold shadow-sm"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPlaceModal;
