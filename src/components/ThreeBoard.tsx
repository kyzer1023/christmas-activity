import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import type { Tile, TileType } from '../types/game';
import { BOARD_SIZE } from '../utils/gameUtils';

const BOARD_INNER_RADIUS = 5;
const BOARD_OUTER_RADIUS = 7.5;
const BOARD_THICKNESS = 0.5;
const ANGLE_GAP = 0.05; // Gap between tiles in radians

// Colors for tile types with neon glow support
const TILE_COLORS: Record<TileType, string> = {
    random: '#FFD700', // Gold
    queue_draw: '#ef4444', // Red (visually appears as red, triggers queue draw)
    skip: '#3b82f6', // Blue (visually appears as blue, triggers skip)
    reroll: '#22c55e', // Green
};

// --- Custom Geometry for Arcs ---
const createArcShape = (
    innerRadius: number,
    outerRadius: number,
    startAngle: number,
    endAngle: number
) => {
    const shape = new THREE.Shape();

    // Draw arc segment
    shape.absarc(0, 0, innerRadius, startAngle, endAngle, false);
    shape.absarc(0, 0, outerRadius, endAngle, startAngle, true); // Go back in reverse

    return shape;
};

const ArcTile = ({ tile, totalTiles }: { tile: Tile; isTarget: boolean; totalTiles: number }) => {
    // Note: isTarget prop removed from usage to prevent animation, but kept in signature if needed later or passed
    // Actually, let's keep it in signature but ignore it effectively for animation.

    const segments = totalTiles;
    const anglePerSegment = (Math.PI * 2) / segments;

    // Calculate precise start/end angles for this segment
    // Let's standardise: Index 0 at -90deg (bottom)
    const baseAngle = (tile.index / segments) * Math.PI * 2 - Math.PI / 2;

    const halfAngle = (anglePerSegment - ANGLE_GAP) / 2;

    const shape = useMemo(() =>
        createArcShape(BOARD_INNER_RADIUS, BOARD_OUTER_RADIUS, -halfAngle, halfAngle),
        []);

    const extrudeSettings = useMemo(() => ({
        depth: BOARD_THICKNESS,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.1,
        bevelSegments: 2
    }), []);

    const color = TILE_COLORS[tile.type];

    // NO useFrame animation here anymore as per user request.

    return (
        <group
            rotation={[-Math.PI / 2, 0, baseAngle]} // Rotate flat on X, then around Z
        >
            {/* Main Tile Body - Premium Glassmorphism */}
            <mesh position={[0, 0, 0]}>
                <extrudeGeometry args={[shape, extrudeSettings]} />
                <meshPhysicalMaterial
                    color={color}
                    transparent
                    opacity={0.6} // Semi-transparent body
                    roughness={0.2} // Smooth glass
                    metalness={0.1}
                    transmission={0.6} // Key for glass look
                    thickness={0.5} // Refraction volume
                    ior={1.5}
                    clearcoat={1} // Shiny coating
                    clearcoatRoughness={0.1}
                    attenuationColor={color} // Deep internal color
                    attenuationDistance={1}
                />
            </mesh>

            {/* Neon Glow Rim (Stronger, thicker outline) */}
            <mesh position={[0, 0, -0.02]}>
                <extrudeGeometry args={[shape, { ...extrudeSettings, depth: BOARD_THICKNESS + 0.04, bevelSize: 0.2 }]} />
                <meshBasicMaterial color={color} toneMapped={false} />
            </mesh>

            {/* Inner "Frost" / Gradient simulation (Bottom Layer) */}
            <mesh position={[0, 0, 0.01]}>
                <extrudeGeometry args={[shape, { ...extrudeSettings, depth: 0.1, bevelSize: 0 }]} />
                <meshBasicMaterial color={color} opacity={0.3} transparent />
            </mesh>

            {/* Top Surface Specular Highlight (Rim Light) */}
            <mesh position={[0, 0, BOARD_THICKNESS - 0.02]}>
                <extrudeGeometry args={[shape, { ...extrudeSettings, depth: 0.05, bevelSize: 0.05 }]} />
                <meshBasicMaterial color="white" opacity={0.4} transparent blending={THREE.AdditiveBlending} />
            </mesh>
        </group>
    );
};

const PlayerToken = ({ positionIndex }: { positionIndex: number }) => {
    const group = useRef<THREE.Group>(null);

    // Recalculate position based on new geometry logic
    const radius = (BOARD_INNER_RADIUS + BOARD_OUTER_RADIUS) / 2;
    const angle = (positionIndex / BOARD_SIZE) * 2 * Math.PI - Math.PI / 2;

    const targetPos = useMemo(() => new THREE.Vector3(
        radius * Math.cos(angle),
        BOARD_THICKNESS + 0.5, // Sit on top
        radius * Math.sin(angle)
    ), [positionIndex, radius, angle]);

    // Smooth movement
    useFrame((_, delta) => {
        if (group.current) {
            group.current.position.lerp(targetPos, delta * 3);
            // Bob
            group.current.rotation.y += delta * 0.5;
        }
    });

    return (
        <group ref={group} position={targetPos}>
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2} floatingRange={[0, 0.2]}>
                {/* Detailed Snow Globe */}
                {/* Glass */}
                <mesh position={[0, 0.6, 0]}>
                    <sphereGeometry args={[0.7, 32, 32]} />
                    <meshPhysicalMaterial
                        color="white"
                        transmission={0.9}
                        opacity={1}
                        roughness={0}
                        ior={1.5}
                        thickness={0.05}
                    />
                </mesh>

                {/* Base */}
                <mesh position={[0, 0, 0]}>
                    <cylinderGeometry args={[0.6, 0.7, 0.3, 32]} />
                    <meshStandardMaterial color="#b8860b" metalness={0.8} roughness={0.3} />
                </mesh>
            </Float>

            {/* Shadow Blob */}
            <mesh position={[0, -0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.6, 32]} />
                <meshBasicMaterial color="black" opacity={0.4} transparent />
            </mesh>
        </group>
    );
};

interface ThreeBoardProps {
    board: Tile[];
    tokenPosition: number;
}

const ThreeBoard: React.FC<ThreeBoardProps> = ({ board, tokenPosition }) => {
    return (
        <group rotation={[-Math.PI / 12, 0, 0]}> {/* Slight tilt to entire board for better view */}
            {/* Central Glow/Decor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
                <ringGeometry args={[0, BOARD_INNER_RADIUS - 0.2, 64]} />
                <meshBasicMaterial color="#000" opacity={0.5} transparent />
            </mesh>

            {/* Text in Center */}
            <Text
                position={[0, 0, 0]}
                rotation={[-Math.PI / 2, 0, 0]} // Lay flat
                fontSize={1}
                color="#FFD700"
                font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
                anchorX="center"
                anchorY="middle"
            >
                CHRISTMAS
            </Text>

            {board.map((tile) => (
                <ArcTile
                    key={tile.id}
                    tile={tile}
                    isTarget={tile.index === tokenPosition}
                    totalTiles={BOARD_SIZE}
                />
            ))}

            {/* Player Token Layer */}
            <PlayerToken positionIndex={tokenPosition} />
        </group>
    );
};

export default ThreeBoard;
