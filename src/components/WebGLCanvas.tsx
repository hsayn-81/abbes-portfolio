"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Custom GLSL Shaders la-nekhla2 l-Liquid / Wave Distortion taba3 Emakio
const WaveShaderMaterial = {
  uniforms: {
    uTexture: { value: null },
    uProgress: { value: 0 },
    uVelocity: { value: 0 },
    uTime: { value: 0 },
  },
  vertexShader: `
    varying vec2 vUv;
    uniform float uVelocity;
    uniform float uProgress;
    
    void main() {
      vUv = uv;
      vec3 pos = position;
      
      // Wave distortion based on scroll velocity
      pos.z += sin(pos.y * 3.0) * uVelocity * 0.15;
      pos.x += cos(pos.y * 2.0) * uVelocity * 0.05;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D uTexture;
    uniform float uProgress;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;
      
      // Subtle RGB Split / Color Shift on scroll
      vec4 tex = texture2D(uTexture, uv);
      
      // Luxury Dark Vignette Overlay
      float dist = distance(uv, vec2(0.5));
      tex.rgb *= smoothstep(0.8, 0.2, dist * 0.8);

      gl_FragColor = tex;
    }
  `,
};

function ImageMesh({ textureUrl, position, scale }: { textureUrl: string; position: [number, number, number]; scale: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const texture = useTexture(textureUrl);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);

  const { viewport } = useThree();

  useEffect(() => {
    if (!meshRef.current) return;

    // Connect GSAP ScrollTrigger to the WebGL Shader Uniforms
    ScrollTrigger.create({
      trigger: "main",
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        if (materialRef.current) {
          // Pass scroll velocity into the 3D Shader for dynamic fluid bending
          materialRef.current.uniforms.uVelocity.value = self.getVelocity() * 0.005;
        }
      },
    });
  }, []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
      // Smooth dampening of velocity
      materialRef.current.uniforms.uVelocity.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uVelocity.value,
        0,
        0.05
      );
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        args={[WaveShaderMaterial]}
        uniforms-uTexture-value={texture}
        transparent
      />
    </mesh>
  );
}

export default function WebGLCanvas() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={1.5} />
        {/* Render WebGL Image Meshes in 3D Space */}
        <ImageMesh textureUrl="/images/hero-bg.png" position={[0, 0, 0]} scale={[7, 4, 1]} />
      </Canvas>
    </div>
  );
}