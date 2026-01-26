import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

/* ===== CANVAS / SCENE ===== */
const canvas = document.getElementById("three-canvas");
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

/* ===== CAMERA ===== */
const camera = new THREE.PerspectiveCamera(
  45,
  canvas.clientWidth / canvas.clientHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 5);

/* ===== RENDERER ===== */
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: false
});
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);

/* ===== LIGHTING ===== */
scene.add(new THREE.AmbientLight(0xffffff, 1.2));

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

/* ===== PROJECT DATA ===== */
const projects = [
  {
    src: "./models/hero.glb",
    title: "Pencil Case with Live Hinge",
    desc: "3D model of a pencil case featuring a live hinge, fully designed and modeled in CAD."
  },
  {
    src: "./models/CFA_Nametag_Allignment_ToolV3WithFlag.glb",
    title: "CFA Nametag Alignment Tool",
    desc: "Tool to perfectly align name tags for Chick-fil-A, designed for precise sticker placement."
  },
  {
    src: "./models/WinterHatBottle.glb",
    title: "Winter Hat Bottle",
    desc: "3D model of a bottle with a winter hat design."
  },
  {
    src: "./models/FlipBottleLid.glb",
    title: "Flip Bottle Lid",
    desc: "3D model of a bottle lid with a flip-top mechanism."
  }
];

/* ===== HERO MODEL ===== */
const loader = new GLTFLoader();
let heroModel = null;

/* ===== LOAD HERO ===== */
function loadHeroModel() {
  loader.load(
    projects[0].src,
    (gltf) => {
      heroModel = gltf.scene;

      heroModel.scale.set(0.5, 0.5, 0.5);
      heroModel.position.set(0, 0.25, 0);
      heroModel.rotation.x = 0.5;

      heroModel.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            metalness: 0.1,
            roughness: 0.6,
            wireframe: true
          });
        }
      });

      scene.add(heroModel);
      centerBio();
    },
    undefined,
    (err) => console.error("Hero model failed to load:", err)
  );
}

/* ===== ANIMATION LOOP ===== */
function animate() {
  requestAnimationFrame(animate);

  if (heroModel) {
    heroModel.rotation.y += 0.01;
  }

  renderer.render(scene, camera);
}
animate();

/* ===== BIO POSITIONING (DESKTOP ONLY) ===== */
const bio = document.querySelector(".about");

function centerBio() {
  if (window.innerWidth < 768) return;

  const canvasRect = canvas.getBoundingClientRect();
  const bioRect = bio.getBoundingClientRect();

  bio.style.top =
    canvasRect.top +
    canvasRect.height / 2 -
    bioRect.height / 2 +
    window.scrollY +
    "px";
}

/* ===== RESIZE HANDLING ===== */
window.addEventListener("resize", () => {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  centerBio();
});

window.addEventListener("scroll", centerBio);

/* ===== PROJECT GRID ===== */
function populateProjects() {
  customElements.whenDefined("model-viewer").then(() => {
    const grid = document.getElementById("projects-grid");

    projects.forEach((p) => {
      const card = document.createElement("div");
      card.className = "project";

      card.innerHTML = `
        <model-viewer
          src="${p.src}"
          alt="${p.title}"
          auto-rotate
          camera-controls
          loading="lazy">
        </model-viewer>
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
      `;

      grid.appendChild(card);
    });
  });
}

/* ===== INIT ===== */
loadHeroModel();
populateProjects();
