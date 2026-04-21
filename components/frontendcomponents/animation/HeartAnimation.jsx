"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeartAnimation({ id }) {
  // return null;
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ── Scene ──────────────────────────────────────────────────────────────
    const scene = new THREE.Scene();

    const width = container.clientWidth;
    const height = container.clientHeight;

    // ── Camera ─────────────────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);

    if (window.innerWidth < 769) {
      camera.position.z = 120;
      camera.position.x = 0;
      camera.position.y = -30;
    } else {
      camera.position.z = 80;
      camera.position.x = -25;
    }
    if(id === "homeHeart") {
      if (window.innerWidth > 769) { 
        camera.position.z = 100;
        camera.position.x = -30;
      }
    }

    // ── Renderer ───────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";

    // ── 2-D Canvas – generate particle positions from drawn heart ──────────
    const canvas2d = document.createElement("canvas");
    canvas2d.width = 1200;
    canvas2d.height = 1200;
    const ctx = canvas2d.getContext("2d");

    ctx.strokeStyle = "#000";
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.translate(600, 600);
    ctx.scale(10, 10);
    ctx.translate(-45, -37.5);

    function drawHeart() {
      ctx.beginPath();
      ctx.moveTo(29.97, 59.33);
      ctx.lineTo(29.97, 0.21);
      ctx.lineTo(59.53, 29.77);
      ctx.closePath();
      ctx.moveTo(29.56, 59.33);
      ctx.lineTo(29.56, 0.21);
      ctx.lineTo(0, 29.77);
      ctx.closePath();
      ctx.moveTo(44.75, 74.99);
      ctx.lineTo(29.97, 60.21);
      ctx.lineTo(59.53, 60.21);
      ctx.closePath();
      ctx.moveTo(75.18, 14.99);
      ctx.lineTo(89.96, 29.77);
      ctx.lineTo(75.18, 44.55);
      ctx.closePath();
      ctx.moveTo(44.89, 44.99);
      ctx.lineTo(30.11, 59.77);
      ctx.lineTo(59.67, 59.77);
      ctx.lineTo(74.45, 44.99);
      ctx.closePath();
      ctx.moveTo(45.27, 44.55);
      ctx.lineTo(74.83, 44.55);
      ctx.lineTo(74.83, 14.99);
      ctx.closePath();
      ctx.stroke();

      ctx.save();
      ctx.translate(7.06, 46.6);
      ctx.rotate((-45 * Math.PI) / 180);
      ctx.beginPath();
      ctx.rect(49.34, 4.33, 20.9, 20.9);
      ctx.stroke();
      ctx.restore();
    }

    for (let i = 0; i < 4; i++) {
      ctx.lineWidth = 1.5 - i * 0.3;
      drawHeart();
    }

    const imgData = ctx.getImageData(0, 0, 1200, 1200).data;
    const pts = [];
    const step = 6;

    for (let y = 0; y < 1200; y += step) {
      for (let x = 0; x < 1200; x += step) {
        const idx = (y * 1200 + x) * 4;
        if (imgData[idx + 3] > 64) {
          pts.push({
            baseX: (x - 600) * 0.045,
            baseY: -(y - 600) * 0.045,
            baseZ: (Math.random() - 0.5) * 4,
          });
        }
      }
    }

    // Background floating particles
    for (let i = 0; i < 150; i++) {
      pts.push({
        baseX: (Math.random() - 0.5) * 120,
        baseY: (Math.random() - 0.5) * 80,
        baseZ: (Math.random() - 0.5) * 40,
        isStray: true,
      });
    }

    // ── BufferGeometry ─────────────────────────────────────────────────────
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(pts.length * 3);
    const basePositions = new Float32Array(pts.length * 3);
    const velocities = new Float32Array(pts.length * 3);

    pts.forEach((pt, i) => {
      positions[i * 3] = pt.baseX + (Math.random() - 0.5) * 800;
      positions[i * 3 + 1] = pt.baseY + (Math.random() - 0.5) * 800;
      positions[i * 3 + 2] = pt.baseZ + (Math.random() - 0.5) * 800;

      basePositions[i * 3] = pt.baseX;
      basePositions[i * 3 + 1] = pt.baseY;
      basePositions[i * 3 + 2] = pt.baseZ;
    });

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute(
      "basePosition",
      new THREE.BufferAttribute(basePositions, 3),
    );
    geometry.setAttribute("velocity", new THREE.BufferAttribute(velocities, 3));

    const material = new THREE.PointsMaterial({
      color: 0x275b70,
      size: 0.61,
      transparent: true,
      opacity: 1.0,
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    // ── Mouse interaction ─────────────────────────────────────────────────
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-9999, -9999);
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const mouse3D = new THREE.Vector3();

    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      } else {
        mouse.x = -9999;
        mouse.y = -9999;
      }
    };
    window.addEventListener("mousemove", onMouseMove);

    // ── IntersectionObserver (re-scatter on re-entry) ──────────────────────
    let isVisible = false;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!isVisible) {
              isVisible = true;
              const pos = geometry.attributes.position;
              for (let i = 0; i < pos.count - 150; i++) {
                pos.setXYZ(
                  i,
                  pos.getX(i) + (Math.random() - 0.5) * 800,
                  pos.getY(i) + (Math.random() - 0.5) * 800,
                  pos.getZ(i) + (Math.random() - 0.5) * 800,
                );
              }
              pos.needsUpdate = true;
            }
          } else {
            isVisible = false;
          }
        });
      },
      { threshold: 0.1 },
    );
    observer.observe(renderer.domElement);

    // ── Resize ─────────────────────────────────────────────────────────────
    const resizeObserver = new ResizeObserver(() => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    // ── Animation loop ─────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    let rafId;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      particleSystem.rotation.y = Math.sin(elapsedTime * 0.3) * 0.15;
      particleSystem.rotation.x = Math.sin(elapsedTime * 0.2) * 0.05;

      raycaster.setFromCamera(mouse, camera);
      raycaster.ray.intersectPlane(plane, mouse3D);

      const posAttr = geometry.attributes.position;
      const baseAttr = geometry.attributes.basePosition;
      const velAttr = geometry.attributes.velocity;

      const repelRadius = 16.0;
      const forceMagnitude = 1.2;
      const friction = 0.88;
      const spring = 0.02;

      const localMouse = mouse3D.clone();
      particleSystem.worldToLocal(localMouse);

      for (let i = 0; i < posAttr.count; i++) {
        const px = posAttr.getX(i),
          py = posAttr.getY(i),
          pz = posAttr.getZ(i);
        const bx = baseAttr.getX(i),
          by = baseAttr.getY(i),
          bz = baseAttr.getZ(i);

        let vx = velAttr.getX(i),
          vy = velAttr.getY(i),
          vz = velAttr.getZ(i);

        const dxM = px - localMouse.x;
        const dyM = py - localMouse.y;
        const dzM = pz - localMouse.z;
        const distSq = dxM * dxM + dyM * dyM + Math.max(dzM * dzM, 0.1);

        if (distSq < repelRadius * repelRadius) {
          const dist = Math.sqrt(distSq) || 0.1;
          const force = Math.pow((repelRadius - dist) / repelRadius, 2.0);
          vx += (dxM / dist) * force * forceMagnitude;
          vy += (dyM / dist) * force * forceMagnitude;
          vz += force * forceMagnitude * 0.5;
        }

        const floatY = Math.sin(elapsedTime * 1.5 + bx * 0.5) * 0.2;

        vx += (bx - px) * spring;
        vy += (by + floatY - py) * spring;
        vz += (bz - pz) * spring;

        vx *= friction;
        vy *= friction;
        vz *= friction;

        velAttr.setXYZ(i, vx, vy, vz);
        posAttr.setXYZ(i, px + vx, py + vy, pz + vz);
      }

      posAttr.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    // ── Cleanup ────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      observer.disconnect();
      resizeObserver.disconnect();
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id={String(id)}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
