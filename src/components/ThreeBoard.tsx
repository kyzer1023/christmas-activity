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

// Mini Christmas Tree inside the globe
const MiniChristmasTree: React.FC = () => {
    return (
        <group position={[-0.25, 0.22, 0]} scale={1.5}>
            {/* Tree trunk */}
            <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[0.06, 0.08, 0.2, 8]} />
                <meshStandardMaterial color="#5d3a1a" roughness={0.9} />
            </mesh>
            
            {/* Tree layers (bottom to top) */}
            <mesh position={[0, 0.22, 0]}>
                <coneGeometry args={[0.35, 0.35, 8]} />
                <meshStandardMaterial 
                    color="#0d5c0d" 
                    roughness={0.8}
                    emissive="#003300"
                    emissiveIntensity={0.2}
                />
            </mesh>
            <mesh position={[0, 0.42, 0]}>
                <coneGeometry args={[0.28, 0.3, 8]} />
                <meshStandardMaterial 
                    color="#0a6b0a" 
                    roughness={0.8}
                    emissive="#004400"
                    emissiveIntensity={0.2}
                />
            </mesh>
            <mesh position={[0, 0.58, 0]}>
                <coneGeometry args={[0.2, 0.25, 8]} />
                <meshStandardMaterial 
                    color="#0b7a0b" 
                    roughness={0.8}
                    emissive="#005500"
                    emissiveIntensity={0.2}
                />
            </mesh>
            
            {/* Star on top */}
            <mesh position={[0, 0.75, 0]} rotation={[0, Math.PI / 4, 0]}>
                <octahedronGeometry args={[0.08, 0]} />
                <meshBasicMaterial 
                    color="#ffd700"
                    toneMapped={false}
                />
            </mesh>
            
            {/* Ornaments - colorful balls */}
            {[
                { pos: [0.15, 0.25, 0.15], color: '#ff0000' },
                { pos: [-0.12, 0.3, 0.12], color: '#ffd700' },
                { pos: [0.1, 0.45, -0.1], color: '#00bfff' },
                { pos: [-0.08, 0.5, 0.08], color: '#ff00ff' },
                { pos: [0.05, 0.6, 0.05], color: '#ff0000' },
            ].map((ornament, i) => (
                <mesh key={i} position={ornament.pos as [number, number, number]}>
                    <sphereGeometry args={[0.035, 8, 8]} />
                    <meshBasicMaterial 
                        color={ornament.color}
                        toneMapped={false}
                    />
                </mesh>
            ))}
        </group>
    );
};

// Mini Snowman next to the tree
const MiniSnowman: React.FC = () => {
    return (
        <group position={[0.45, 0.22, 0.15]} scale={1.4}>
            {/* Bottom ball */}
            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.18, 16, 16]} />
                <meshStandardMaterial color="#f0f8ff" roughness={0.3} />
            </mesh>
            
            {/* Middle ball */}
            <mesh position={[0, 0.22, 0]}>
                <sphereGeometry args={[0.14, 16, 16]} />
                <meshStandardMaterial color="#f5fffa" roughness={0.3} />
            </mesh>
            
            {/* Head */}
            <mesh position={[0, 0.4, 0]}>
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshStandardMaterial color="#ffffff" roughness={0.2} />
            </mesh>
            
            {/* Carrot nose */}
            <mesh position={[0, 0.4, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
                <coneGeometry args={[0.02, 0.08, 8]} />
                <meshStandardMaterial color="#ff6600" />
            </mesh>
            
            {/* Eyes */}
            <mesh position={[-0.03, 0.43, 0.08]}>
                <sphereGeometry args={[0.015, 8, 8]} />
                <meshBasicMaterial color="#000000" />
            </mesh>
            <mesh position={[0.03, 0.43, 0.08]}>
                <sphereGeometry args={[0.015, 8, 8]} />
                <meshBasicMaterial color="#000000" />
            </mesh>
            
            {/* Hat */}
            <mesh position={[0, 0.52, 0]}>
                <cylinderGeometry args={[0.08, 0.08, 0.1, 16]} />
                <meshStandardMaterial color="#1a1a1a" />
            </mesh>
            <mesh position={[0, 0.47, 0]}>
                <cylinderGeometry args={[0.12, 0.12, 0.02, 16]} />
                <meshStandardMaterial color="#1a1a1a" />
            </mesh>
            
            {/* Scarf */}
            <mesh position={[0, 0.28, 0]}>
                <torusGeometry args={[0.1, 0.025, 8, 16]} />
                <meshStandardMaterial color="#cc0000" />
            </mesh>
        </group>
    );
};

// Snow particles inside the globe
const SnowParticles: React.FC = () => {
    const particlesRef = useRef<THREE.Points>(null);
    
    const particles = useMemo(() => {
        const count = 50;
        const positions = new Float32Array(count * 3);
        
        for (let i = 0; i < count; i++) {
            // Random positions within a larger sphere
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = Math.random() * 0.7;
            
            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) + 0.8;
            positions[i * 3 + 2] = r * Math.cos(phi);
        }
        
        return positions;
    }, []);
    
    useFrame((state) => {
        if (particlesRef.current) {
            const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
            const count = positions.length / 3;
            
            for (let i = 0; i < count; i++) {
                // Gentle floating motion
                positions[i * 3 + 1] -= 0.003;
                positions[i * 3] += Math.sin(state.clock.elapsedTime + i) * 0.0015;
                
                // Reset when too low
                if (positions[i * 3 + 1] < 0.3) {
                    positions[i * 3 + 1] = 1.5;
                }
            }
            
            particlesRef.current.geometry.attributes.position.needsUpdate = true;
        }
    });
    
    return (
        <points ref={particlesRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[particles, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.035}
                color="#ffffff"
                transparent
                opacity={0.85}
                sizeAttenuation
            />
        </points>
    );
};

const PlayerToken = ({ positionIndex }: { positionIndex: number }) => {
    const group = useRef<THREE.Group>(null);
    const glowRef = useRef<THREE.PointLight>(null);
    const sceneRef = useRef<THREE.Group>(null);

    const radius = (BOARD_INNER_RADIUS + BOARD_OUTER_RADIUS) / 2;
    const angle = (positionIndex / BOARD_SIZE) * 2 * Math.PI - Math.PI / 2;

    const targetPos = useMemo(() => new THREE.Vector3(
        radius * Math.cos(angle),
        BOARD_THICKNESS + 0.6,
        radius * Math.sin(angle)
    ), [positionIndex, radius, angle]);

    useFrame((state, delta) => {
        if (group.current) {
            group.current.position.lerp(targetPos, delta * 3);
            group.current.rotation.y += delta * 0.5;
        }
        // Pulsing glow effect
        if (glowRef.current) {
            glowRef.current.intensity = 1.2 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
        }
        // Slowly rotate the scene inside
        if (sceneRef.current) {
            sceneRef.current.rotation.y += delta * 0.3;
        }
    });

    return (
        <group ref={group} position={targetPos}>
            <Float speed={2} rotationIntensity={0.1} floatIntensity={0.15} floatingRange={[0, 0.08]}>
                {/* Outer glow sphere (bloom effect) */}
                <mesh position={[0, 0.9, 0]}>
                    <sphereGeometry args={[1.15, 32, 32]} />
                    <meshBasicMaterial
                        color="#88ccff"
                        transparent
                        opacity={0.1}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>

                {/* Snow Globe Glass Dome - larger and more transparent */}
                <mesh position={[0, 0.9, 0]}>
                    <sphereGeometry args={[0.9, 32, 32]} />
                    <meshPhysicalMaterial
                        color="#ffffff"
                        transmission={0.95}
                        opacity={0.25}
                        roughness={0}
                        metalness={0}
                        ior={1.2}
                        thickness={0.1}
                        clearcoat={0.5}
                        clearcoatRoughness={0}
                        envMapIntensity={0.3}
                        transparent
                        side={THREE.DoubleSide}
                    />
                </mesh>

                {/* Scene inside the globe */}
                <group ref={sceneRef} position={[0, 0.05, 0]}>
                    {/* Snow ground */}
                    <mesh position={[0, 0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                        <circleGeometry args={[0.7, 32]} />
                        <meshStandardMaterial color="#f0f8ff" roughness={0.5} />
                    </mesh>
                    
                    {/* Christmas Tree */}
                    <MiniChristmasTree />
                    
                    {/* Snowman */}
                    <MiniSnowman />
                    
                    {/* Snow particles */}
                    <SnowParticles />
                </group>

                {/* Warm inner light */}
                <pointLight 
                    ref={glowRef}
                    position={[0, 0.9, 0]} 
                    intensity={1.5} 
                    color="#fff5e0" 
                    distance={4}
                />

                {/* Ornate Gold Base */}
                <mesh position={[0, 0.08, 0]}>
                    <cylinderGeometry args={[0.7, 0.82, 0.28, 32]} />
                    <meshStandardMaterial 
                        color="#d4a520" 
                        metalness={0.95} 
                        roughness={0.15}
                        emissive="#5a4000"
                        emissiveIntensity={0.15}
                    />
                </mesh>

                {/* Base bottom rim */}
                <mesh position={[0, -0.05, 0]}>
                    <cylinderGeometry args={[0.82, 0.85, 0.08, 32]} />
                    <meshStandardMaterial 
                        color="#b8860b" 
                        metalness={0.9} 
                        roughness={0.2}
                    />
                </mesh>

                {/* Top gold ring where glass meets base */}
                <mesh position={[0, 0.22, 0]}>
                    <torusGeometry args={[0.65, 0.035, 16, 32]} />
                    <meshStandardMaterial 
                        color="#ffd700" 
                        metalness={1} 
                        roughness={0.05}
                        emissive="#ffd700"
                        emissiveIntensity={0.15}
                    />
                </mesh>

                {/* Decorative base ring */}
                <mesh position={[0, -0.02, 0]}>
                    <torusGeometry args={[0.78, 0.025, 16, 32]} />
                    <meshStandardMaterial 
                        color="#ffd700" 
                        metalness={1} 
                        roughness={0.1}
                    />
                </mesh>
            </Float>

            {/* Soft shadow */}
            <mesh position={[0, -0.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.9, 32]} />
                <meshBasicMaterial color="#000" opacity={0.35} transparent />
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
