import { QiblaData } from '../types/qibla';

// Coordinates of the Holy Kaaba in Makkah, Saudi Arabia
export const KAABA_COORDINATES = {
  latitude: 21.422487,
  longitude: 39.826206,
};

// Convert degrees to radians
const deg2rad = (deg: number): number => (deg * Math.PI) / 180.0;
// Convert radians to degrees
const rad2deg = (rad: number): number => (rad * 180.0) / Math.PI;

/**
 * Calculates Great Circle bearing from user coordinates to Kaaba
 * @param lat User's latitude
 * @param lng User's longitude
 * @returns Bearing in degrees (0 - 360) clockwise from true North
 */
export function calculateQiblaBearing(lat: number, lng: number): number {
  const phi1 = deg2rad(lat);
  const phi2 = deg2rad(KAABA_COORDINATES.latitude);
  const deltaLambda = deg2rad(KAABA_COORDINATES.longitude - lng);

  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) -
    Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);

  let bearing = rad2deg(Math.atan2(y, x));
  bearing = (bearing + 360) % 360;
  return Math.round(bearing * 10) / 10;
}

/**
 * Calculates distance from user to Kaaba using Haversine formula
 * @returns Distance in kilometers
 */
export function calculateKaabaDistance(lat: number, lng: number): number {
  const R = 6371; // Earth radius in km
  const dLat = deg2rad(KAABA_COORDINATES.latitude - lat);
  const dLng = deg2rad(KAABA_COORDINATES.longitude - lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat)) *
      Math.cos(deg2rad(KAABA_COORDINATES.latitude)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Calculates full Qibla status given user coordinates and compass heading
 */
export function getQiblaInfo(
  latitude: number,
  longitude: number,
  compassHeading = 0
): QiblaData {
  const bearing = calculateQiblaBearing(latitude, longitude);
  const distanceKm = calculateKaabaDistance(latitude, longitude);

  // Relative angle: how much user needs to turn from current heading to face Kaaba
  // (bearing - compassHeading) normalized to -180 to +180
  let diff = (bearing - compassHeading + 360) % 360;
  if (diff > 180) diff -= 360;

  const isAligned = Math.abs(diff) <= 3; // within 3 degrees is aligned

  return {
    bearing,
    distanceKm,
    compassHeading: Math.round(compassHeading),
    relativeAngle: Math.round(diff * 10) / 10,
    isAligned,
    latitude,
    longitude,
  };
}

/**
 * Formats cardinal direction from degrees
 */
export function getCardinalDirection(degrees: number): string {
  const directions = [
    'Utara (N)',
    'Timur Laut (NE)',
    'Timur (E)',
    'Tenggara (SE)',
    'Selatan (S)',
    'Barat Daya (SW)',
    'Barat (W)',
    'Barat Laut (NW)',
  ];
  const index = Math.round(((degrees % 360) + 360) % 360 / 45) % 8;
  return directions[index];
}
