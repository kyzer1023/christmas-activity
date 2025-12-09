import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, Line } from '@react-three/drei';
import * as THREE from 'three';
import type { Tile, TileType } from '../types/game';
import { BOARD_SIZE } from '../utils/gameUtils';

const BOARD_INNER_RADIUS = 5;
const BOARD_OUTER_RADIUS = 7.5;
const BOARD_THICKNESS = 0.4;
const ANGLE_GAP = 0.06;

// Dark base colors for tile bodies
const TILE_BASE_COLORS: Record<TileType, string> = {
    random: '#1a1508',      // Dark gold/brown
    queue_draw: '#0a0a18',  // Dark red (queue_draw = RED)
    skip: '#180808',        // Dark blue (skip = BLUE)
    reroll: '#081208',      // Dark green
};

// Bright neon glow colors for edges
const TILE_GLOW_COLORS: Record<TileType, string> = {
    random: '#ffd700',      // Gold
    queue_draw: '#ff4444',  // Red (queue_draw = RED)
    skip: '#00bfff',        // Cyan blue (skip = BLUE)
    reroll: '#00ff88',      // Green
};

// Create arc shape for the tile body
const createArcShape = (
    innerRadius: number,
    outerRadius: number,
    startAngle: number,
    endAngle: number
) => {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, innerRadius, startAngle, endAngle, false);
    shape.absarc(0, 0, outerRadius, endAngle, startAngle, true);
    return shape;
};

// Generate points for the outline path (for Line component)
const createOutlinePoints = (
    innerRadius: number,
    outerRadius: number,
    startAngle: number,
    endAngle: number,
    segments: number = 16
): THREE.Vector3[] => {
    const points: THREE.Vector3[] = [];
    
    // Inner arc (from start to end)
    for (let i = 0; i <= segments; i++) {
        const angle = startAngle + (endAngle - startAngle) * (i / segments);
        points.push(new THREE.Vector3(
            innerRadius * Math.cos(angle),
            innerRadius * Math.sin(angle),
            0
        ));
    }
    
    // Right edge (from inner to outer at endAngle)
    points.push(new THREE.Vector3(
        outerRadius * Math.cos(endAngle),
        outerRadius * Math.sin(endAngle),
        0
    ));
    
    // Outer arc (from end to start)
    for (let i = segments; i >= 0; i--) {
        const angle = startAngle + (endAngle - startAngle) * (i / segments);
        points.push(new THREE.Vector3(
            outerRadius * Math.cos(angle),
            outerRadius * Math.sin(angle),
            0
        ));
    }
    
    // Left edge (from outer to inner at startAngle) - close the loop
    points.push(new THREE.Vector3(
        innerRadius * Math.cos(startAngle),
        innerRadius * Math.sin(startAngle),
        0
    ));
    
    return points;
};

const ArcTile = ({ tile, totalTiles }: { tile: Tile; isTarget: boolean; totalTiles: number }) => {
    const segments = totalTiles;
    const anglePerSegment = (Math.PI * 2) / segments;
    const baseAngle = (tile.index / segments) * Math.PI * 2 - Math.PI / 2;
    const halfAngle = (anglePerSegment - ANGLE_GAP) / 2;

    const baseColor = TILE_BASE_COLORS[tile.type];
    const glowColor = TILE_GLOW_COLORS[tile.type];

    const shape = useMemo(() =>
        createArcShape(BOARD_INNER_RADIUS, BOARD_OUTER_RADIUS, -halfAngle, halfAngle),
        [halfAngle]);

    const outlinePoints = useMemo(() =>
        createOutlinePoints(BOARD_INNER_RADIUS, BOARD_OUTER_RADIUS, -halfAngle, halfAngle, 24),
        [halfAngle]);

    const extrudeSettings = useMemo(() => ({
        depth: BOARD_THICKNESS,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.02,
        bevelSegments: 1
    }), []);

    return (
        <group rotation={[-Math.PI / 2, 0, baseAngle]}>
            {/* Outer glow bloom (largest, most diffuse) */}
            <mesh position={[0, 0, -0.03]}>
                <extrudeGeometry args={[shape, { depth: BOARD_THICKNESS + 0.06, bevelEnabled: false }]} />
                <meshBasicMaterial
                    color={glowColor}
                    transparent
                    opacity={0.12}
                    toneMapped={false}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Dark Base Tile Body */}
            <mesh position={[0, 0, 0]}>
                <extrudeGeometry args={[shape, extrudeSettings]} />
                <meshStandardMaterial
                    color={baseColor}
                    roughness={0.85}
                    metalness={0.15}
                    emissive={glowColor}
                    emissiveIntensity={0.03}
                />
            </mesh>

            {/* Inner color wash */}
            <mesh position={[0, 0, 0.02]}>
                <extrudeGeometry args={[shape, { depth: BOARD_THICKNESS - 0.04, bevelEnabled: false }]} />
                <meshBasicMaterial
                    color={glowColor}
                    transparent
                    opacity={0.1}
                />
            </mesh>

            {/* Primary neon edge - bottom */}
            <group position={[0, 0, 0.02]}>
                <Line
                    points={outlinePoints}
                    color={glowColor}
                    lineWidth={4}
                    toneMapped={false}
                />
            </group>

            {/* Primary neon edge - top */}
            <group position={[0, 0, BOARD_THICKNESS]}>
                <Line
                    points={outlinePoints}
                    color={glowColor}
                    lineWidth={4}
                    toneMapped={false}
                />
            </group>

            {/* Extra glow line layer for bloom effect */}
            <group position={[0, 0, BOARD_THICKNESS / 2]}>
                <Line
                    points={outlinePoints}
                    color={glowColor}
                    lineWidth={6}
                    transparent
                    opacity={0.4}
                    toneMapped={false}
                />
            </group>
        </group>
    );
};

const PlayerToken = ({ positionIndex }: { positionIndex: number }) => {
    const group = useRef<THREE.Group>(null);

    const radius = (BOARD_INNER_RADIUS + BOARD_OUTER_RADIUS) / 2;
    const angle = (positionIndex / BOARD_SIZE) * 2 * Math.PI - Math.PI / 2;

    const targetPos = useMemo(() => new THREE.Vector3(
        radius * Math.cos(angle),
        BOARD_THICKNESS + 0.6,
        radius * Math.sin(angle)
    ), [positionIndex, radius, angle]);

    useFrame((_, delta) => {
        if (group.current) {
            group.current.position.lerp(targetPos, delta * 3);
            group.current.rotation.y += delta * 0.5;
        }
    });

    return (
        <group ref={group} position={targetPos}>
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3} floatingRange={[0, 0.15]}>
                {/* Snow Globe Glass Dome */}
                <mesh position={[0, 0.55, 0]}>
                    <sphereGeometry args={[0.6, 32, 32]} />
                    <meshPhysicalMaterial
                        color="#a8d8ff"
                        transmission={0.92}
                        opacity={1}
                        roughness={0.05}
                        ior={1.45}
                        thickness={0.08}
                        clearcoat={1}
                        clearcoatRoughness={0}
                    />
                </mesh>

                {/* Inner glow */}
                <pointLight position={[0, 0.5, 0]} intensity={0.5} color="#ffffff" distance={2} />

                {/* Ornate Gold Base */}
                <mesh position={[0, 0, 0]}>
                    <cylinderGeometry args={[0.5, 0.58, 0.25, 32]} />
                    <meshStandardMaterial 
                        color="#8b6914" 
                        metalness={0.9} 
                        roughness={0.2}
                        emissive="#3a2a00"
                        emissiveIntensity={0.3}
                    />
                </mesh>

                {/* Base ring detail */}
                <mesh position={[0, 0.12, 0]}>
                    <torusGeometry args={[0.48, 0.03, 16, 32]} />
                    <meshStandardMaterial color="#ffd700" metalness={1} roughness={0.1} />
                </mesh>
            </Float>

            {/* Soft shadow */}
            <mesh position={[0, -0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.7, 32]} />
                <meshBasicMaterial color="#000" opacity={0.5} transparent />
            </mesh>
        </group>
    );
};

interface ThreeBoardProps {
    board: Tile[];
    tokenPosition: number;
}

const ThreeBoard: React.FC<ThreeBoardProps> = ({ board, tokenPosition }) => {
    const centerGlowRef = useRef<THREE.Mesh>(null);
    
    // Subtle pulsing animation for center glow
    useFrame((state) => {
        if (centerGlowRef.current) {
            const material = centerGlowRef.current.material as THREE.MeshBasicMaterial;
            material.opacity = 0.15 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
        }
    });

    return (
        <group rotation={[-Math.PI / 12, 0, 0]}>
            {/* Deep center void */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, 0]}>
                <circleGeometry args={[BOARD_INNER_RADIUS - 0.3, 64]} />
                <meshBasicMaterial color="#000000" />
            </mesh>

            {/* Subtle radial gradient glow in center */}
            <mesh ref={centerGlowRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.12, 0]}>
                <ringGeometry args={[0, BOARD_INNER_RADIUS - 0.4, 64]} />
                <meshBasicMaterial 
                    color="#1a1a3a" 
                    transparent 
                    opacity={0.2}
                />
            </mesh>

            {/* Inner ring glow */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]}>
                <ringGeometry args={[BOARD_INNER_RADIUS - 0.5, BOARD_INNER_RADIUS - 0.2, 64]} />
                <meshBasicMaterial 
                    color="#ffd700" 
                    transparent 
                    opacity={0.08}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Center Text - CHRISTMAS */}
            <Text
                position={[0, 0.02, 0.3]}
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={1.1}
                color="#ffd700"
                anchorX="center"
                anchorY="middle"
                letterSpacing={0.12}
            >
                CHRISTMAS
            </Text>

            {/* Text glow effect */}
            <Text
                position={[0, 0.01, 0.3]}
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={1.15}
                color="#ffd700"
                anchorX="center"
                anchorY="middle"
                letterSpacing={0.12}
                fillOpacity={0.3}
            >
                CHRISTMAS
            </Text>

            {/* Board Tiles */}
            {board.map((tile) => (
                <ArcTile
                    key={tile.id}
                    tile={tile}
                    isTarget={tile.index === tokenPosition}
                    totalTiles={BOARD_SIZE}
                />
            ))}

            {/* Player Token */}
            <PlayerToken positionIndex={tokenPosition} />
        </group>
    );
};

export default ThreeBoard;
