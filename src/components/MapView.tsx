import { useEffect, useRef } from "react";
import {
  Container,
  NaverMap,
  Marker,
  Polyline,
  useNavermaps,
} from "react-naver-maps"; // Removed InfoWindow import
import { Place } from "@/lib/types";

type MapViewProps = {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: Place[];
  onMarkerClick?: (place: Place) => void;
  onMarkerDragEnd?: (lat: number, lng: number) => void;
  draggableMarkers?: boolean;
  polylinePath?: { lat: number; lng: number }[];
  onInfoWindowClose?: () => void;
  onBoundsChanged?: (bounds: naver.maps.Bounds) => void;
};

const MapView = ({
  center = { lat: 37.5665, lng: 126.978 }, // Default to Seoul City Hall
  zoom = 10,
  markers = [], // Re-added
  onMarkerClick, // Re-added
  onMarkerDragEnd, // Re-added
  draggableMarkers = false, // Re-added
  polylinePath = [],
  onInfoWindowClose,
  onBoundsChanged,
}: MapViewProps) => {
  const navermaps = useNavermaps();
  const mapRef = useRef<naver.maps.Map | null>(null); // Use useRef for map instance

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const listeners: naver.maps.MapEventListener[] = [];

    if (onInfoWindowClose) {
      listeners.push(
        navermaps.Event.addListener(map, "click", () => {
          onInfoWindowClose();
        })
      );
    }

    if (onBoundsChanged) {
      listeners.push(
        navermaps.Event.addListener(map, "idle", () => {
          onBoundsChanged(map.getBounds());
        })
      );
      // Initial call
      onBoundsChanged(map.getBounds());
    }

    // Cleanup listeners on component unmount
    return () => {
      listeners.forEach((listener) => navermaps.Event.removeListener(listener));
    };
  }, [onInfoWindowClose, onBoundsChanged, navermaps]);

  // Effect to update map center and zoom when props change
  useEffect(() => {
    if (mapRef.current && center && zoom) {
      // Use morph for smooth transition of both center and zoom
      mapRef.current.morph(new navermaps.LatLng(center.lat, center.lng), zoom);
    } else if (mapRef.current && center) {
      // If only center changes, pan smoothly
      mapRef.current.panTo(new navermaps.LatLng(center.lat, center.lng));
    } else if (mapRef.current && zoom) {
      // If only zoom changes, set zoom (morph doesn't have a zoom-only smooth option)
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

  return (
    <Container className="w-full h-full" id="naver-map-container">
      <NaverMap
        ref={mapRef} // Assign ref to NaverMap
        defaultCenter={new navermaps.LatLng(center.lat, center.lng)}
        defaultZoom={zoom}
        // Disable default POI overlay clutter
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

        {markers.map((place) => {
          // const isActive = activeMarkerId === place.id; // isActive is no longer used
          const markerContent =
            '<div style="width:22px;height:22px;background-color:red;border:1px solid black;text-align:center;line-height:22px;">' +
            place.name +
            "</div>";

          return (
            <Marker
              key={place.id} // Re-added key
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
                content: markerContent,
                anchor: new navermaps.Point(markerContent.length * 3, 20), // Adjusted anchor for text label
              }}
            />
          );
        })}
      </NaverMap>
    </Container>
  );
};

export default MapView;
