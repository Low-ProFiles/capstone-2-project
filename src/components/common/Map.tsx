'use client';

import { useState, useEffect } from 'react';
import { CourseDetails, SpotRes } from "@/types";
import { Container as MapDiv, NaverMap, Marker, useNavermaps } from 'react-naver-maps';

interface Props {
  courses: CourseDetails[];
}

export default function Map({ courses }: Props) {
  const navermaps = useNavermaps();
  const [map, setMap] = useState<naver.maps.Map | null>(null);
  const [infoWindow, setInfoWindow] = useState<naver.maps.InfoWindow | null>(null);
  const [openedSpot, setOpenedSpot] = useState<SpotRes | null>(null);

  useEffect(() => {
    if (!map || !navermaps) return;

    const iw = new navermaps.InfoWindow({
      content: '',
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      anchorSize: new navermaps.Size(0, 0),
      disableAnchor: true,
      zIndex: 200,
      pixelOffset: new navermaps.Point(0, -50), // Move window up to not cover the marker
    });
    setInfoWindow(iw);

    const mapClickListener = () => {
      iw.close();
      setOpenedSpot(null);
    };
    navermaps.Event.addListener(map, 'click', mapClickListener);

    // Also handle the InfoWindow's own close button
    const iwCloseListener = () => {
      setOpenedSpot(null);
    };
    navermaps.Event.addListener(iw, 'close', iwCloseListener);

    return () => {
      if (map) {
        navermaps.Event.clearInstanceListeners(map);
      }
    };
  }, [map, navermaps]);

  if (!navermaps) {
    return null;
  }

  const handleMarkerClick = (spot: SpotRes) => {
    if (!map || !infoWindow || !spot.lat || !spot.lng || !navermaps) return;

    // Toggle logic
    if (openedSpot && openedSpot.orderNo === spot.orderNo) {
      infoWindow.close();
      setOpenedSpot(null);
      return;
    }

    const contentString = `
      <div style="padding: 14px; background-color: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); font-family: sans-serif; line-height: 1.5;">
        <h4 style="font-weight: 600; font-size: 16px; margin: 0 0 5px 0; color: #333;">${spot.title}</h4>
        <p style="margin: 0; font-size: 14px; color: #666;">${spot.description}</p>
      </div>`;

    infoWindow.setContent(contentString);
    infoWindow.open(map, new navermaps.LatLng(spot.lat, spot.lng));
    setOpenedSpot(spot);
  };

  return (
    <MapDiv style={{ width: '100%', height: '100%' }}>
      <NaverMap ref={setMap}>
        {courses.flatMap(course => 
          course.spots.map(spot => 
            spot.lat && spot.lng ? (
              <Marker 
                key={`${course.id}-${spot.orderNo}`}
                position={new navermaps.LatLng(spot.lat, spot.lng)}
                onClick={() => handleMarkerClick(spot)}
                zIndex={100}
              />
            ) : null
          )
        )}
      </NaverMap>
    </MapDiv>
  );
}
