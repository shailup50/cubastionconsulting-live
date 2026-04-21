"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function AnimationFingerTip({ id }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();

    const width = container.clientWidth;
    const height = container.clientHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    if (window.innerWidth < 769) {
      camera.position.z = 200;
      camera.position.x = 0;
      camera.position.y = -45;
    }
    // else if (window.innerWidth < 1100) {
    //   camera.position.z = 200;
    //   camera.position.x = 0;
    //   camera.position.y = -45;
    // }
    else {
      camera.position.z = 80;
      // Match Animation1 framing so model sits a bit right
      camera.position.x = -25;
    }
    if(id === "homeFingerTip") {
      if (window.innerWidth > 769) { 
        camera.position.z = 100;
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

    const canvas2d = document.createElement("canvas");
    canvas2d.width = 1200;
    canvas2d.height = 1200;
    const ctx = canvas2d.getContext("2d");

    ctx.save();
    ctx.translate(600, 600);
    ctx.scale(3.4, 3.4);
    ctx.translate(-197.6 / 2, -277.3 / 2);

    function drawPoly(pts, strokeOrFill) {
      ctx.beginPath();
      const pairs = pts
        .trim()
        .split(/\s+/)
        .map((p) => p.split(",").map(Number));
      if (pairs.length > 0) {
        ctx.moveTo(pairs[0][0], pairs[0][1]);
        for (let i = 1; i < pairs.length; i++) {
          ctx.lineTo(pairs[i][0], pairs[i][1]);
        }
      }
      ctx.closePath();
      if (strokeOrFill === "stroke") ctx.stroke();
      else ctx.fill();
    }

    function drawRect(x, y, w, h, transformStr, strokeOrFill) {
      ctx.save();
      const match = transformStr.match(/matrix\(([^)]+)\)/);
      if (!match) {
        ctx.restore();
        return;
      }
      const m = match[1].split(" ").map(Number);
      ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      if (strokeOrFill === "stroke") ctx.stroke();
      else ctx.fill();
      ctx.restore();
    }

    ctx.lineWidth = 2;
    ctx.strokeStyle = "#D2EBFA";
    drawPoly("150.4,84.2 98.4,136.1 98.4,84.2", "stroke");
    drawPoly("151.6,31 99.6,83 151.6,83", "stroke");
    drawPoly("172.9,25.4 191.2,7 191.2,43.7", "stroke");
    drawRect(
      159,
      31.7,
      26,
      26,
      "matrix(0.7071 -0.7071 0.7071 0.7071 18.7894 134.6596)",
      "stroke",
    );
    drawPoly("152.6,45.6 171,63.9 152.6,82.3", "stroke");
    drawPoly("153.3,83.2 153.3,109.2 179.3,83.2 179.3,57.2", "stroke");
    drawPoly("189.5,7.1 152.8,7.1 152.8,43.9", "stroke");

    ctx.strokeStyle = "#F9A41F";
    drawPoly("45.9,192.8 97.8,140.9 97.8,192.8", "stroke");
    drawPoly("44.7,246 96.6,194 44.7,194", "stroke");
    drawPoly("23.3,251.6 5,270 5,233.3", "stroke");
    drawRect(
      11.3,
      219.3,
      26,
      26,
      "matrix(0.7071 -0.7071 0.7071 0.7071 -157.165 85.2154)",
      "stroke",
    );
    drawPoly("43.6,231.4 25.2,213 43.6,194.7", "stroke");
    drawPoly("42.9,193.8 42.9,167.8 16.9,193.8 16.9,219.7", "stroke");
    drawPoly("6.7,269.8 43.4,269.8 43.4,233.1", "stroke");

    ctx.restore();

    const imgData = ctx.getImageData(0, 0, 1200, 1200).data;
    const points = [];
    const step = 5;

    for (let y = 0; y < 1200; y += step) {
      for (let x = 0; x < 1200; x += step) {
        const index = (y * 1200 + x) * 4;
        if (imgData[index + 3] > 64) {
          points.push({
            baseX: (x - 600) * 0.05,
            baseY: -(y - 600) * 0.05,
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
