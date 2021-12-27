import type { NextPage } from "next";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import CanvasContainer from "../../components/canvas-container";

const MiniFactory: NextPage = () => {
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
  camera.position.x = 7;
  camera.position.y = 3;
  camera.position.z = 5;
  scene.add(camera);

  // Ambient light
  const ambientLight = new THREE.AmbientLight("#ffffff", 1);
  scene.add(ambientLight);

  // Directional light
  const sunLight = new THREE.DirectionalLight("#fff", 1);
  sunLight.position.set(4, 5, -2);
  sunLight.castShadow = true;
  const directionalLightHelper = new THREE.DirectionalLightHelper(
    sunLight,
    0.2
  );
  scene.add(directionalLightHelper);
  scene.add(sunLight);

  // global floor
  const globalFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ color: "#1a4ce0" })
  );
  globalFloor.rotation.x = -Math.PI * 0.5;
  globalFloor.position.y = 0;
  globalFloor.castShadow = true;
  globalFloor.receiveShadow = true;
  scene.add(globalFloor);

  // factory floor
  const factoryFloorHeight = 0.25;
  const factoryFloor = new THREE.Mesh(
    new RoundedBoxGeometry(4, factoryFloorHeight, 3, 6, 2),
    new THREE.MeshStandardMaterial({ color: "#e3e8f3" })
  );
  factoryFloor.position.y = factoryFloorHeight / 2;
  factoryFloor.castShadow = true;
  factoryFloor.receiveShadow = true;
  scene.add(factoryFloor);

  // factory walls
  const factoryWallsHeight = 1.5;
  const factoryWalls = new THREE.Mesh(
    new RoundedBoxGeometry(3, factoryWallsHeight, 1.5, 6, 0.15),
    new THREE.MeshStandardMaterial({ color: "#4c70f3" })
  );
  factoryWalls.position.y = factoryWallsHeight / 2;
  factoryWalls.castShadow = true;
  factoryWalls.receiveShadow = true;
  scene.add(factoryWalls);

  // factory cheminees
  const factoryChemineeGeoWidth = 0.5;
  const factoryChemineeGeoHeight = 2;
  const factoryChemineeGeo = new THREE.CylinderGeometry(
    factoryChemineeGeoWidth / 2,
    factoryChemineeGeoWidth / 2,
    factoryChemineeGeoHeight,
    32,
    1,
    false
  );
  const factoryChemineeMesh = new THREE.MeshStandardMaterial({
    color: "#8098ea",
  });
  const factoryChemenees = new THREE.Group();
  const factoryChemenee1 = new THREE.Mesh(
    factoryChemineeGeo,
    factoryChemineeMesh
  );
  factoryChemenee1.castShadow = true;
  factoryChemenee1.receiveShadow = true;

  const factoryChemenee2 = new THREE.Mesh(
    factoryChemineeGeo,
    factoryChemineeMesh
  );
  factoryChemenee2.castShadow = true;
  factoryChemenee2.receiveShadow = true;
  factoryChemenee2.position.x = factoryChemineeGeoWidth * -2;

  const factoryChemenee3 = new THREE.Mesh(
    factoryChemineeGeo,
    factoryChemineeMesh
  );
  factoryChemenee3.castShadow = true;
  factoryChemenee3.receiveShadow = true;
  factoryChemenee3.position.x = factoryChemineeGeoWidth * 2;

  factoryChemenees.add(factoryChemenee1, factoryChemenee2, factoryChemenee3);
  factoryChemenees.position.y =
    factoryWallsHeight + factoryChemineeGeoHeight / 2;

  scene.add(factoryChemenees);

  // smoke from cheminees
  let clouds: Array<THREE.Mesh> = [];
  for (let index = 0; index < 8; index++) {
    const factorySmoke = new THREE.Mesh(
      new THREE.SphereGeometry(0.25, 32, 16),
      new THREE.MeshStandardMaterial({ color: "#fff" })
    );
    factorySmoke.position.y = factoryWallsHeight + factoryChemineeGeoHeight;

    scene.add(factorySmoke);
    clouds.push(factorySmoke);
  }

  useEffect(() => {
    if (canvas.current !== null) {
      const renderer = new THREE.WebGLRenderer();

      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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
        // update smoke
        for (let index = 0; index < clouds.length; index++) {
          const factorySmoke = clouds[index];

          if (factorySmoke.position.y > 5) {
            factorySmoke.position.y =
              factoryWallsHeight + factoryChemineeGeoHeight;
            factorySmoke.position.z = 0;
            factorySmoke.position.x = 0;
          }

          const min = 0;
          const max = 0.03;

          factorySmoke.position.y += Math.random() * (max - min) + min;
          factorySmoke.position.x -= Math.random() * (max - min) + min;
          factorySmoke.position.z -= Math.random() * (max - min) + min;
        }

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

export default MiniFactory;
