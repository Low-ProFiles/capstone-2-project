import { useState, useEffect, useRef } from "react";
import {
  Container,
  NaverMap,
  Marker,
  InfoWindow,
  Polyline,
  useNavermaps,
} from "react-naver-maps"; // Import Polyline
import { Place } from "@/lib/types";

type MapViewProps = {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: Place[];
  onMarkerClick?: (place: Place) => void;
  onMarkerDragEnd?: (lat: number, lng: number) => void;
  draggableMarkers?: boolean;
  showNumberedMarkers?: boolean; // New prop
  polylinePath?: { lat: number; lng: number }[]; // New prop
  activeMarkerId?: string | null; // New prop for highlighting active marker
  activeInfoWindow?: Place | null; // New prop for controlling info window
  onInfoWindowClose?: () => void; // New prop for closing info window
};

const MapView = ({
  center = { lat: 37.5665, lng: 126.978 }, // Default to Seoul City Hall
  zoom = 10,
  markers = [],
  onMarkerClick,
  onMarkerDragEnd,
  draggableMarkers = false,
  showNumberedMarkers = false, // Default to false
  polylinePath = [], // Default to empty array
  activeMarkerId = null, // Default to null
  activeInfoWindow = null, // Default to null
  onInfoWindowClose,
}: MapViewProps) => {
  const navermaps = useNavermaps();
  // Removed internal activeInfoWindow state, now controlled by props
  const mapRef = useRef<naver.maps.Map | null>(null); // Use useRef for map instance

  // Removed useEffect that adds a map-wide click listener to close info window.
  // The InfoWindow's onClose prop should be sufficient.

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
  }, [center, zoom, mapRef.current, navermaps]);

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

        <>
          {markers.map((place, index) => {
            const isActive = activeMarkerId === place.id;

            const markerContent = showNumberedMarkers
              ? `<div style="\

                      background-color: ${isActive ? "#FFD700" : "#4285F4"};\

                      color: ${isActive ? "black" : "white"};\

                      font-weight: bold;\

                      width: 28px;\

                      height: 28px;\

                      display: flex;\

                      align-items: center;\

                      justify-content: center;\

                      border-radius: 50%;\

                      border: 2px solid white;\

                      box-shadow: 0 2px 4px rgba(0,0,0,0.3);\

                      transform: ${isActive ? "scale(1.2)" : "scale(1)"};\

                      transition: transform 0.2s ease-in-out;\

                    ">${index + 1}</div>`
              : `<div style="\

                      background-color: ${isActive ? "#FFD700" : "#4285F4"};\

                      color: ${isActive ? "black" : "white"};\

                      width: 24px;\

                      height: 24px;\

                      line-height: 24px;\

                      text-align: center;\

                      border-radius: 50%;\

                      border: 2px solid white;\

                      box-shadow: 0 2px 4px rgba(0,0,0,0.3);\

                      transform: ${isActive ? "scale(1.2)" : "scale(1)"};\

                      transition: transform 0.2s ease-in-out;\

                    "></div>`; // Default marker for non-numbered

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
                  // Removed internal setActiveInfoWindow, now controlled by prop
                }}
                icon={{
                  content: markerContent,

                  anchor: new navermaps.Point(14, 14), // Adjust anchor for larger active marker
                }}
              />
            );
          })}
        </>

        {activeInfoWindow && (
          <InfoWindow
            position={
              new navermaps.LatLng(activeInfoWindow.lat, activeInfoWindow.lng)
            }
            content={`
              <div style="padding: 10px; min-width: 150px; max-width: 250px; text-align: center;">
                <h4 style="margin: 0 0 5px 0; font-size: 16px; font-weight: bold;">${
                  activeInfoWindow.name
                }</h4>
                ${
                  activeInfoWindow.desc
                    ? `<p style="margin: 0; font-size: 12px; color: #555;">${activeInfoWindow.desc}</p>`
                    : ""
                }
                <button id="info-window-button" style="margin-top: 10px; padding: 5px 10px; background-color: #4285F4; color: white; border: none; border-radius: 5px; cursor: pointer;">코스 보기</button>
              </div>
            `}
            pixelOffset={new navermaps.Point(0, 0)} // Set pixelOffset to 0,0 for debugging
            onClose={() => onInfoWindowClose && onInfoWindowClose()} // Call prop on close
          />
        )}
      </NaverMap>
    </Container>
  );
};

export default MapView;
