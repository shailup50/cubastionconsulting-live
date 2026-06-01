"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ConnectedAnimation({ id }) {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const scene = new THREE.Scene();

        const width = container.clientWidth;
        const height = container.clientHeight;
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.z = 80;

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
                x: sx * 0.2 - 22.89,
                y: -sy * 0.2 + 32.23,
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
            [[144.21, 29.74], [84.73, 29.74], [114.47, 0.0], [144.21, 29.74]],
            [[124.98, 51.88], [124.98, 72.91], [103.95, 51.88], [124.98, 51.88]],
            [[124.98, 73.45], [103.95, 73.45], [103.95, 52.42], [124.98, 73.45]],
            [[144.21, 292.61], [84.73, 292.61], [114.47, 322.35], [144.21, 292.61]],
            [[124.98, 270.47], [124.98, 249.44], [103.95, 270.47], [124.98, 270.47]],
            [[124.98, 248.9], [103.95, 248.9], [103.95, 269.93], [124.98, 248.9]],
            [[110.84, 158.81], [110.84, 218.29], [140.59, 188.55], [110.84, 158.81]],
            [[110.84, 157.75], [110.84, 98.27], [140.59, 128.01], [110.84, 157.75]],
            [[88.35, 180.61], [88.35, 201.64], [109.38, 180.61], [109.38, 159.58], [88.35, 180.61]],
            [[109.38, 136.72], [88.35, 136.72], [109.38, 157.75], [109.38, 136.72]],
            [[88.35, 115.1], [88.35, 136.13], [109.38, 136.13], [88.35, 115.1]],
            [[0.0, 55.21], [59.65, 55.21], [29.83, 25.39], [0.0, 55.21]],
            [[39.42, 77.35], [18.33, 77.35], [39.42, 98.43], [39.42, 77.35]],
            [[60.89, 98.82], [60.89, 119.91], [39.8, 98.82], [39.8, 77.73], [60.89, 98.82]],
            [[0.0, 267.13], [59.65, 267.13], [29.83, 296.96], [0.0, 267.13]],
            [[39.42, 245.0], [18.33, 245.0], [39.42, 223.91], [39.42, 245.0]],
            [[60.89, 223.53], [60.89, 202.44], [39.8, 223.53], [39.8, 244.62], [60.89, 223.53]],
            [[228.94, 267.13], [169.29, 267.13], [199.11, 296.96], [228.94, 267.13]],
            [[189.52, 245.0], [210.61, 245.0], [189.52, 223.91], [189.52, 245.0]],
            [[168.04, 223.53], [168.04, 202.44], [189.13, 223.53], [189.13, 244.62], [168.04, 223.53]],
            [[228.94, 55.21], [169.29, 55.21], [199.11, 25.39], [228.94, 55.21]],
            [[189.52, 77.35], [210.61, 77.35], [189.52, 98.43], [189.52, 77.35]],
            [[168.04, 98.82], [168.04, 119.91], [189.13, 98.82], [189.13, 77.73], [168.04, 98.82]],
            [[103.95, 30.29], [124.98, 30.29], [124.98, 51.32], [103.95, 51.32]],
            [[103.95, 271.03], [124.98, 271.03], [124.98, 292.06], [103.95, 292.06]],
            [[18.36, 55.81], [39.45, 55.81], [39.45, 76.9], [18.36, 76.9]],
            [[18.36, 245.45], [39.45, 245.45], [39.45, 266.54], [18.36, 266.54]],
            [[189.49, 245.45], [210.58, 245.45], [210.58, 266.54], [189.49, 266.54]],
            [[189.49, 55.81], [210.58, 55.81], [210.58, 76.9], [189.49, 76.9]],
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
            color: 0x052559,
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
