import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// ===== Three.js Setup =====
const canvas = document.getElementById("three-canvas");
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// Camera
const camera = new THREE.PerspectiveCamera(
  45,
  canvas.offsetWidth / canvas.offsetHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 5);

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 1.2));
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// ===== Projects Array =====
const projects = [
  {
    src: "./models/hero.glb",
    title: "Pencil Case with Live Hinge",
    desc: "3D model of a pencil case featuring a live hinge, fully designed and modeled in Autodesk Inventor."
  },
  {
    src: "./models/CFA_Nametag_Allignment_ToolV3WithFlag.glb",
    title: "CFA Nametag Alignment Tool",
    desc: "Tool to perfectly align name tags for Chick-fil-A, designed for precise sticker placement."
  },
  {
    src: "./models/WinterHatBottle.glb",
    title: "Winter Hat Bottle",
    desc: "3D model of a bottle with a winter hat design ready to be put into an Assembly."
  },
  {
    src: "./models/FlipBottleLid.glb",
    title: "Flip Bottle Lid",
    desc: "3D Assembly of a bottle lid with a flip-top mechanism."
  }
];

let heroModel = null;
const loader = new GLTFLoader();
const currentHero = projects[0].src;

// ===== Load Hero Model =====
function loadHeroModel(path) {
  if (heroModel) {
    scene.remove(heroModel);
    heroModel.traverse(child => {
      if (child.isMesh) child.geometry.dispose();
    });
    heroModel = null;
  }

  loader.load(
    path,
    (gltf) => {
      heroModel = gltf.scene;
      heroModel.scale.set(0.5, 0.5, 0.5);
      heroModel.position.set(0, 0.25, 0);
      heroModel.rotation.x = 0.5;

      heroModel.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            wireframe: true,
            metalness: 0,
            roughness: 0.5
          });
        }
      });

      scene.add(heroModel);
      centerBio();
    },
    undefined,
    (err) => console.error("Failed to load hero model:", err)
  );
}

// ===== Animate Hero =====
function animate() {
  requestAnimationFrame(animate);
  if (heroModel) heroModel.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();

// ===== Center Bio Overlay =====
const bio = document.querySelector(".about");
function centerBio() {
  const canvasRect = canvas.getBoundingClientRect();
  const bioRect = bio.getBoundingClientRect();
  const top = canvasRect.top + canvasRect.height / 2 - bioRect.height / 2 + window.scrollY;
  bio.style.top = `${top}px`;
}

window.addEventListener("resize", () => {
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
  camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
  camera.updateProjectionMatrix();
  centerBio();
});
window.addEventListener("scroll", centerBio);

// ===== Populate Projects Section =====
function populateProjects() {
  customElements.whenDefined("model-viewer").then(() => {
    const projectsGrid = document.getElementById("projects-grid");

    projects.forEach(p => {
      const div = document.createElement("div");
      div.className = "project";

      const modelViewer = document.createElement("model-viewer");
      modelViewer.src = p.src;
      modelViewer.alt = p.title;
      modelViewer.autoRotate = true;
      modelViewer.cameraControls = true;
      modelViewer.style.width = "400px";  // Width = Height + 100px
      modelViewer.style.height = "300px"; // Fixed height
      modelViewer.style.display = "block";
      modelViewer.style.margin = "0 auto";
      modelViewer.style.objectFit = "contain";

      const title = document.createElement("h3");
      title.textContent = p.title;

      const desc = document.createElement("p");
      desc.textContent = p.desc;

      div.appendChild(modelViewer);
      div.appendChild(title);
      div.appendChild(desc);
      projectsGrid.appendChild(div);
    });
  });
}

// ===== Initial Load =====
loadHeroModel(currentHero);
populateProjects();
