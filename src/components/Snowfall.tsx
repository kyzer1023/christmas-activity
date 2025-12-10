import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SnowfallProps {
    count?: number;
    area?: number;
    speed?: number;
}

const Snowfall: React.FC<SnowfallProps> = ({ 
    count = 2000, 
    area = 50,
    speed = 0.02 
}) => {
    const meshRef = useRef<THREE.Points>(null);
    
    // Generate initial snowflake positions
    const particles = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const velocities = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        
        for (let i = 0; i < count; i++) {
            // Random position within the area
            positions[i * 3] = (Math.random() - 0.5) * area;     // x
            positions[i * 3 + 1] = Math.random() * area;          // y (start from various heights)
            positions[i * 3 + 2] = (Math.random() - 0.5) * area;  // z
            
            // Random velocities for natural drift
            velocities[i * 3] = (Math.random() - 0.5) * 0.02;     // x drift
            velocities[i * 3 + 1] = speed + Math.random() * speed; // y fall speed
            velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;  // z drift
            
            // Random sizes for depth perception
            sizes[i] = Math.random() * 0.5 + 0.1;
        }
        
        return { positions, velocities, sizes };
    }, [count, area, speed]);

    // Animate snowflakes
    useFrame((state) => {
        if (!meshRef.current) return;
        
        const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
        const time = state.clock.elapsedTime;
        
        for (let i = 0; i < count; i++) {
            // Fall down
            positions[i * 3 + 1] -= particles.velocities[i * 3 + 1];
            
            // Add gentle swaying motion
            positions[i * 3] += Math.sin(time + i) * 0.003 + particles.velocities[i * 3];
            positions[i * 3 + 2] += Math.cos(time + i * 0.5) * 0.003 + particles.velocities[i * 3 + 2];
            
            // Reset snowflake when it falls below ground
            if (positions[i * 3 + 1] < -5) {
                positions[i * 3] = (Math.random() - 0.5) * area;
                positions[i * 3 + 1] = area / 2 + Math.random() * 10;
                positions[i * 3 + 2] = (Math.random() - 0.5) * area;
            }
        }
        
        meshRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[particles.positions, 3]}
                />
                <bufferAttribute
                    attach="attributes-size"
                    args={[particles.sizes, 1]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.15}
                color="#ffffff"
                transparent
                opacity={0.8}
                sizeAttenuation
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

export default Snowfall;

