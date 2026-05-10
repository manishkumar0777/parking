'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import BookingModal from './BookingModal';
import AdminSlotModal from './AdminSlotModal';
import { Search, XCircle } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, ContactShadows, useCursor, Environment, Grid, Sparkles } from '@react-three/drei';
import { useSpring, a } from '@react-spring/three';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

interface Slot {
  id: string;
  slotId: string;
  status: 'vacant' | 'occupied' | 'booked';
  location?: string;
  lastUpdated: string;
}

interface ParkingDashboardProps {
  onBookSlot?: (slotId: string) => void;
  isAdmin?: boolean;
}

// Highly Detailed & Glossy Car Model
const CarModel = ({ color, ...props }: any) => {
  return (
    <group {...props}>
      {/* Glossy Body */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.6, 3.8]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.7}
          roughness={0.1}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
        />
      </mesh>
      {/* Dark Glass Cabin */}
      <mesh position={[0, 0.9, -0.2]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.5, 2]} />
        <meshPhysicalMaterial color="#050505" metalness={0.9} roughness={0.05} transmission={0.2} />
      </mesh>
      {/* Wheels */}
      <mesh position={[-0.9, 0.3, 1.2]} castShadow rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 32]} />
        <meshStandardMaterial color="#111111" roughness={0.8} />
      </mesh>
      <mesh position={[0.9, 0.3, 1.2]} castShadow rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 32]} />
        <meshStandardMaterial color="#111111" roughness={0.8} />
      </mesh>
      <mesh position={[-0.9, 0.3, -1.2]} castShadow rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 32]} />
        <meshStandardMaterial color="#111111" roughness={0.8} />
      </mesh>
      <mesh position={[0.9, 0.3, -1.2]} castShadow rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 32]} />
        <meshStandardMaterial color="#111111" roughness={0.8} />
      </mesh>
      {/* Glowing Headlights */}
      <mesh position={[-0.6, 0.5, 1.9]} castShadow>
        <boxGeometry args={[0.4, 0.15, 0.1]} />
        <meshStandardMaterial color="#e0f2fe" emissive="#e0f2fe" emissiveIntensity={5} toneMapped={false} />
      </mesh>
      <mesh position={[0.6, 0.5, 1.9]} castShadow>
        <boxGeometry args={[0.4, 0.15, 0.1]} />
        <meshStandardMaterial color="#e0f2fe" emissive="#e0f2fe" emissiveIntensity={5} toneMapped={false} />
      </mesh>
      {/* Glowing Taillights */}
      <mesh position={[-0.6, 0.5, -1.9]} castShadow>
        <boxGeometry args={[0.4, 0.15, 0.1]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={4} toneMapped={false} />
      </mesh>
      <mesh position={[0.6, 0.5, -1.9]} castShadow>
        <boxGeometry args={[0.4, 0.15, 0.1]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={4} toneMapped={false} />
      </mesh>
    </group>
  );
};

// Animated & Glowing Parking Slot Component
const ParkingSlot3D = ({ position, slot, onClick, color, isVisible }: any) => {
  const isOccupied = slot.status === 'occupied' || slot.status === 'booked';
  const isVacant = slot.status === 'vacant';
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  // Spring animation for car driving in and out
  const { carPosition, carScale } = useSpring({
    carPosition: isOccupied ? [0, 0, 0] : [0, 0, 10],
    carScale: isOccupied ? 1 : 0.001,
    config: { mass: 1, tension: 100, friction: 15 }
  });

  const getSlotColor = () => {
    if (slot.status === 'vacant') return '#22c55e'; // Green
    if (slot.status === 'booked') return '#eab308'; // Yellow
    return '#ef4444'; // Red
  };

  const slotColor = getSlotColor();
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  // Pulse effect for vacant slots
  useFrame((state) => {
    if (materialRef.current && isVacant && !hovered) {
      materialRef.current.opacity = 0.1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
    } else if (materialRef.current) {
      materialRef.current.opacity = hovered ? 0.4 : 0.15;
    }
  });

  if (!isVisible) return null;

  return (
    <group position={position}>
      {/* Floor Area */}
      <mesh
        position={[0, 0.05, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={(e) => { e.stopPropagation(); onClick(slot); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
      >
        <planeGeometry args={[2.8, 5.5]} />
        <meshStandardMaterial
          ref={materialRef}
          color={hovered ? '#ffffff' : slotColor}
          transparent
          depthWrite={false}
        />
      </mesh>

      {/* Neon Glowing Border */}
      <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.35, 1.4, 4, 1, Math.PI / 4]} />
        <meshBasicMaterial
          color={slotColor}
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Floating Particles for Vacant Slots */}
      {isVacant && (
        <Sparkles
          count={30}
          scale={[2.5, 2, 5]}
          size={4}
          speed={0.4}
          opacity={0.5}
          color={slotColor}
          position={[0, 1, 0]}
        />
      )}

      {/* Futuristic 3D Text Label */}
      <Text
        position={[0, 0.05, -1.8]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.6}
        color={slotColor}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#000000"
      >
        {slot.slotId}
      </Text>

      {/* The Car */}
      <a.group position={carPosition as any} scale={carScale as any}>
        <CarModel color={color} rotation={[0, Math.PI, 0]} />
      </a.group>
    </group>
  );
};

// High-Tech Scene Setup
const ParkingLotScene = ({ slots, onSlotClick, isAdmin, filteredSlots }: any) => {
  // Vibrant metallic colors
  const carColors = useMemo(() => {
    const colors = ['#3b82f6', '#ef4444', '#eab308', '#a855f7', '#ec4899', '#f97316', '#14b8a6', '#ffffff', '#silver'];
    const map: Record<string, string> = {};
    slots.forEach((slot: Slot) => {
      let hash = 0;
      for (let i = 0; i < slot.slotId.length; i++) {
        hash = slot.slotId.charCodeAt(i) + ((hash << 5) - hash);
      }
      map[slot.slotId] = colors[Math.abs(hash) % colors.length];
    });
    return map;
  }, [slots]);

  const getSlotPosition = (index: number): [number, number, number] => {
    const cols = 5;
    const row = Math.floor(index / cols);
    const col = index % cols;
    const spacingX = 3.5;
    const spacingZ = 8;
    const startX = -((cols - 1) * spacingX) / 2;
    return [startX + col * spacingX, 0, (row * spacingZ) - (spacingZ / 2)];
  };

  return (
    <group>
      {/* High-tech Grid Floor */}
      <Grid
        position={[0, 0, 0]}
        args={[100, 100]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#1e293b"
        sectionSize={3.5}
        sectionThickness={1}
        sectionColor="#334155"
        fadeDistance={40}
        fadeStrength={1}
      />

      {/* Dark Asphalt base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.1, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#020617" roughness={0.8} />
      </mesh>

      {slots.map((slot: Slot, index: number) => (
        <ParkingSlot3D
          key={slot.id}
          position={getSlotPosition(index)}
          slot={slot}
          onClick={onSlotClick}
          color={carColors[slot.slotId] || '#ffffff'}
          isVisible={filteredSlots.some((fs: Slot) => fs.id === slot.id)}
        />
      ))}

      {/* Contact Shadows for realism */}
      <ContactShadows resolution={1024} scale={50} blur={2.5} opacity={0.7} far={10} color="#000000" />

      {/* Post Processing for Cinematic Feel */}
      <EffectComposer disableNormalPass multisampling={4}>
        <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </group>
  );
};

const ParkingDashboard: React.FC<ParkingDashboardProps> = ({ onBookSlot, isAdmin = false }) => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [filteredSlots, setFilteredSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'vacant' | 'occupied' | 'booked'>('all');

  useEffect(() => {
    fetchSlots();
    const interval = setInterval(() => { fetchSlots(true); }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let result = slots;
    if (searchTerm) {
      result = result.filter(slot =>
        slot.slotId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        slot.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterStatus !== 'all') {
      result = result.filter(slot => slot.status === filterStatus);
    }
    setFilteredSlots(result);
  }, [slots, searchTerm, filterStatus]);

  const fetchSlots = async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);
      const response = await fetch('/api/slots');
      const data = await response.json();
      if (response.ok) {
        setSlots(data.slots);
      } else {
        setError(data.error || 'Failed to fetch slots');
      }
    } catch (err) {
      setError('Failed to load slots');
      console.error('Error fetching slots:', err);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  const handleSlotClick = (slot: Slot) => {
    setSelectedSlot(slot.slotId);
    if (slot.status === 'vacant') {
      setIsBookingModalOpen(true);
    } else if (isAdmin) {
      setIsAdminModalOpen(true);
    }
  };

  const handleBooking = async (bookingData: any) => {
    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Booking successful!');
        fetchSlots();
      } else {
        alert(data.error || 'Booking failed');
      }
    } catch (err) {
      console.error('Booking error:', err);
      alert('Booking failed. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in flex flex-col h-[calc(100vh-100px)] min-h-[600px]">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {isAdmin ? 'Admin 3D Overview' : 'Live 3D Parking Status'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isAdmin ? 'Manage slots and view booking details' : 'Real-time 3D availability updates'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search details..."
              className="pl-9 pr-4 py-2 rounded-lg bg-card border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none w-full sm:w-64 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 p-1 bg-muted rounded-lg border border-border">
            {(['all', 'vacant', 'occupied', 'booked'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${filterStatus === status
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                  }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 w-full bg-card/30 rounded-2xl border-2 border-border overflow-hidden relative shadow-xl">
        {loading ? (
          <div className="absolute inset-0 flex justify-center items-center bg-background/50 backdrop-blur-sm z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex justify-center items-center text-destructive bg-destructive/10 z-10">
            <p className="flex items-center gap-2 font-medium">
              <XCircle className="h-5 w-5" />
              {error}
            </p>
          </div>
        ) : null}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-10 flex gap-4 bg-background/80 backdrop-blur-md p-3 rounded-xl border border-border shadow-lg">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div><span className="text-sm font-medium">Vacant (Click to book)</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-500"></div><span className="text-sm font-medium">Booked</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div><span className="text-sm font-medium">Occupied</span></div>
        </div>

        {/* Interactive instructions */}
        <div className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-border shadow-md pointer-events-none hidden md:block">
          <span className="text-xs font-medium text-muted-foreground">Drag to rotate • Scroll to zoom</span>
        </div>

        <Canvas shadows camera={{ position: [0, 15, 20], fov: 45 }}>
          <color attach="background" args={['#0f172a']} />
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[10, 20, 10]}
            intensity={1.5}
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          <Environment preset="city" />

          <ParkingLotScene
            slots={slots}
            filteredSlots={filteredSlots}
            onSlotClick={handleSlotClick}
            isAdmin={isAdmin}
          />

          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            autoRotate={false}
            maxPolarAngle={Math.PI / 2 - 0.1}
            minDistance={5}
            maxDistance={50}
          />
        </Canvas>
      </div>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        slotId={selectedSlot || ''}
        onBook={handleBooking}
      />

      <AdminSlotModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        slotId={selectedSlot || ''}
      />
    </div>
  );
};

export default ParkingDashboard;