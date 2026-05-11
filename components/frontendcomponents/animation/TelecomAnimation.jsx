"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function TelecomAnimation({ id }) {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const scene = new THREE.Scene();

        const width = container.clientWidth;
        const height = container.clientHeight;
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.z = 85;

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
                x: sx * 0.25 - 34.98,
                y: -sy * 0.25 + 25.64,
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
            [
                [103.71, 131.28],
                [118.46, 116.54],
                [118.46, 146.03],
                [103.71, 131.28],
            ],
            [
                [73.57, 161.32],
                [88.31, 146.58],
                [103.05, 161.32],
                [73.57, 161.32],
            ],
            [
                [176.33, 131.24],
                [161.59, 116.5],
                [161.59, 145.99],
                [176.33, 160.73],
                [176.33, 131.24],
            ],
            [
                [176.77, 131.49],
                [176.77, 160.98],
                [206.26, 160.98],
                [176.77, 131.49],
            ],
            [
                [107.24, 79.03],
                [86.39, 79.03],
                [107.24, 58.18],
                [107.24, 79.03],
            ],
            [
                [200.72, 94.28],
                [185.98, 79.53],
                [215.47, 79.53],
                [200.72, 94.28],
            ],
            [
                [201.13, 94.66],
                [215.87, 79.91],
                [215.87, 109.4],
                [201.13, 94.66],
            ],
            [
                [231.12, 95.11],
                [216.38, 109.85],
                [216.38, 80.36],
                [231.12, 95.11],
            ],
            [
                [231.57, 95.4],
                [246.31, 110.14],
                [216.82, 110.14],
                [231.57, 95.4],
            ],
            [
                [129.29, 79.03],
                [129.29, 58.18],
                [150.14, 58.18],
                [129.29, 79.03],
            ],
            [
                [172.43, 58.18],
                [151.58, 58.18],
                [172.43, 79.03],
                [193.29, 79.03],
                [172.43, 58.18],
            ],
            [
                [194.02, 58.18],
                [173.17, 58.18],
                [194.02, 79.03],
                [214.87, 79.03],
                [194.02, 58.18],
            ],
            [
                [79.02, 94.28],
                [93.76, 79.53],
                [64.27, 79.53],
                [79.02, 94.28],
            ],
            [
                [78.61, 94.64],
                [63.87, 79.9],
                [63.87, 109.39],
                [78.61, 94.64],
            ],
            [
                [48.62, 95.11],
                [63.36, 109.85],
                [63.36, 80.36],
                [48.62, 95.11],
            ],
            [
                [48.26, 95.52],
                [33.51, 110.27],
                [63.0, 110.27],
                [48.26, 95.52],
            ],
            [
                [85.63, 58.18],
                [106.49, 58.18],
                [85.63, 79.03],
                [64.78, 79.03],
                [85.63, 58.18],
            ],
            [
                [171.71, 79.03],
                [150.86, 58.18],
                [130.0, 79.03],
                [171.71, 79.03],
            ],
            [
                [215.51, 0.0],
                [215.51, 20.85],
                [194.66, 20.85],
                [215.51, 0.0],
            ],
            [
                [171.59, 20.85],
                [150.74, 20.85],
                [150.74, 0.0],
                [171.59, 20.85],
            ],
            [
                [258.47, 20.85],
                [237.62, 20.85],
                [237.62, 0.0],
                [258.47, 20.85],
            ],
            [
                [172.24, 20.85],
                [193.09, 20.85],
                [172.24, 0.0],
                [151.39, 0.0],
                [172.24, 20.85],
            ],
            [
                [258.97, 42.23],
                [279.82, 42.23],
                [258.97, 21.38],
                [238.12, 21.38],
                [258.97, 42.23],
            ],
            [
                [21.25, 20.85],
                [42.1, 20.85],
                [42.1, 0.0],
                [21.25, 20.85],
            ],
            [
                [20.85, 42.2],
                [0.0, 42.2],
                [20.85, 21.35],
                [41.7, 21.35],
                [20.85, 42.2],
            ],
            [
                [172.98, 0.0],
                [193.83, 20.85],
                [214.68, 0.0],
                [172.98, 0.0],
            ],
            [
                [128.79, 0.03],
                [128.79, 20.88],
                [107.93, 20.88],
                [128.79, 0.03],
            ],
            [
                [84.92, 20.85],
                [64.07, 20.85],
                [64.07, 0.0],
                [84.92, 20.85],
            ],
            [
                [85.61, 20.85],
                [106.46, 20.85],
                [85.61, 0.0],
                [64.76, 0.0],
                [85.61, 20.85],
            ],
            [
                [86.38, 0.0],
                [107.23, 20.85],
                [128.08, 0.0],
                [86.38, 0.0],
            ],
            [
                [88.62, 146.33],
                [103.37, 131.58],
                [118.11, 146.33],
                [103.37, 161.07],
            ],
            [
                [118.93, 116.5],
                [139.78, 116.5],
                [139.78, 137.35],
                [118.93, 137.35],
            ],
            [
                [140.21, 116.5],
                [161.06, 116.5],
                [161.06, 137.35],
                [140.21, 137.35],
            ],
            [
                [107.87, 58.18],
                [128.72, 58.18],
                [128.72, 79.03],
                [107.87, 79.03],
            ],
            [
                [129.36, 0.0],
                [150.21, 0.0],
                [150.21, 20.85],
                [129.36, 20.85],
            ],
            [
                [216.15, 0.0],
                [237.0, 0.0],
                [237.0, 20.85],
                [216.15, 20.85],
            ],
            [
                [42.69, 0.0],
                [63.54, 0.0],
                [63.54, 20.85],
                [42.69, 20.85],
            ],
            [
                [129.49, 184.25],
                [150.34, 184.25],
                [150.34, 205.1],
                [129.49, 205.1],
            ],
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
