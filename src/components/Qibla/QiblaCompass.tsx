import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LocationInfo } from '../../types/prayer';
import {
  calculateQiblaBearing,
  calculateKaabaDistance,
  getCardinalDirection,
} from '../../utils/qiblaCalculator';
import { soundManager } from '../../utils/audioService';
import {
  Compass,
  RotateCw,
  MapPin,
  ArrowLeft,
  ShieldCheck,
  Info,
  Smartphone,
  Sparkles,
  Volume2,
  VolumeX,
  Gauge,
  Move,
} from 'lucide-react';

interface QiblaCompassProps {
  location: LocationInfo;
  onOpenLocationModal: () => void;
  onBack?: () => void;
}

export const QiblaCompass: React.FC<QiblaCompassProps> = ({
  location,
  onOpenLocationModal,
  onBack,
}) => {
  // Raw sensor values
  const [targetHeading, setTargetHeading] = useState<number>(0);
  const [rawPitch, setRawPitch] = useState<number>(0); // beta (front-to-back tilt)
  const [rawRoll, setRawRoll] = useState<number>(0); // gamma (left-to-right tilt)
  const [hasSensor, setHasSensor] = useState<boolean>(false);
  const [sensorStatus, setSensorStatus] = useState<'idle' | 'active' | 'denied'>('idle');

  // Manual / Desktop simulation state
  const [isCalibratingManual, setIsCalibratingManual] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Smooth LERP animated values (60fps continuous unwrapped angles)
  const [smoothHeading, setSmoothHeading] = useState<number>(0);
  const [smoothPitch, setSmoothPitch] = useState<number>(0);
  const [smoothRoll, setSmoothRoll] = useState<number>(0);

  // References for animation loop
  const animFrameRef = useRef<number | null>(null);
  const currentAngleRef = useRef<number>(0);
  const targetAngleRef = useRef<number>(0);
  const pitchRef = useRef<number>(0);
  const rollRef = useRef<number>(0);
  const dialRef = useRef<HTMLDivElement | null>(null);
  const dragStartAngleRef = useRef<number>(0);
  const dragStartHeadingRef = useRef<number>(0);

  const qiblaBearing = calculateQiblaBearing(location.latitude, location.longitude);
  const kaabaDistanceKm = calculateKaabaDistance(location.latitude, location.longitude);

  // Angular difference between Kaaba bearing and current smoothed heading
  let diffAngle = (qiblaBearing - (smoothHeading % 360) + 360) % 360;
  if (diffAngle > 180) diffAngle -= 360;

  const isAligned = Math.abs(diffAngle) <= 3.5;
  const isLevel = Math.abs(smoothPitch) <= 12 && Math.abs(smoothRoll) <= 12;
  const prevAlignedRef = useRef(false);

  // Continuous angular LERP loop to eliminate 360° spin jumps and jitter
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // 1. Heading unwrap interpolation
      let deltaHeading = targetAngleRef.current - currentAngleRef.current;
      while (deltaHeading > 180) deltaHeading -= 360;
      while (deltaHeading < -180) deltaHeading += 360;

      // Damped gyroscopic interpolation (easing factor based on dt)
      const headingEasing = 1 - Math.exp(-12 * dt);
      currentAngleRef.current += deltaHeading * headingEasing;
      setSmoothHeading(currentAngleRef.current);

      // 2. Pitch & Roll smoothing
      const tiltEasing = 1 - Math.exp(-10 * dt);
      setSmoothPitch((prev) => prev + (pitchRef.current - prev) * tiltEasing);
      setSmoothRoll((prev) => prev + (rollRef.current - prev) * tiltEasing);

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Update target heading when sensor or manual rotation changes
  const updateTargetHeading = useCallback((newHeading: number) => {
    targetAngleRef.current = newHeading;
    setTargetHeading(newHeading);
  }, []);

  // Handle alignment haptic & audio lock cue
  useEffect(() => {
    if (isAligned && !prevAlignedRef.current) {
      soundManager.triggerVibration(45);
      if (soundEnabled) {
        soundManager.playQiblaLockChime();
      }
    }
    prevAlignedRef.current = isAligned;
  }, [isAligned, soundEnabled]);

  // Gyroscope / Device orientation sensor listener
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      let heading: number | null = null;

      // iOS WebKit compass heading (relative to magnetic north)
      if (
        'webkitCompassHeading' in e &&
        typeof (e as { webkitCompassHeading?: number }).webkitCompassHeading === 'number'
      ) {
        heading = (e as { webkitCompassHeading: number }).webkitCompassHeading;
      } else if (e.alpha !== null) {
        // Android standard orientation (alpha 0 - 360)
        heading = (360 - e.alpha) % 360;
      }

      if (heading !== null && !isNaN(heading)) {
        setHasSensor(true);
        setSensorStatus('active');
        if (!isCalibratingManual && !isDragging) {
          updateTargetHeading(Math.round(heading * 10) / 10);
        }
      }

      // Gyroscopic tilt
      if (e.beta !== null) {
        const clampedBeta = Math.max(-45, Math.min(45, e.beta));
        pitchRef.current = clampedBeta;
        setRawPitch(Math.round(clampedBeta));
      }
      if (e.gamma !== null) {
        const clampedGamma = Math.max(-45, Math.min(45, e.gamma));
        rollRef.current = clampedGamma;
        setRawRoll(Math.round(clampedGamma));
      }
    };

    if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    return () => {
      if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleOrientation, true);
      }
    };
  }, [isCalibratingManual, isDragging, updateTargetHeading]);

  // Request iOS 13+ sensor permissions
  const requestSensorPermission = async () => {
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof (
        DeviceOrientationEvent as unknown as {
          requestPermission?: () => Promise<string>;
        }
      ).requestPermission === 'function'
    ) {
      try {
        const response = await (
          DeviceOrientationEvent as unknown as {
            requestPermission: () => Promise<string>;
          }
        ).requestPermission();
        if (response === 'granted') {
          setSensorStatus('active');
          setHasSensor(true);
        } else {
          setSensorStatus('denied');
        }
      } catch {
        setSensorStatus('denied');
      }
    } else {
      setSensorStatus('active');
    }
  };

  // Interactive Desktop / Touch Mouse Parallax Tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (hasSensor) return; // Prioritize real phone gyro if active
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const calcRoll = (x / (rect.width / 2)) * 14;
    const calcPitch = -(y / (rect.height / 2)) * 14;
    rollRef.current = Math.round(calcRoll);
    pitchRef.current = Math.round(calcPitch);
  };

  const handleMouseLeave = () => {
    if (hasSensor) return;
    rollRef.current = 0;
    pitchRef.current = 0;
  };

  // Direct Drag-to-Rotate Touch & Mouse on Compass Bezel
  const getPointerAngle = (clientX: number, clientY: number) => {
    if (!dialRef.current) return 0;
    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rad = Math.atan2(clientY - centerY, clientX - centerX);
    let deg = (rad * 180) / Math.PI + 90;
    if (deg < 0) deg += 360;
    return deg;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setIsCalibratingManual(true);
    const startAngle = getPointerAngle(e.clientX, e.clientY);
    dragStartAngleRef.current = startAngle;
    dragStartHeadingRef.current = currentAngleRef.current;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const currentAngle = getPointerAngle(e.clientX, e.clientY);
    let delta = currentAngle - dragStartAngleRef.current;
    let newHeading = (dragStartHeadingRef.current - delta + 360) % 360;
    updateTargetHeading(Math.round(newHeading));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignored
    }
  };

  // Quick Action: Snap directly to Kaaba with spring animation
  const handleSnapToKaaba = () => {
    setIsCalibratingManual(true);
    updateTargetHeading(qiblaBearing);
  };

  // Subtle 3D perspective transform parameters
  const clamped3DPitch = Math.max(-20, Math.min(20, smoothPitch));
  const clamped3DRoll = Math.max(-20, Math.min(20, smoothRoll));

  // Circular dial normalized degrees (0 - 360)
  const normalizedDisplayDegree = ((Math.round(smoothHeading) % 360) + 360) % 360;

  // Generate 24 tick marks on the bezel
  const compassTicks = Array.from({ length: 24 }).map((_, i) => {
    const deg = i * 15;
    const isMajor = deg % 90 === 0;
    const isMedium = deg % 30 === 0;
    return { deg, isMajor, isMedium };
  });

  return (
    <div className="max-w-md mx-auto space-y-5 pb-12 text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-full bg-[#12312b] border border-emerald-800/60 text-emerald-200 hover:text-white transition-colors"
              title="Kembali"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
              <span>Qibla Compass</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </h2>
            <p className="text-[10px] text-emerald-300/60 font-medium">
              Sensor Giroskop & Kompas Falak
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-full border transition-colors ${
              soundEnabled
                ? 'bg-amber-400 text-slate-950 border-amber-400'
                : 'bg-[#12312b] text-emerald-300 border-emerald-800/60'
            }`}
            title="Toggle Efek Suara Kompas"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onOpenLocationModal}
            className="flex items-center gap-1.5 px-3 py-1 bg-[#12312b] hover:bg-[#183d35] text-emerald-200 rounded-full text-xs font-medium border border-emerald-800/60 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span className="truncate max-w-[110px]">{location.city}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Qibla Compass Card */}
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`rounded-3xl bg-[#0c251f] border p-6 sm:p-7 shadow-2xl relative overflow-hidden flex flex-col items-center justify-between min-h-[500px] transition-all duration-300 ${
          isAligned
            ? 'border-amber-400/90 shadow-[0_0_35px_rgba(245,158,11,0.22)] ring-1 ring-amber-400/40'
            : 'border-emerald-900/80'
        }`}
      >
        {/* Dynamic Specular Reflection Glare reacting to Pitch & Roll */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-60"
          style={{
            background: `radial-gradient(circle at ${50 + clamped3DRoll * 2}% ${
              50 - clamped3DPitch * 2
            }%, rgba(52, 211, 153, 0.12), transparent 70%)`,
          }}
        />

        {/* Alignment Status Pill with Magnetic Lock Aura */}
        <div className="relative z-10 w-full flex items-center justify-center">
          <div
            className={`py-2 px-4 rounded-full text-xs font-extrabold transition-all duration-300 flex items-center gap-2 select-none shadow-md ${
              isAligned
                ? 'bg-amber-400 text-slate-950 scale-105 shadow-amber-400/40'
                : 'bg-[#14352e] text-emerald-200 border border-emerald-800/60'
            }`}
          >
            {isAligned ? (
              <>
                <ShieldCheck className="w-4 h-4 text-slate-950 shrink-0" />
                <span className="tracking-wide">TEPAT MENGARAH KE KA'BAH</span>
                <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping shrink-0" />
              </>
            ) : (
              <>
                <RotateCw
                  className="w-3.5 h-3.5 text-amber-400 shrink-0 transition-transform duration-300"
                  style={{ transform: diffAngle > 0 ? 'rotate(90deg)' : 'rotate(-90deg)' }}
                />
                <span>
                  {diffAngle > 0
                    ? `Putar ke kanan ${Math.abs(Math.round(diffAngle))}°`
                    : `Putar ke kiri ${Math.abs(Math.round(diffAngle))}°`}
                </span>
              </>
            )}
          </div>
        </div>

        {/* 3D Gyroscopic Compass Rotating Dial */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 my-3 flex items-center justify-center select-none">
          {/* Alignment Glowing Ring Halo */}
          {isAligned && (
            <div className="absolute inset-0 rounded-full border-2 border-amber-400/50 animate-ping pointer-events-none" />
          )}

          {/* Compass Dial Rotating Base (with 3D perspective gyroscope tilt) */}
          <div
            ref={dialRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="absolute inset-0 rounded-full border-2 border-emerald-700/50 bg-gradient-to-b from-[#103028] via-[#0d2620] to-[#071914] shadow-2xl flex items-center justify-center cursor-grab active:cursor-grabbing touch-none"
            style={{
              transform: `perspective(900px) rotateX(${clamped3DPitch}deg) rotateY(${clamped3DRoll}deg)`,
              boxShadow: isAligned
                ? '0 0 40px rgba(245, 158, 11, 0.25), inset 0 0 25px rgba(245, 158, 11, 0.15)'
                : 'inset 0 0 20px rgba(0,0,0,0.6)',
            }}
          >
            {/* Smooth Rotating Internal Ring */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{
                transform: `rotate(${-smoothHeading}deg)`,
                willChange: 'transform',
              }}
            >
              {/* Radial tick marks */}
              {compassTicks.map((tick) => (
                <div
                  key={tick.deg}
                  className="absolute inset-0 flex items-start justify-center"
                  style={{ transform: `rotate(${tick.deg}deg)` }}
                >
                  <div
                    className={`rounded-full ${
                      tick.isMajor
                        ? 'w-1 h-3.5 bg-amber-400/90 mt-1'
                        : tick.isMedium
                        ? 'w-0.5 h-2.5 bg-emerald-400/60 mt-1'
                        : 'w-0.5 h-1.5 bg-emerald-700/50 mt-1'
                    }`}
                  />
                </div>
              ))}

              {/* Cardinal marks */}
              <span className="absolute top-4 font-black font-mono text-xs text-amber-400 drop-shadow">
                N
              </span>
              <span className="absolute bottom-4 font-bold font-mono text-[11px] text-emerald-400/70">
                S
              </span>
              <span className="absolute right-4 font-bold font-mono text-[11px] text-emerald-400/70">
                E
              </span>
              <span className="absolute left-4 font-bold font-mono text-[11px] text-emerald-400/70">
                W
              </span>

              {/* Radar circles */}
              <div className="absolute inset-10 rounded-full border border-dashed border-emerald-600/30" />
              <div className="absolute inset-20 rounded-full border border-emerald-600/20" />

              {/* Kaaba Direction Indicator Needle */}
              <div
                className="absolute inset-0 flex items-start justify-center transition-transform"
                style={{
                  transform: `rotate(${qiblaBearing}deg)`,
                }}
              >
                <div className="relative -top-3 flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-300 ${
                      isAligned
                        ? 'bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 scale-125 ring-4 ring-amber-400/40 shadow-amber-500/50'
                        : 'bg-emerald-950 text-amber-300 border border-emerald-500/80 shadow-emerald-950'
                    }`}
                  >
                    <span className="text-lg">🕋</span>
                  </div>

                  {/* Laser alignment ray */}
                  <div
                    className={`w-0.5 h-28 mt-1 transition-colors duration-200 ${
                      isAligned
                        ? 'bg-gradient-to-b from-amber-400 via-amber-300 to-transparent shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                        : 'bg-gradient-to-b from-emerald-400/70 via-emerald-600/40 to-transparent'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Spirit Level Bubble (Nivo Air) Reticle in Center */}
            <div className="absolute w-20 h-20 rounded-full border border-emerald-600/40 bg-[#081c17]/90 shadow-xl flex items-center justify-center pointer-events-none">
              {/* Target crosshair */}
              <div className="absolute w-full h-[1px] bg-emerald-700/30" />
              <div className="absolute h-full w-[1px] bg-emerald-700/30" />
              <div className="absolute w-7 h-7 rounded-full border border-emerald-500/40" />

              {/* Floating Air Bubble responding to Pitch & Roll */}
              <div
                className={`w-4 h-4 rounded-full transition-all duration-75 shadow-md flex items-center justify-center ${
                  isLevel
                    ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]'
                    : 'bg-amber-400/80'
                }`}
                style={{
                  transform: `translate(${clamped3DRoll * 1.3}px, ${-clamped3DPitch * 1.3}px)`,
                }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
              </div>
            </div>
          </div>

          {/* Top Target Needle Pointer */}
          <div className="absolute -top-3 z-20 flex flex-col items-center pointer-events-none">
            <div
              className={`w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] transition-colors duration-200 ${
                isAligned ? 'border-t-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]' : 'border-t-white'
              }`}
            />
          </div>
        </div>

        {/* Spirit Level & Gyro Status Indicator */}
        <div className="flex items-center justify-center gap-2 pt-1 text-center">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold transition-colors ${
              isLevel
                ? 'bg-emerald-900/60 text-emerald-200 border border-emerald-700/60'
                : 'bg-amber-950/60 text-amber-200 border border-amber-800/60'
            }`}
          >
            <Gauge className="w-3 h-3 text-amber-400" />
            <span>
              {isLevel
                ? 'Ponsel Mendatar (Akurasi Tinggi)'
                : 'Posisikan ponsel lebih mendatar'}
            </span>
          </span>
        </div>

        {/* Guidance Prompt */}
        <p className="text-center text-xs text-emerald-200/80 font-medium px-4 mt-2">
          {hasSensor
            ? 'Putar ponsel Anda hingga ikon Ka’bah tepat di tengah jarum emas.'
            : 'Geser dial kompas atau gunakan sensor HP untuk mencari arah Ka’bah.'}
        </p>

        {/* Big Degree Telemetry Readout with Gyro Indicator */}
        <div className="text-center my-2">
          <div className="flex items-baseline justify-center gap-1">
            <span
              className={`text-4xl sm:text-5xl font-black font-mono tracking-wider transition-colors duration-200 ${
                isAligned ? 'text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]' : 'text-white'
              }`}
            >
              {normalizedDisplayDegree}°
            </span>
            <span className="text-xs text-emerald-300 font-mono font-semibold">
              HDG
            </span>
          </div>

          <div className="flex items-center justify-center gap-3 text-xs text-emerald-300/80 mt-1">
            <span>Arah Ka’bah: <strong className="text-amber-400 font-mono">{qiblaBearing}°</strong></span>
            <span>·</span>
            <span>{getCardinalDirection(qiblaBearing)}</span>
          </div>
        </div>

        {/* Sensor Readings Bar: Pitch, Roll & Telemetry */}
        <div className="w-full flex items-center justify-between pt-3 border-t border-emerald-900/50 text-[11px] font-mono text-emerald-300/70">
          <span>Pitch: {Math.round(smoothPitch)}°</span>
          <span className="flex items-center gap-1">
            <Move className="w-3 h-3 text-amber-400" />
            <span className="text-[10px]">Tarik Dial untuk Putar</span>
          </span>
          <span>Roll: {Math.round(smoothRoll)}°</span>
        </div>
      </div>

      {/* Interactive Controls & Sensor Calibration Card */}
      <div className="rounded-3xl bg-[#0c251f] border border-emerald-900/80 p-5 space-y-3.5 shadow-md">
        {/* Kaaba Distance */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-emerald-300/80 font-medium">Jarak ke Masjidil Haram:</span>
          <strong className="text-amber-400 font-bold font-mono text-sm">
            {kaabaDistanceKm.toLocaleString('id-ID')} km
          </strong>
        </div>

        {/* Quick Simulator Buttons */}
        <div className="pt-2 border-t border-emerald-900/50 space-y-2">
          <span className="text-[11px] font-bold text-emerald-300/80 uppercase tracking-wider block">
            Uji Coba & Kalibrasi Kompas:
          </span>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleSnapToKaaba}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors shadow-sm active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Kunci Arah Ka'bah</span>
            </button>

            <button
              onClick={() => {
                setIsCalibratingManual(true);
                updateTargetHeading((targetHeading + 45) % 360);
              }}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#14352e] hover:bg-[#1a443a] text-emerald-200 hover:text-white font-semibold text-xs border border-emerald-800/60 transition-colors active:scale-95"
            >
              <RotateCw className="w-3.5 h-3.5 text-amber-400" />
              <span>Putar +45°</span>
            </button>
          </div>
        </div>

        {/* Mobile Device Orientation Sensor Request */}
        {!hasSensor && sensorStatus !== 'active' && (
          <button
            onClick={requestSensorPermission}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-98"
          >
            <Smartphone className="w-4 h-4 text-amber-300" />
            <span>Aktifkan Sensor Giroskop HP (Arah Real-time)</span>
          </button>
        )}

        {hasSensor && (
          <div className="flex items-center justify-between text-[11px] text-emerald-300/70 pt-1">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Sensor giroskop perangkat aktif
            </span>
            <button
              onClick={() => {
                setIsCalibratingManual(false);
              }}
              className="text-amber-400 hover:underline font-semibold"
            >
              Reset ke Sensor HP
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
