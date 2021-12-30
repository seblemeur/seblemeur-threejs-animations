import type { NextPage } from "next";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import CanvasContainer from "../../components/canvas-container";

const HamburgerWithBlender: NextPage = () => {
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
  camera.position.set(-12, 14, 1);
  scene.add(camera);

  /**
   * Lights
   */
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.set(1024, 1024);
  directionalLight.shadow.camera.far = 15;
  directionalLight.shadow.camera.left = -7;
  directionalLight.shadow.camera.top = 7;
  directionalLight.shadow.camera.right = 7;
  directionalLight.shadow.camera.bottom = -7;
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  /**
   * Models
   */
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");

  const gltfLoader = new GLTFLoader();
  gltfLoader.setDRACOLoader(dracoLoader);

  let mixer = null;
  let sceneBurger: any = null;

  gltfLoader.load("/models/hamburger.glb", (gltf) => {
    sceneBurger = gltf.scene;
    scene.add(gltf.scene);
  });

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

        if (sceneBurger !== null) {
          sceneBurger.rotation.y -= 0.003;
        }

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

export default HamburgerWithBlender;
