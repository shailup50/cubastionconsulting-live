"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function AppliancesAnimation({ id }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();

    const width = container.clientWidth;
    const height = container.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 92;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";

    const points = [];
    const spacing = 0.08;

    function svgTo3D(sx, sy) {
      return {
        x: sx * 0.25 - 37.28,
        y: -sy * 0.25 + 35.08,
      };
    }

    function addLine(sx1, sy1, sx2, sy2) {
      const p1 = svgTo3D(sx1, sy1);
      const p2 = svgTo3D(sx2, sy2);

      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      const numParticles = Math.max(1, Math.floor(length / spacing));

      for (let i = 0; i < numParticles; i++) {
        const t = i / numParticles;
        points.push({
          baseX: p1.x + dx * t,
          baseY: p1.y + dy * t,
          baseZ: (Math.random() - 0.5) * 4,
        });
      }
    }

    function shrinkPolygon(pts, factor) {
      let cx = 0;
      let cy = 0;

      for (let i = 0; i < pts.length; i++) {
        cx += pts[i][0];
        cy += pts[i][1];
      }

      cx /= pts.length;
      cy /= pts.length;

      const newPts = [];
      for (let i = 0; i < pts.length; i++) {
        newPts.push([
          cx + (pts[i][0] - cx) * factor,
          cy + (pts[i][1] - cy) * factor,
        ]);
      }

      return newPts;
    }

    function addPolygon(pts) {
      const shrunkPts = shrinkPolygon(pts, 0.92);

      for (let i = 0; i < shrunkPts.length - 1; i++) {
        addLine(
          shrunkPts[i][0],
          shrunkPts[i][1],
          shrunkPts[i + 1][0],
          shrunkPts[i + 1][1]
        );
      }

      addLine(
        shrunkPts[shrunkPts.length - 1][0],
        shrunkPts[shrunkPts.length - 1][1],
        shrunkPts[0][0],
        shrunkPts[0][1]
      );
    }

    [
      [[128.67, 27.14], [155.81, 0.0], [155.81, 27.14], [128.67, 27.14]],
      [[128.67, 41.89], [155.81, 69.04], [155.81, 41.89], [128.67, 41.89]],
      [[156.44, 27.76], [170.02, 27.76], [156.44, 41.33], [156.44, 27.76]],
      [[128.08, 27.74], [141.65, 27.74], [141.65, 41.32], [128.08, 27.74]],
      [[127.29, 41.32], [140.87, 41.32], [127.29, 27.74], [113.72, 27.74], [127.29, 41.32]],
      [[127.96, 69.22], [141.53, 55.65], [127.96, 42.08], [127.96, 69.22]],
      [[271.13, 107.43], [298.27, 134.57], [271.13, 134.57], [271.13, 107.43]],
      [[256.38, 107.43], [229.23, 134.57], [256.38, 134.57], [256.38, 107.43]],
      [[270.51, 135.2], [270.51, 148.78], [256.94, 135.2], [270.51, 135.2]],
      [[270.53, 106.84], [270.53, 120.41], [256.96, 120.41], [270.53, 106.84]],
      [[256.96, 106.05], [256.96, 119.63], [270.53, 106.05], [270.53, 92.48], [256.96, 106.05]],
      [[229.05, 106.72], [242.62, 120.29], [256.19, 106.72], [229.05, 106.72]],
      [[230.14, 242.3], [230.14, 280.69], [210.95, 261.49], [230.14, 242.3]],
      [[219.71, 231.87], [181.32, 231.87], [200.52, 251.06], [219.71, 231.87]],
      [[210.06, 261.5], [200.47, 271.1], [200.47, 251.91], [210.06, 261.5]],
      [[230.13, 241.46], [220.53, 251.05], [210.94, 241.46], [230.13, 241.46]],
      [[221.09, 231.31], [211.49, 240.9], [230.69, 240.9], [240.28, 231.31], [221.09, 231.31]],
      [[200.88, 212.04], [200.88, 231.24], [220.08, 231.24], [200.88, 212.04]],
      [[80.17, 259.46], [53.03, 232.31], [80.17, 232.31], [80.17, 259.46]],
      [[94.92, 259.46], [122.07, 232.31], [94.92, 232.31], [94.92, 259.46]],
      [[80.79, 231.68], [80.79, 218.11], [94.36, 231.68], [80.79, 231.68]],
      [[80.77, 260.05], [80.77, 246.47], [94.35, 246.47], [80.77, 260.05]],
      [[94.35, 260.83], [94.35, 247.26], [80.77, 260.83], [80.77, 274.4], [94.35, 260.83]],
      [[122.25, 260.16], [108.68, 246.59], [95.11, 260.16], [122.25, 260.16]],
      [[10.14, 129.79], [10.14, 91.4], [29.34, 110.59], [10.14, 129.79]],
      [[20.57, 140.22], [58.96, 140.22], [39.77, 121.02], [20.57, 140.22]],
      [[30.22, 110.58], [39.82, 100.98], [39.82, 120.18], [30.22, 110.58]],
      [[10.15, 130.63], [19.75, 121.03], [29.34, 130.63], [10.15, 130.63]],
      [[19.19, 140.78], [28.79, 131.18], [9.6, 131.18], [0.0, 140.78], [19.19, 140.78]],
      [[39.4, 160.04], [39.4, 140.85], [20.2, 140.85], [39.4, 160.04]],
      [[108.42, 146.26], [167.9, 146.26], [138.16, 116.52], [108.42, 146.26]],
      [[168.82, 125.2], [147.79, 125.2], [168.82, 146.22], [189.85, 146.22], [168.82, 125.2]],
      [[179.11, 176.81], [119.63, 176.81], [149.37, 147.07], [179.11, 176.81]],
      [[133.1, 162.29], [118.23, 177.16], [118.23, 147.42], [133.1, 162.29]],
      [[148.43, 146.92], [133.56, 161.79], [118.69, 146.92], [148.43, 146.92]],
      [[180.04, 176.66], [180.04, 146.92], [150.3, 146.92], [180.04, 176.66]],
      [[142.24, 27.74], [155.81, 27.74], [155.81, 41.31], [142.24, 41.31]],
      [[256.96, 121.0], [270.53, 121.0], [270.53, 134.57], [256.96, 134.57]],
      [[200.91, 251.47], [210.51, 241.87], [220.1, 251.47], [210.51, 261.06]],
      [[80.77, 232.31], [94.34, 232.31], [94.34, 245.88], [80.77, 245.88]],
      [[20.17, 120.61], [29.76, 111.02], [39.36, 120.61], [29.76, 130.21]],
      [[147.79, 103.52], [168.82, 103.52], [168.82, 124.55], [147.79, 124.55]],
    ].forEach(addPolygon);

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
    geometry.setAttribute("basePosition", new THREE.BufferAttribute(basePositions, 3));
    geometry.setAttribute("velocity", new THREE.BufferAttribute(velocities, 3));

    const material = new THREE.PointsMaterial({
      color: 0x275b70,
      size: 0.5,
      transparent: true,
      opacity: 0.9,
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

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
                    pos.getZ(i) + (Math.random() - 0.5) * 800
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
      { threshold: 0.1 }
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

      const posAttribute = geometry.attributes.position;
      const baseAttribute = geometry.attributes.basePosition;
      const velAttribute = geometry.attributes.velocity;

      const repelRadius = 16;
      const forceMagnitude = 1.2;
      const friction = 0.88;
      const spring = 0.03;

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
          const force = Math.pow((repelRadius - dist) / repelRadius, 2);

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
