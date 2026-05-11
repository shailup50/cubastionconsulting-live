"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function AutomotiveAnimation({ id }) {
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
        const spacing = 0.15;

        function svgTo3D(sx, sy) {
            return {
                x: sx * 0.5 - 22,
                y: -sy * 0.5 + 19.5,
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

        function addPolygon(pts) {
            for (let i = 0; i < pts.length - 1; i++) {
                addLine(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1]);
            }

            addLine(
                pts[pts.length - 1][0],
                pts[pts.length - 1][1],
                pts[0][0],
                pts[0][1]
            );
        }

        addPolygon([
            [0, 3.19],
            [42.06, 45.25],
            [0, 45.25],
        ]);
        addPolygon([
            [1.15, 3.19],
            [43.21, 45.25],
            [43.21, 3.19],
        ]);
        addPolygon([
            [58.97, 47.41],
            [73.84, 62.28],
            [44.1, 62.28],
        ]);
        addPolygon([
            [73.38, 63.17],
            [58.51, 78.04],
            [43.64, 63.17],
        ]);
        addPolygon([
            [58.74, 30.38],
            [43.87, 45.25],
            [73.61, 45.25],
            [88.48, 30.38],
        ]);
        addPolygon([
            [58.74, 0],
            [58.74, 29.74],
            [88.48, 29.74],
        ]);

        function transformRectPoint(x, y) {
            const rad = (-45 * Math.PI) / 180;
            const cos = Math.cos(rad);
            const sin = Math.sin(rad);
            const rx = x * cos - y * sin;
            const ry = x * sin + y * cos;

            return [rx - 39.35, ry + 29.57];
        }

        const r1 = transformRectPoint(5.5, 51.77);
        const r2 = transformRectPoint(26.53, 51.77);
        const r3 = transformRectPoint(26.53, 72.8);
        const r4 = transformRectPoint(5.5, 72.8);
        addPolygon([r1, r2, r3, r4]);

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
