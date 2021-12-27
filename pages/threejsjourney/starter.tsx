import type { NextPage } from "next";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import CanvasContainer from "../../components/canvas-container";

const Starter: NextPage = () => {
  // Canvas
  const canvas = useRef<HTMLDivElement>(null);

  // Sizes
  const sizes = {
    width: 1000,
    height: 600,
  };

  // Scene
  const scene = new THREE.Scene();

  // Base camera
  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
  );
  camera.position.x = 4;
  camera.position.y = 2;
  camera.position.z = 5;
  scene.add(camera);

  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);

  // Ambient light
  const ambientLight = new THREE.AmbientLight("#ffffff", 1);
  scene.add(ambientLight);

  // Cube
  const cube = new THREE.Mesh(
    new THREE.BoxBufferGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({ color: "#ff00ff", wireframe: true })
  );

  scene.add(cube);

  useEffect(() => {
    if (canvas.current !== null) {
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor("#262837");

      renderer.render(scene, camera);

      // Controls
      const controls = new OrbitControls(
        camera,
        canvas.current.appendChild(renderer.domElement)
      );
      controls.enableDamping = true;

      const tick = () => {
        // Update controls
        controls.update();

        // Render
        renderer.render(scene, camera);

        // Call tick again on the next frame
        window.requestAnimationFrame(tick);
      };

      tick();
    }
  });
  return (
    <CanvasContainer>
      <div ref={canvas}></div>
    </CanvasContainer>
  );
};

export default Starter;
