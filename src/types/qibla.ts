export interface QiblaData {
  bearing: number; // degrees from true North to Kaaba (0 - 360)
  distanceKm: number; // distance in kilometers
  compassHeading: number; // current device orientation heading (0 - 360)
  relativeAngle: number; // angle relative to device heading (0 means pointing straight at Kaaba)
  isAligned: boolean; // within tolerance (e.g. ±3 degrees)
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface CompassCalibrationState {
  hasDeviceOrientation: boolean;
  permissionGranted: boolean;
  manualHeading: number;
  isManualMode: boolean;
}
