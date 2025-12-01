"use client";

import { useEffect, useRef } from "react";
import {
  Container,
  NaverMap,
  Marker,
  Polyline,
  useNavermaps,
} from "react-naver-maps";
import { Place } from "@/lib/types";
import { Loader2 } from "lucide-react";

type MapViewProps = {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: Place[];
  onMarkerClick?: (place: Place) => void;
  onMarkerDragEnd?: (lat: number, lng: number) => void;
  draggableMarkers?: boolean;
  polylinePath?: { lat: number; lng: number }[];
  onInfoWindowClose?: () => void;
  onViewportChange?: (isEmpty: boolean) => void;
  activePlaceId?: string | null;
};

const MapView = ({
  center = { lat: 37.5665, lng: 126.978 }, // Default to Seoul City Hall
  zoom = 10,
  markers = [],
  onMarkerClick,
  onMarkerDragEnd,
  draggableMarkers = false,
  polylinePath = [],
  onInfoWindowClose,
  onViewportChange,
  activePlaceId = null,
}: MapViewProps) => {
  const navermaps = useNavermaps();
  const mapRef = useRef<naver.maps.Map | null>(null); // Use useRef for map instance

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !navermaps) return;

    const listeners: naver.maps.MapEventListener[] = [];

    if (onInfoWindowClose) {
      listeners.push(
        navermaps.Event.addListener(map, "click", () => {
          onInfoWindowClose();
        })
      );
    }

    // Handle viewport changes internally
    if (onViewportChange) {
      const handleBoundsChanged = () => {
        if (!navermaps || !markers || markers.length === 0) {
          onViewportChange(true);
          return;
        }
        const bounds = map.getBounds();
        const visibleMarkers = markers.filter((marker) =>
          bounds.hasPoint(new navermaps.LatLng(marker.lat, marker.lng))
        );
        onViewportChange(visibleMarkers.length === 0);
      };

      listeners.push(
        navermaps.Event.addListener(map, "idle", handleBoundsChanged)
      );
      // Initial call
      handleBoundsChanged();
    }

    // Cleanup listeners on component unmount
    return () => {
      listeners.forEach((listener) => navermaps.Event.removeListener(listener));
    };
  }, [onInfoWindowClose, onViewportChange, navermaps, markers]);

  // Effect to update map center and zoom when props change
  useEffect(() => {
    if (mapRef.current && center && zoom) {
      mapRef.current.morph(new navermaps.LatLng(center.lat, center.lng), zoom);
    } else if (mapRef.current && center) {
      mapRef.current.panTo(new navermaps.LatLng(center.lat, center.lng));
    } else if (mapRef.current && zoom) {
      mapRef.current.setZoom(zoom);
    }
  }, [center, zoom, navermaps]);

  // Fallback for missing client ID - this conditional rendering must be after hooks
  if (!process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID) {
    return (
      <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600">
        Naver Maps Client ID is missing. Please set
        NEXT_PUBLIC_NAVER_MAP_CLIENT_ID in your .env.local file.
      </div>
    );
  }

  if (!navermaps) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Container className="w-full h-full" id="naver-map-container">
      <NaverMap
        ref={mapRef} // Assign ref to NaverMap
        defaultCenter={new navermaps.LatLng(center.lat, center.lng)}
        defaultZoom={zoom}
        mapTypeControl={false}
        zoomControl={false}
        scaleControl={false}
        logoControl={false}
        mapDataControl={false}
      >
        {polylinePath.length > 1 && (
          <Polyline
            path={polylinePath.map((p) => new navermaps.LatLng(p.lat, p.lng))}
            strokeColor="#5347AA"
            strokeOpacity={0.8}
            strokeWeight={6}
          />
        )}

        {markers.map((place, index) => {
          const isCurrentPlaceActive = activePlaceId === place.id;

          const activeMarkerContent = `
            <div style="
              position: relative;
              width: 44px;
              height: 44px;
              border-radius: 50%;
              background-image: url('${place.imageUrl}');
              background-size: cover;
              background-position: center;
              border: 3px solid #5347AA;
              box-shadow: 0 6px 12px rgba(0,0,0,0.35);
              display: flex;
              align-items: center;
              justify-content: center;
              transition: all 0.2s ease;
              transform: scale(1.1);
            ">
              <div style="
                position: absolute;
                bottom: -10px;
                left: 50%;
                transform: translateX(-50%);
                width: 0;
                height: 0;
                border-left: 10px solid transparent;
                border-right: 10px solid transparent;
                border-top: 14px solid #5347AA;
              "></div>
            </div>
          `;

          const simpleMarkerContent = `
            <div style="
              position: relative;
              width: 44px;
              height: 44px;
              border-radius: 50%;
              background-image: url('${place.imageUrl}');
              background-size: cover;
              background-position: center;
              border: 3px solid #5347AA;
              box-shadow: 0 4px 8px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              transition: all 0.2s ease;
            "
              onmouseover="this.style.transform='scale(1.1)'; this.style.zIndex='10';"
              onmouseout="this.style.transform='scale(1)'; this.style.zIndex='1';"
            >
              <div style="
                position: absolute;
                bottom: -10px;
                left: 50%;
                transform: translateX(-50%);
                width: 0;
                height: 0;
                border-left: 10px solid transparent;
                border-right: 10px solid transparent;
                border-top: 14px solid #5347AA;
              "></div>
            </div>
          `;

          return (
            <Marker
              key={place.id}
              position={new navermaps.LatLng(place.lat, place.lng)}
              draggable={draggableMarkers}
              onDragend={(e: naver.maps.PointerEvent) => {
                if (onMarkerDragEnd) {
                  onMarkerDragEnd(e.coord.y, e.coord.x);
                }
              }}
              onClick={() => {
                if (onMarkerClick) {
                  onMarkerClick(place);
                }
              }}
              icon={{
                content: isCurrentPlaceActive
                  ? activeMarkerContent
                  : simpleMarkerContent,
                anchor: new navermaps.Point(22, 54),
              }}
              zIndex={isCurrentPlaceActive ? 100 : index + 1}
            />
          );
        })}
      </NaverMap>
    </Container>
  );
};

export default MapView;
