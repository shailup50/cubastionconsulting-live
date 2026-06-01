"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const ROCK_PATH =
  "M597.6,1878.7l11.1-15.3,201.3-272.3,94.9-128.1,40.9-.3-20.6-19.8-37.6-34.5-106.5-142.2-18.9-24.7-28.8-179.2,26.6-53.6,144.2-52.8-94.3-67.7,14.2-88.1,81.1-106.1,97.2-28.4-186.2-17.4-18.5-1.3c-.9,0-1.9-2.6-1.7-3.7l73-186.9h83.3l-78.5-138.1,80.7-141.6,70.3-11.6,68.8,11.6,80.8,141.8-78.3,137.8,83.1.2,73.3,187.5c-.8,2.2-2,3.2-3.4,3.3l-39.7,3.6-102.3,10.3-1.6,1.1,27.9,30,99.2,108.3-5.9,107.5-60.3,115.6c-1.1,1.5-3,2-4.9,1.6l-57.8-19.1,100,103.4.4,225.6-96.8,127.7,36.4.3,274.9,371.7,33.7,46.4-.9,3.3h-842.8l-10.3-.2c-1.4,0-1.3-4-.4-5.1l-.3-.5ZM1052.8,175.7l-28.8-5.1-28.2,5h57ZM1088.3,181.5h-126.7l60.2,130.4,66.5-130.4ZM1018.2,316l-60.9-132.4-18.1,31.9-57.5,100.6h136.5ZM1166.3,316l-74.4-130.5-66.7,130.5h141.1ZM1090.4,453.5l76-133.8h-142.4l66.4,133.8ZM1019.2,319.8h-137.3l75.3,132.6,62-132.6ZM1086.3,456l-64.6-129.8-60.8,129.8h125.4ZM1121.6,642l52.9-180.1h-300.6l52.9,180.1h194.8,0ZM923.1,642l-51.6-175.7-68.6,175.8h120.2,0ZM1245.3,641.9l-68.4-175-51.7,175.2,120.1-.2ZM1018.4,661.1l52.2-15.9h-215.7l137.6,13.3,25.9,2.6h0ZM1199.1,645.3l-108.5-.2,9.5,10.5,99-10.3ZM816.7,883.8l245.9-66.5,61.2-81.2-39.2-88.1-66.4,19.3-109.4,31.7-79.2,103.6-12.9,81.2h0ZM1214.9,790.1l-69.1-75.9-52.1-54.9,34,76.5,87.2,54.3h0ZM1221,905.6l5.4-103.5-100.2-63-60.4,80.1,96.5,198.3,58.7-111.8h0ZM959.4,937.3l131.1,57.2,67.8,22.9-95.6-196.5-243.3,65.8,132.4,51.3c2.8-.7,4.5-.9,7.6-.8h0ZM946.7,940l-115.1-44.4,79.3,57.5,35.9-13.2h-.1ZM963.2,1316.9l47.4-289-53.7-84.7-148.7,209,92.3,98.1,62.6,66.6h.1ZM739.9,1063.2l66,86.2,145.3-204.5-186.8,68.3-24.5,50ZM1191.2,1105.1l-100.3-104-128-55.7,51.3,81.2,177.1,78.5h0ZM1099.9,1461.7l97.9-129.1-.6-220.9-183.2-81.4-16.5,99.4-31.1,190.5,133.4,141.5h0ZM803.9,1152.8l-63-82.2,26,161.6,36.9-79.3h0ZM951.9,1460l10.5-138.1-32.4-35.1-123.6-131.2-38.4,83,123.3,164.8,37.8,35.3,22.7,21.3h.1ZM1095.6,1462.6l-129.8-137.7-10.3,137.9,140.1-.2h0ZM922.7,1694.6l98.1-226h-18l-94.4.2,14.3,225.8h0ZM1129.5,1634.3l10.2-165.6-112.5-.2,97.9,225.1,4.4-59.2h0ZM1439.2,1873.6l-128.5-174.3-164.2-222.4-3.5-3.8-14.4,228.9,135,74.5,175.7,97.1h0ZM919,1702.6l-1.8-36.7-12.2-193-295.9,400.4,73.3-39.9,236.6-130.8ZM1022.1,1646l-.3-170.5-97,223.7,97.3-53.2ZM1123.3,1699l-97.2-223.6-.2,170.5,97.4,53.1h0ZM1124.3,1703.8l-98.4-53.7.2,223.7,98.2-170h0ZM1021.9,1873.4v-223.1l-98,53.9,98,169.2ZM835.5,1878.7h151.4l33.5-.4-99.6-172.5-274.2,151.6-38.3,21.3h227.2,0ZM1439.5,1878.4l-114.3-63.6-197.7-109.3-99.8,173.1,386,.3,25.8-.4h0Z";

const CANVAS_SIZE = 1200;
const CANVAS_CENTER = CANVAS_SIZE / 2;
const SVG_CENTER = 1024;
const SVG_TO_CANVAS_SCALE = 0.55;
const PARTICLE_WORLD_SCALE = 0.048;
const EDGE_STEP = 4;

const createCircleTexture = () => {
  const canvas = document.createElement("canvas");
  const size = 64;
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();

  return new THREE.CanvasTexture(canvas);
};

const svgPointToWorld = (point) => ({
  baseX: (point.x - SVG_CENTER) * SVG_TO_CANVAS_SCALE * PARTICLE_WORLD_SCALE,
  baseY: -(point.y - SVG_CENTER) * SVG_TO_CANVAS_SCALE * PARTICLE_WORLD_SCALE,
  baseZ: (Math.random() - 0.5) * 4,
});

export default function RockAnimation({
  id,
  centered = false,
  strayCount = 280,
  bigStrayCount = 46,
  straySpreadX = 155,
  straySpreadY = 100,
  straySpreadZ = 50,
}) {
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
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    container.appendChild(renderer.domElement);

    const canvas2d = document.createElement("canvas");
    canvas2d.width = CANVAS_SIZE;
    canvas2d.height = CANVAS_SIZE;
    const ctx = canvas2d.getContext("2d");
    if (!ctx) return;

    const rockPath = new Path2D(ROCK_PATH);

    ctx.save();
    ctx.translate(CANVAS_CENTER, CANVAS_CENTER);
    ctx.scale(SVG_TO_CANVAS_SCALE, SVG_TO_CANVAS_SCALE);
    ctx.translate(-SVG_CENTER, -SVG_CENTER);
    ctx.lineWidth = 20;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000";
    ctx.stroke(rockPath);
    ctx.restore();

    const points = [];
    const imageData = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE).data;
    const step = 4;

    for (let y = 0; y < CANVAS_SIZE; y += step) {
      for (let x = 0; x < CANVAS_SIZE; x += step) {
        const index = (y * CANVAS_SIZE + x) * 4;
        if (imageData[index + 3] > 64) {
          points.push({
            baseX: (x - CANVAS_CENTER) * PARTICLE_WORLD_SCALE,
            baseY: -(y - CANVAS_CENTER) * PARTICLE_WORLD_SCALE,
            baseZ: (Math.random() - 0.5) * 4,
          });
        }
      }
    }

    const svgPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    );
    svgPath.setAttribute("d", ROCK_PATH);
    const pathLength = svgPath.getTotalLength();
    for (let i = 0; i < pathLength; i += EDGE_STEP) {
      points.push(svgPointToWorld(svgPath.getPointAtLength(i)));
    }

    const shapePointCount = points.length;
    for (let i = 0; i < strayCount; i++) {
      points.push({
        baseX: (Math.random() - 0.5) * straySpreadX,
        baseY: (Math.random() - 0.5) * straySpreadY,
        baseZ: (Math.random() - 0.5) * straySpreadZ,
        isStray: true,
      });
    }

    const bigStrayPoints = Array.from({ length: bigStrayCount }, () => ({
      baseX: (Math.random() - 0.5) * straySpreadX,
      baseY: (Math.random() - 0.5) * straySpreadY,
      baseZ: (Math.random() - 0.5) * straySpreadZ,
    }));

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(points.length * 3);
    const basePositions = new Float32Array(points.length * 3);
    const velocities = new Float32Array(points.length * 3);
    const strayMotion = new Float32Array(points.length * 4);

    points.forEach((point, index) => {
      positions[index * 3] = point.baseX + (Math.random() - 0.5) * 800;
      positions[index * 3 + 1] = point.baseY + (Math.random() - 0.5) * 800;
      positions[index * 3 + 2] = point.baseZ + (Math.random() - 0.5) * 800;

      basePositions[index * 3] = point.baseX;
      basePositions[index * 3 + 1] = point.baseY;
      basePositions[index * 3 + 2] = point.baseZ;

      if (point.isStray) {
        strayMotion[index * 4] = Math.random() * Math.PI * 2;
        strayMotion[index * 4 + 1] = 0.35 + Math.random() * 0.85;
        strayMotion[index * 4 + 2] = 0.8 + Math.random() * 2.2;
        strayMotion[index * 4 + 3] = 0.8 + Math.random() * 2.6;
      }
    });

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute(
      "basePosition",
      new THREE.BufferAttribute(basePositions, 3),
    );
    geometry.setAttribute("velocity", new THREE.BufferAttribute(velocities, 3));

    const dotTexture = createCircleTexture();
    const material = new THREE.PointsMaterial({
      color: 0x052559,
      size: 1.1,
      map: dotTexture,
      transparent: true,
      opacity: 0.98,
      // alphaTest: 0.4,
      // depthWrite: false,
    });

    const particleSystem = new THREE.Points(geometry, material);

    const bigGeometry = new THREE.BufferGeometry();
    const bigPositions = new Float32Array(bigStrayPoints.length * 3);
    const bigBasePositions = new Float32Array(bigStrayPoints.length * 3);
    const bigVelocities = new Float32Array(bigStrayPoints.length * 3);
    const bigStrayMotion = new Float32Array(bigStrayPoints.length * 4);

    bigStrayPoints.forEach((point, index) => {
      bigPositions[index * 3] = point.baseX + (Math.random() - 0.5) * 800;
      bigPositions[index * 3 + 1] = point.baseY + (Math.random() - 0.5) * 800;
      bigPositions[index * 3 + 2] = point.baseZ + (Math.random() - 0.5) * 800;

      bigBasePositions[index * 3] = point.baseX;
      bigBasePositions[index * 3 + 1] = point.baseY;
      bigBasePositions[index * 3 + 2] = point.baseZ;

      bigStrayMotion[index * 4] = Math.random() * Math.PI * 2;
      bigStrayMotion[index * 4 + 1] = 0.25 + Math.random() * 0.65;
      bigStrayMotion[index * 4 + 2] = 1.3 + Math.random() * 3.1;
      bigStrayMotion[index * 4 + 3] = 1.3 + Math.random() * 3.5;
    });

    bigGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(bigPositions, 3),
    );
    bigGeometry.setAttribute(
      "basePosition",
      new THREE.BufferAttribute(bigBasePositions, 3),
    );
    bigGeometry.setAttribute(
      "velocity",
      new THREE.BufferAttribute(bigVelocities, 3),
    );

    const bigMaterial = new THREE.PointsMaterial({
      color: 0x052559,
      size: 1.9,
      map: dotTexture,
      transparent: true,
      opacity: 0.92,
    });

    const bigParticleSystem = new THREE.Points(bigGeometry, bigMaterial);
    const particleGroup = new THREE.Group();
    particleGroup.add(particleSystem);
    particleGroup.add(bigParticleSystem);
    scene.add(particleGroup);

    const baseBounds = (() => {
      const baseAttr = geometry.attributes.basePosition;
      let minX = Infinity;
      let minY = Infinity;
      let minZ = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      let maxZ = -Infinity;

      for (let i = 0; i < shapePointCount; i++) {
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

      const viewportWidth = window.innerWidth;

      if (viewportWidth <= 768) {
        camera.position.set(0, -20, 120);
      } else {
        camera.position.set(-15, 0, 200);
      }

      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      const vFov = (camera.fov * Math.PI) / 180;
      const visibleHeight = 2 * Math.tan(vFov / 2) * camera.position.z;
      const visibleWidth = visibleHeight * camera.aspect;

      let targetW = visibleWidth * 0.5;
      let targetH = visibleHeight;
      let xShift = centered ? 0 : visibleWidth * 0.18;
      let yShift = 0;

      if (viewportWidth <= 540) {
        targetW = visibleWidth * 0.76;
        targetH = visibleHeight * 0.72;
        xShift = 0;
        yShift = 0;
      } else if (viewportWidth <= 768) {
        targetW = visibleWidth * 0.78;
        targetH = visibleHeight * 0.72;
        xShift = 0;
        yShift = 0;
      } else if (viewportWidth <= 1170) {
        targetW = visibleWidth * 0.6;
        targetH = visibleHeight * 0.8;
        xShift = centered ? 0 : visibleWidth * 0.2;
      }

      const fitScale = Math.min(
        targetW / baseBounds.sizeX,
        targetH / baseBounds.sizeY,
      );
      const shapeScale = fitScale * 1.05;
      const yScale = shapeScale * 0.86;

      particleGroup.scale.set(shapeScale, yScale, shapeScale);
      particleGroup.position.set(
        -baseBounds.centerX * shapeScale + xShift,
        -baseBounds.centerY * yScale + yShift,
        -baseBounds.centerZ * shapeScale,
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
              const positionAttr = geometry.attributes.position;
              for (let i = 0; i < shapePointCount; i++) {
                positionAttr.setXYZ(
                  i,
                  positionAttr.getX(i) + (Math.random() - 0.5) * 800,
                  positionAttr.getY(i) + (Math.random() - 0.5) * 800,
                  positionAttr.getZ(i) + (Math.random() - 0.5) * 800,
                );
              }
              positionAttr.needsUpdate = true;
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
      renderer.setSize(container.clientWidth || 1, container.clientHeight || 1);
      applyResponsiveLayout();
    });
    resizeObserver.observe(container);
    window.addEventListener("resize", applyResponsiveLayout);

    const clock = new THREE.Clock();
    let rafId;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      particleGroup.rotation.y = Math.sin(elapsedTime * 0.3) * 0.15;
      particleGroup.rotation.x = Math.sin(elapsedTime * 0.2) * 0.05;

      raycaster.setFromCamera(mouse, camera);
      raycaster.ray.intersectPlane(plane, mouse3D);

      const posAttr = geometry.attributes.position;
      const baseAttr = geometry.attributes.basePosition;
      const velAttr = geometry.attributes.velocity;
      const repelRadius = 16;
      const forceMagnitude = 1.2;
      const friction = 0.88;
      const spring = 0.02;
      const straySpring = 0.008;
      const localMouse = mouse3D.clone();
      particleGroup.worldToLocal(localMouse);

      for (let i = 0; i < posAttr.count; i++) {
        const isStray = i >= shapePointCount;
        const px = posAttr.getX(i);
        const py = posAttr.getY(i);
        const pz = posAttr.getZ(i);
        let bx = baseAttr.getX(i);
        let by = baseAttr.getY(i);
        let bz = baseAttr.getZ(i);

        let vx = velAttr.getX(i);
        let vy = velAttr.getY(i);
        let vz = velAttr.getZ(i);

        if (isStray) {
          const phase = strayMotion[i * 4];
          const speed = strayMotion[i * 4 + 1];
          const driftX = strayMotion[i * 4 + 2];
          const driftY = strayMotion[i * 4 + 3];

          bx += Math.sin(elapsedTime * speed + phase) * driftX;
          by += Math.cos(elapsedTime * speed * 0.8 + phase) * driftY;
          bz += Math.sin(elapsedTime * speed * 0.55 + phase) * 1.4;
        }

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

        const floatY = Math.sin(elapsedTime * 1.5 + bx * 0.5) * 0.2;
        const activeSpring = isStray ? straySpring : spring;

        vx += (bx - px) * activeSpring;
        vy += (by + floatY - py) * activeSpring;
        vz += (bz - pz) * activeSpring;
        vx *= friction;
        vy *= friction;
        vz *= friction;

        velAttr.setXYZ(i, vx, vy, vz);
        posAttr.setXYZ(i, px + vx, py + vy, pz + vz);
      }

      posAttr.needsUpdate = true;

      const bigPosAttr = bigGeometry.attributes.position;
      const bigBaseAttr = bigGeometry.attributes.basePosition;
      const bigVelAttr = bigGeometry.attributes.velocity;
      const bigSpring = 0.006;

      for (let i = 0; i < bigPosAttr.count; i++) {
        const px = bigPosAttr.getX(i);
        const py = bigPosAttr.getY(i);
        const pz = bigPosAttr.getZ(i);
        const phase = bigStrayMotion[i * 4];
        const speed = bigStrayMotion[i * 4 + 1];
        const driftX = bigStrayMotion[i * 4 + 2];
        const driftY = bigStrayMotion[i * 4 + 3];
        const bx =
          bigBaseAttr.getX(i) + Math.sin(elapsedTime * speed + phase) * driftX;
        const by =
          bigBaseAttr.getY(i) +
          Math.cos(elapsedTime * speed * 0.75 + phase) * driftY;
        const bz =
          bigBaseAttr.getZ(i) +
          Math.sin(elapsedTime * speed * 0.5 + phase) * 1.8;

        let vx = bigVelAttr.getX(i);
        let vy = bigVelAttr.getY(i);
        let vz = bigVelAttr.getZ(i);

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

        vx += (bx - px) * bigSpring;
        vy += (by - py) * bigSpring;
        vz += (bz - pz) * bigSpring;
        vx *= friction;
        vy *= friction;
        vz *= friction;

        bigVelAttr.setXYZ(i, vx, vy, vz);
        bigPosAttr.setXYZ(i, px + vx, py + vy, pz + vz);
      }

      bigPosAttr.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", applyResponsiveLayout);
      observer.disconnect();
      resizeObserver.disconnect();
      renderer.dispose();
      geometry.dispose();
      bigGeometry.dispose();
      material.dispose();
      bigMaterial.dispose();
      dotTexture?.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [
    centered,
    strayCount,
    bigStrayCount,
    straySpreadX,
    straySpreadY,
    straySpreadZ,
  ]);

  return (
    <div
      ref={containerRef}
      id={String(id)}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
