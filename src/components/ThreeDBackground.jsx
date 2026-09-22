import React, { useEffect, useRef, useState } from 'react';

export const ThreeDBackground = () => {
  const canvasRef = useRef(null);
  const [particlesCount] = useState(85);

  const mouseRef = useRef({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = (e.clientY / window.innerHeight) * 2 - 1;
      mouseRef.current.targetX = normX;
      mouseRef.current.targetY = normY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const palette = {
      bg: '#000000',
      glow1: 'rgba(56, 189, 248, 0.08)',
      glow2: 'rgba(59, 130, 246, 0.08)',
      primary: '#38bdf8',
      secondary: '#60a5fa',
      accent: '#3b82f6',
    };

    const createIcosahedron = (scale) => {
      const phi = (1 + Math.sqrt(5)) / 2;
      const rawVerts = [
        [-1, phi, 0],
        [1, phi, 0],
        [-1, -phi, 0],
        [1, -phi, 0],
        [0, -1, phi],
        [0, 1, phi],
        [0, -1, -phi],
        [0, 1, -phi],
        [phi, 0, -1],
        [phi, 0, 1],
        [-phi, 0, -1],
        [-phi, 0, 1],
      ];

      const vertices = rawVerts.map(([x, y, z]) => {
        const len = Math.hypot(x, y, z);
        return {
          x: (x / len) * scale,
          y: (y / len) * scale,
          z: (z / len) * scale,
        };
      });

      const edges = [];
      const edgeThreshold = 1.15 * ((scale * 2) / Math.sqrt(1 + phi * phi));
      for (let i = 0; i < vertices.length; i++) {
        for (let j = i + 1; j < vertices.length; j++) {
          const dist = Math.hypot(
            vertices[i].x - vertices[j].x,
            vertices[i].y - vertices[j].y,
            vertices[i].z - vertices[j].z
          );
          if (dist <= edgeThreshold * 1.3) {
            edges.push([i, j]);
          }
        }
      }
      return { vertices, edges };
    };

    const createOctahedron = (scale) => {
      const vertices = [
        { x: scale, y: 0, z: 0 },
        { x: -scale, y: 0, z: 0 },
        { x: 0, y: scale, z: 0 },
        { x: 0, y: -scale, z: 0 },
        { x: 0, y: 0, z: scale },
        { x: 0, y: 0, z: -scale },
      ];
      const edges = [
        [0, 2], [0, 3], [0, 4], [0, 5],
        [1, 2], [1, 3], [1, 4], [1, 5],
        [2, 4], [4, 3], [3, 5], [5, 2],
      ];
      return { vertices, edges };
    };

    const ico1 = createIcosahedron(110);
    const ico2 = createIcosahedron(75);
    const oct1 = createOctahedron(90);
    const oct2 = createOctahedron(65);

    const polyhedra = [
      {
        x: -330,
        y: -140,
        z: 180,
        rotX: 0.2,
        rotY: 0.5,
        rotZ: 0.1,
        rotSpeedX: 0.003,
        rotSpeedY: 0.005,
        rotSpeedZ: 0.002,
        color: palette.primary,
        vertices: ico1.vertices,
        edges: ico1.edges,
      },
      {
        x: 350,
        y: 150,
        z: 220,
        rotX: 1.1,
        rotY: 0.4,
        rotZ: 0.8,
        rotSpeedX: -0.004,
        rotSpeedY: 0.005,
        rotSpeedZ: 0.003,
        color: palette.secondary,
        vertices: ico2.vertices,
        edges: ico2.edges,
      },
      {
        x: 300,
        y: -190,
        z: 320,
        rotX: 0.6,
        rotY: 0.9,
        rotZ: 0.3,
        rotSpeedX: 0.005,
        rotSpeedY: -0.004,
        rotSpeedZ: 0.005,
        color: palette.accent,
        vertices: oct1.vertices,
        edges: oct1.edges,
      },
      {
        x: -290,
        y: 200,
        z: 250,
        rotX: 0.3,
        rotY: 1.2,
        rotZ: 0.5,
        rotSpeedX: -0.005,
        rotSpeedY: 0.006,
        rotSpeedZ: -0.003,
        color: palette.primary,
        vertices: oct2.vertices,
        edges: oct2.edges,
      },
    ];

    const orbs = [
      {
        x: -240,
        y: -120,
        z: 120,
        baseRadius: 220,
        speed: 0.0006,
        offset: 0,
        glowColor: palette.glow1,
      },
      {
        x: 260,
        y: 100,
        z: 160,
        baseRadius: 240,
        speed: 0.0005,
        offset: Math.PI * 0.7,
        glowColor: palette.glow2,
      },
    ];

    const particles = [];
    for (let i = 0; i < particlesCount; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 1500,
        y: (Math.random() - 0.5) * 1100,
        z: Math.random() * 800 + 40,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        vz: (Math.random() - 0.5) * 0.25,
        size: Math.random() * 2.2 + 1.2,
        color: i % 2 === 0 ? palette.primary : palette.secondary,
        alpha: Math.random() * 0.65 + 0.35,
      });
    }

    const fov = 480;

    const project3D = (x, y, z) => {
      const distance = z + fov;
      if (distance <= 10) return { x: 0, y: 0, scale: 0, alpha: 0 };
      const scale = fov / distance;
      return {
        x: width / 2 + x * scale,
        y: height / 2 + y * scale,
        scale,
        alpha: Math.min(1, Math.max(0.15, (1000 - z) / 800)),
      };
    };

    const rotatePoint = (p, rx, ry, rz) => {
      const y1 = p.y * Math.cos(rx) - p.z * Math.sin(rx);
      const z1 = p.y * Math.sin(rx) + p.z * Math.cos(rx);

      const x2 = p.x * Math.cos(ry) + z1 * Math.sin(ry);
      const z2 = -p.x * Math.sin(ry) + z1 * Math.cos(ry);

      const x3 = x2 * Math.cos(rz) - y1 * Math.sin(rz);
      const y3 = x2 * Math.sin(rz) + y1 * Math.cos(rz);

      return { x: x3, y: y3, z: z2 };
    };

    let time = 0;

    const render = () => {
      time += 0.016;

      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const camOffsetX = mouseRef.current.x * 65;
      const camOffsetY = mouseRef.current.y * 45;

      ctx.fillStyle = palette.bg;
      ctx.fillRect(0, 0, width, height);

      // Subtle ambient depth glows
      orbs.forEach((orb) => {
        const floatY = Math.sin(time * orb.speed * 20 + orb.offset) * 35;
        const floatX = Math.cos(time * orb.speed * 15 + orb.offset) * 25;

        const proj = project3D(
          orb.x + floatX - camOffsetX * 0.35,
          orb.y + floatY - camOffsetY * 0.35,
          orb.z
        );

        if (proj.scale > 0) {
          const radius = orb.baseRadius * proj.scale * 1.5;
          const grad = ctx.createRadialGradient(
            proj.x,
            proj.y,
            0,
            proj.x,
            proj.y,
            Math.max(1, radius)
          );
          grad.addColorStop(0, orb.glowColor);
          grad.addColorStop(0.5, 'rgba(56, 189, 248, 0.03)');
          grad.addColorStop(1, 'transparent');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, Math.max(1, radius), 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 3D Polyhedra floating in space
      polyhedra.forEach((poly) => {
        poly.rotX += poly.rotSpeedX;
        poly.rotY += poly.rotSpeedY;
        poly.rotZ += poly.rotSpeedZ;

        const currentX = poly.x - camOffsetX * 0.5;
        const currentY = poly.y - camOffsetY * 0.5;

        const transformedVerts = poly.vertices.map((v) => {
          const rotated = rotatePoint(v, poly.rotX, poly.rotY, poly.rotZ);
          return {
            x: rotated.x + currentX,
            y: rotated.y + currentY,
            z: rotated.z + poly.z,
          };
        });

        const projectedVerts = transformedVerts.map((v) => project3D(v.x, v.y, v.z));

        ctx.save();
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        poly.edges.forEach(([i, j]) => {
          const p1 = projectedVerts[i];
          const p2 = projectedVerts[j];

          if (p1.scale > 0 && p2.scale > 0) {
            const avgAlpha = ((p1.alpha + p2.alpha) / 2) * 0.5;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = poly.color;
            ctx.globalAlpha = avgAlpha;
            ctx.lineWidth = Math.max(1, 1.6 * ((p1.scale + p2.scale) / 2));
            ctx.stroke();
          }
        });

        projectedVerts.forEach((p) => {
          if (p.scale > 0) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, Math.max(1.5, 3 * p.scale), 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = p.alpha * 0.9;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(p.x, p.y, Math.max(2.5, 7 * p.scale), 0, Math.PI * 2);
            ctx.fillStyle = poly.color;
            ctx.globalAlpha = p.alpha * 0.35;
            ctx.fill();
          }
        });

        ctx.restore();
      });

      // 3D Plexus / Constellation Particle Network
      const projectedParticles = particles.map((pt) => {
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.z += pt.vz;

        if (pt.x > 850) pt.x = -850;
        if (pt.x < -850) pt.x = 850;
        if (pt.y > 650) pt.y = -650;
        if (pt.y < -650) pt.y = 650;
        if (pt.z > 850) pt.z = 50;
        if (pt.z < 50) pt.z = 850;

        const proj = project3D(pt.x - camOffsetX * 0.6, pt.y - camOffsetY * 0.6, pt.z);
        return { pt, proj };
      });

      ctx.save();
      // Draw constellation connecting lines
      const maxConnectDist = 135;
      ctx.lineWidth = 1;
      for (let i = 0; i < projectedParticles.length; i++) {
        const p1 = projectedParticles[i].proj;
        if (p1.scale <= 0) continue;

        for (let j = i + 1; j < projectedParticles.length; j++) {
          const p2 = projectedParticles[j].proj;
          if (p2.scale <= 0) continue;

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectDist) {
            const lineAlpha = (1 - dist / maxConnectDist) * 0.4 * Math.min(p1.alpha, p2.alpha);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = '#38bdf8';
            ctx.globalAlpha = lineAlpha;
            ctx.stroke();
          }
        }
      }

      // Draw glowing constellation nodes / dots
      projectedParticles.forEach(({ pt, proj }) => {
        if (proj.scale > 0) {
          // outer glow ring
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, Math.max(2.5, pt.size * proj.scale * 2.2), 0, Math.PI * 2);
          ctx.fillStyle = '#0284c7';
          ctx.globalAlpha = pt.alpha * proj.alpha * 0.35;
          ctx.fill();

          // core blue dot
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, Math.max(1.6, pt.size * proj.scale), 0, Math.PI * 2);
          ctx.fillStyle = pt.color;
          ctx.globalAlpha = pt.alpha * proj.alpha * 0.95;
          ctx.fill();

          // bright white center highlight
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, Math.max(0.7, pt.size * proj.scale * 0.45), 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.globalAlpha = pt.alpha * proj.alpha * 0.85;
          ctx.fill();
        }
      });
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [particlesCount]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-black">
      <canvas
        ref={canvasRef}
        id="animated-3d-canvas"
        className="w-full h-full block"
      />
    </div>
  );
};
