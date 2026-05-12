"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function PublicAnimation({ id }) {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const scene = new THREE.Scene();

        const width = container.clientWidth;
        const height = container.clientHeight;
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.z = 80;
        camera.position.x = -15;

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
                x: sx * 0.5 - 30.25,
                y: -sy * 0.5 + 22.12,
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
            [[49.99, 45.84], [71.02, 45.84], [71.02, 66.87], [49.99, 66.87]],
            [[61.54, 45.22], [121.02, 45.22], [91.28, 15.48]],
            [[59.48, 45.22], [0, 45.22], [29.74, 15.48]],
            [[60.79, 15.48], [75.66, 0.61], [75.66, 30.35], [60.79, 45.22]],
            [[60.21, 14.87], [45.34, 0], [75.08, 0]],
            [[60.21, 45.22], [45.34, 30.35], [60.21, 15.48]],
            [[81.54, 88.51], [60.51, 67.48], [39.48, 88.51]],
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
