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
  onBoundsChanged,
  activePlaceId = null,
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
          const shortDesc = place.desc && place.desc.length > 60 ? `${place.desc.substring(0, 60)}...` : place.desc;

          const activeMarkerContent = `
            <div style="
              display: flex;
              align-items: center;
              transform-origin: left bottom;
              transition: all 0.2s ease;
            "
              onmouseover="this.style.transform='scale(1.05)'; this.style.zIndex='100';"
              onmouseout="this.style.transform='scale(1)'; this.style.zIndex='1';"
            >
              <!-- Numbered Circle -->
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
                flex-shrink: 0;
                z-index: 2;
              ">
                <div style="
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  border-radius: 50%;
                  background-color: rgba(0, 0, 0, 0.4);
                "></div>
                <span style="
                  position: relative;
                  color: white;
                  font-size: 16px;
                  font-weight: bold;
                  text-shadow: 0 0 4px black;
                ">${index + 1}</span>
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

              <!-- Text Box -->
              <div style="
                background-color: white;
                border: 1px solid #ddd;
                border-radius: 8px;
                padding: 8px 12px;
                margin-left: -22px; /* Overlap with the circle */
                padding-left: 30px; /* Space for the overlap */
                box-shadow: 2px 2px 8px rgba(0,0,0,0.2);
                max-width: 180px;
                white-space: normal;
                z-index: 1;
              ">
                <div style="
                  font-weight: bold;
                  font-size: 14px;
                  color: #333;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                ">${place.name}</div>
                <div style="
                  font-size: 12px;
                  color: #666;
                  margin-top: 4px;
                  /* Multi-line ellipsis */
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  -webkit-box-orient: vertical;
                  overflow: hidden;
                  text-overflow: ellipsis;
                ">${shortDesc || ''}</div>
              </div>
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
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: rgba(0, 0, 0, 0.4);
              "></div>
              <span style="
                position: relative;
                color: white;
                font-size: 16px;
                font-weight: bold;
                text-shadow: 0 0 4px black;
              ">${index + 1}</span>
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
                content: isCurrentPlaceActive ? activeMarkerContent : simpleMarkerContent,
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
