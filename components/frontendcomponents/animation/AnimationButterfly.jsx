"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function AnimationButterfly({ id }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const width = container.clientWidth;
    const height = container.clientHeight;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";

    const canvas2d = document.createElement("canvas");
    canvas2d.width = 1200;
    canvas2d.height = 1200;
    const ctx = canvas2d.getContext("2d");
    if (!ctx) return;

    ctx.translate(600, 600);
    ctx.scale(9.5, 9.5);
    ctx.translate(-57.45, -53.85);

    const drawAllPaths = () => {
      ctx.beginPath();
      ctx.moveTo(18.3, 61.2);
      ctx.lineTo(18.3, 2.2);
      ctx.lineTo(47.8, 31.7);
      ctx.closePath();

      ctx.moveTo(74.6, 83);
      ctx.lineTo(116.3, 41.3);
      ctx.lineTo(74.6, 41.3);
      ctx.closePath();

      ctx.moveTo(33.7, 46.8);
      ctx.lineTo(48.5, 32);
      ctx.lineTo(48.5, 61.5);
      ctx.closePath();

      ctx.moveTo(2.9, 77.5);
      ctx.lineTo(17.7, 62.8);
      ctx.lineTo(32.4, 77.5);
      ctx.closePath();

      ctx.moveTo(51.1, 62.1);
      ctx.lineTo(51.1, 83);
      ctx.lineTo(72.0, 62.1);
      ctx.lineTo(72.0, 41.3);
      ctx.closePath();

      ctx.moveTo(72.0, 65.3);
      ctx.lineTo(51.1, 86.1);
      ctx.lineTo(72.0, 107.0);
      ctx.closePath();
    };

    ctx.fillStyle = "#000";
    drawAllPaths();
    ctx.fill();

    ctx.save();
    ctx.transform(0.7071, -0.7071, 0.7071, 0.7071, -34.2248, 41.5836);
    ctx.fillRect(22.7, 51.7, 20.9, 20.9);
    ctx.restore();

    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = 0.9;
    ctx.lineJoin = "miter";
    ctx.miterLimit = 10;
    ctx.strokeStyle = "#000";
    drawAllPaths();
    ctx.stroke();

    ctx.save();
    ctx.transform(0.7071, -0.7071, 0.7071, 0.7071, -34.2248, 41.5836);
    ctx.strokeRect(22.7, 51.7, 20.9, 20.9);
    ctx.restore();

    ctx.globalCompositeOperation = "source-over";

    const imgData = ctx.getImageData(0, 0, 1200, 1200).data;
    const points = [];
    const step = 3;

    for (let y = 0; y < 1200; y += step) {
      for (let x = 0; x < 1200; x += step) {
        const index = (y * 1200 + x) * 4;
        if (imgData[index + 3] > 64) {
          points.push({
            baseX: (x - 600) * 0.048,
            baseY: -(y - 600) * 0.048,
            baseZ: (Math.random() - 0.5) * 4,
          });
        }
      }
    }

    for (let i = 0; i < 150; i++) {
      points.push({
        baseX: (Math.random() - 0.5) * 120,
        baseY: (Math.random() - 0.5) * 80,
        baseZ: (Math.random() - 0.5) * 40,
        isStray: true,
      });
    }

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(points.length * 3);
    const basePositions = new Float32Array(points.length * 3);
    const velocities = new Float32Array(points.length * 3);

    points.forEach((pt, i) => {
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
      color: 0x052559,
      size: 0.28,
      transparent: true,
      opacity: 0.98,
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    const baseBounds = (() => {
      const baseAttr = geometry.attributes.basePosition;
      let minX = Infinity;
      let minY = Infinity;
      let minZ = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      let maxZ = -Infinity;

      for (let i = 0; i < baseAttr.count; i++) {
        const x = baseAttr.getX(i);
        const y = baseAttr.getY(i);
        const z = baseAttr.getZ(i);
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (z < minZ) minZ = z;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
        if (z > maxZ) maxZ = z;
      }

      return {
        sizeX: maxX - minX || 1,
        sizeY: maxY - minY || 1,
        centerX: (minX + maxX) / 2,
        centerY: (minY + maxY) / 2,
        centerZ: (minZ + maxZ) / 2,
      };
    })();

    const applyResponsiveLayout = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;

      const wWidth = window.innerWidth;

      let camZ, camX, camY;
      if (wWidth <= 768) {
        camZ = 120;
        camX = 0;
        camY = wWidth <= 540 ? -20 : -20;
      } else {
        camZ = 200;
        camX = -15;
        camY = 0;
      }

      camera.position.set(camX, camY, camZ);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      // View volume at z = 0
      const vFov = (camera.fov * Math.PI) / 180;
      const visibleHeight = 2 * Math.tan(vFov / 2) * camera.position.z;
      const visibleWidth = visibleHeight * camera.aspect;

      let targetW, targetH;
      let rightShift = 0;
      let upShift = 0;

      if (wWidth <= 540) {
        targetW = visibleWidth * 0.9;
        targetH = visibleHeight * 0.6;
        upShift = visibleHeight * 0.15;
      } else if (wWidth <= 768) {
        targetW = visibleWidth * 0.9;
        targetH = visibleHeight * 0.6;
        upShift = visibleHeight * 0.15;
      } else if (wWidth <= 1170) {
        targetW = visibleWidth * 0.6;
        targetH = visibleHeight * 0.8;
        rightShift = visibleWidth * 0.2;
      } else {
        // Desktop
        targetW = visibleWidth * 0.5;
        targetH = visibleHeight * 1;
        rightShift = visibleWidth * 0.2;
      }

      const fitScale = Math.min(
        targetW / baseBounds.sizeX,
        targetH / baseBounds.sizeY,
      );

      particleSystem.scale.setScalar(fitScale);

      particleSystem.position.set(
        -baseBounds.centerX * fitScale + rightShift,
        -baseBounds.centerY * fitScale + upShift,
        -baseBounds.centerZ * fitScale,
      );
    };

    applyResponsiveLayout();

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-9999, -9999);
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const mouse3D = new THREE.Vector3();

    const onMouseMove = (event) => {
      const rect = container.getBoundingClientRect();
      if (
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom
      ) {
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      } else {
        mouse.x = -9999;
        mouse.y = -9999;
      }
    };
    window.addEventListener("mousemove", onMouseMove);

    let isVisible = false;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!isVisible) {
              isVisible = true;
              const pos = geometry.attributes.position;
              for (let i = 0; i < pos.count; i++) {
                const isStray = i >= pos.count - 150;
                if (!isStray) {
                  pos.setXYZ(
                    i,
                    pos.getX(i) + (Math.random() - 0.5) * 800,
                    pos.getY(i) + (Math.random() - 0.5) * 800,
                    pos.getZ(i) + (Math.random() - 0.5) * 800,
                  );
                }
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

    const resizeObserver = new ResizeObserver(() => {
      applyResponsiveLayout();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });
    resizeObserver.observe(container);

    const clock = new THREE.Clock();
    let rafId;

    const animate = () => {
      rafId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      particleSystem.rotation.y = Math.sin(elapsedTime * 0.3) * 0.15;
      particleSystem.rotation.x = Math.sin(elapsedTime * 0.2) * 0.05;

      raycaster.setFromCamera(mouse, camera);
      raycaster.ray.intersectPlane(plane, mouse3D);

      const posAttribute = geometry.attributes.position;
      const baseAttribute = geometry.attributes.basePosition;
      const velAttribute = geometry.attributes.velocity;

      const repelRadius = 16.0;
      const forceMagnitude = 1.2;
      const friction = 0.88;
      const spring = 0.02;

      const localMouse = mouse3D.clone();
      particleSystem.worldToLocal(localMouse);

      for (let i = 0; i < posAttribute.count; i++) {
        const px = posAttribute.getX(i);
        const py = posAttribute.getY(i);
        const pz = posAttribute.getZ(i);

        const bx = baseAttribute.getX(i);
        const by = baseAttribute.getY(i);
        const bz = baseAttribute.getZ(i);

        let vx = velAttribute.getX(i);
        let vy = velAttribute.getY(i);
        let vz = velAttribute.getZ(i);

        const dxMouse = px - localMouse.x;
        const dyMouse = py - localMouse.y;
        const dzMouse = pz - localMouse.z;
        const distSq =
          dxMouse * dxMouse +
          dyMouse * dyMouse +
          Math.max(dzMouse * dzMouse, 0.1);

        if (distSq < repelRadius * repelRadius) {
          const dist = Math.sqrt(distSq) || 0.1;
          const force = Math.pow((repelRadius - dist) / repelRadius, 2.0);
          vx += (dxMouse / dist) * force * forceMagnitude;
          vy += (dyMouse / dist) * force * forceMagnitude;
          vz += force * forceMagnitude * 0.5;
        }

        const floatOffsetY = Math.sin(elapsedTime * 1.5 + bx * 0.5) * 0.2;

        vx += (bx - px) * spring;
        vy += (by + floatOffsetY - py) * spring;
        vz += (bz - pz) * spring;

        vx *= friction;
        vy *= friction;
        vz *= friction;

        velAttribute.setXYZ(i, vx, vy, vz);
        posAttribute.setXYZ(i, px + vx, py + vy, pz + vz);
      }

      posAttribute.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

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
