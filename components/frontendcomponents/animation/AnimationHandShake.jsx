"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function AnimationHandShake({ id }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();

    const width = container.clientWidth;
    const height = container.clientHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    if (window.innerWidth < 769) {
      camera.position.z = 120;
      camera.position.x = 0;
      camera.position.y = -30;
    } else if (window.innerWidth < 1100) {
      camera.position.z = 180;
      camera.position.x = -28;
    } else {
      camera.position.z = 78;
      // Match Animation1 framing so model sits a bit right
      camera.position.x = -35;
    }
    if(id === "homeHandShake") {
      if (window.innerWidth > 769) { 
        camera.position.z = 120;
        camera.position.x = -30;
        camera.position.y = 0;
      }
    }

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";

    const points = [];
    const step = 2.0;
    const scale = 3.4;
    const cx = -234.4 / 2;
    const cy = -151.7 / 2;
    const gtx = 600;
    const gty = 600;

    function addLine(x1, y1, x2, y2) {
      const X1 = (x1 + cx) * scale + gtx;
      const Y1 = (y1 + cy) * scale + gty;
      const X2 = (x2 + cx) * scale + gtx;
      const Y2 = (y2 + cy) * scale + gty;

      const dx = X2 - X1;
      const dy = Y2 - Y1;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const count = Math.max(1, Math.floor(dist / step));

      for (let i = 0; i < count; i++) {
        const t = count === 1 ? 0 : i / count;
        const x = X1 + dx * t;
        const y = Y1 + dy * t;
        points.push({
          baseX: (x - 600) * 0.05,
          baseY: -(y - 600) * 0.05,
          baseZ: (Math.random() - 0.5) * 4,
        });
      }
    }

    function addPoly(pts) {
      const pairs = pts
        .trim()
        .split(/\s+/)
        .map((p) => p.split(",").map(Number));

      if (pairs.length === 0) return;
      for (let i = 0; i < pairs.length - 1; i++) {
        addLine(pairs[i][0], pairs[i][1], pairs[i + 1][0], pairs[i + 1][1]);
      }
      addLine(
        pairs[pairs.length - 1][0],
        pairs[pairs.length - 1][1],
        pairs[0][0],
        pairs[0][1],
      );
    }

    function addRect(x, y, w, h, transformStr) {
      const match = transformStr.match(/matrix\(([^)]+)\)/);
      if (!match) return;
      const m = match[1].split(" ").map(Number);

      function transformPoint(px, py) {
        return [m[0] * px + m[2] * py + m[4], m[1] * px + m[3] * py + m[5]];
      }

      const p1 = transformPoint(x, y);
      const p2 = transformPoint(x + w, y);
      const p3 = transformPoint(x + w, y + h);
      const p4 = transformPoint(x, y + h);

      addLine(p1[0], p1[1], p2[0], p2[1]);
      addLine(p2[0], p2[1], p3[0], p3[1]);
      addLine(p3[0], p3[1], p4[0], p4[1]);
      addLine(p4[0], p4[1], p1[0], p1[1]);
    }

    // Group 1
    addPoly("147.9,105.4 96,53.4 147.9,53.4");
    addPoly("201.1,106.6 149.1,54.6 149.1,106.6");
    addPoly("206.7,127.9 225.1,146.2 188.4,146.2");
    addRect(
      174.4,
      114,
      26,
      26,
      "matrix(0.7071 -0.7071 0.7071 0.7071 -34.8741 169.7178)",
    );
    addPoly("186.5,107.7 168.1,126 149.8,107.7");
    addPoly("148.9,108.3 122.9,108.3 148.9,134.3 174.8,134.3");
    addPoly("224.9,144.5 224.9,107.8 188.2,107.8");

    // Group 2
    addPoly("84.2,50.4 136.2,102.3 84.2,102.3");
    addPoly("31.1,49.2 83,101.1 83,49.2");
    addPoly("25.8,27.9 7.4,9.5 44.1,9.5");
    addRect(
      32.1,
      15.8,
      26,
      26,
      "matrix(0.7071 -0.7071 0.7071 0.7071 -7.1708 40.3051)",
    );
    addPoly("46,48.1 64.4,29.7 82.7,48.1");
    addPoly("83.6,47.4 109.6,47.4 83.6,21.5 57.7,21.5");
    addPoly("7.6,11.2 7.6,48 44.3,48");

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
      color: 0x275b70,
      size: 0.55,
      transparent: true,
      opacity: 0.9,
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

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
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
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
        const px = posAttr.getX(i);
        const py = posAttr.getY(i);
        const pz = posAttr.getZ(i);

        const bx = baseAttr.getX(i);
        const by = baseAttr.getY(i);
        const bz = baseAttr.getZ(i);

        let vx = velAttr.getX(i);
        let vy = velAttr.getY(i);
        let vz = velAttr.getZ(i);

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
