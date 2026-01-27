/* ===== PROJECT DATA ===== */
const projects = [
  {
    src: "./models/hero.glb",
    title: "32oz Snap-On-Lid Cup",
    desc: "3D assembly of a lid with accompanying snap-on-lid, fully designed and modeled in Autodesk Inventor."
  },
  {
    src: "./models/CFA_Nametag_Allignment_ToolV3WithFlag.glb",
    title: "CFA Nametag Alignment Tool",
    desc: "Tool to perfectly align name tags for Chick-fil-A, designed for precise sticker placement."
  },
  {
    src: "./models/SoapHolder.glb",
    title: "Soap Holder",
    desc: "3D model of a Soap Holder created through requested dimantional constraints."
  },
  {
    src: "./models/GolfCap115.glb",
    title: "Golf Sim Rubber Tee",
    desc: "A personal project to solve problems of already created Rubber Tees, this model was flawed and has been improved into a model currently being sold."
  },
  {
    src: "./models/FlipBottleLid.glb",
    title: "Flip Bottle Lid",
    desc: "3D Assembly file of a bottle lid with a flip-top mechanism."
  }
];

/* ===== INIT MODEL-VIEWER LOADING ===== */
customElements.whenDefined("model-viewer").then(() => {
  // ---- HERO MODEL ----
  const canvasWrapper = document.querySelector(".canvas-wrapper");
  const hero = document.createElement("model-viewer");

  hero.src = projects[0].src;
  hero.alt = projects[0].title;
  hero.autoRotate = true;
  hero.cameraControls = true;
  hero.loading = "lazy";

  canvasWrapper.appendChild(hero);

  // ---- PROJECT CARDS ----
  const grid = document.getElementById("projects-grid");

  projects.slice(0).forEach((p) => { // skip hero
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

  // ---- CENTER BIO (DESKTOP ONLY) ----
  const bio = document.querySelector(".about");

  function centerBio() {
    if (window.innerWidth < 768) return;

    const wrapperRect = canvasWrapper.getBoundingClientRect();
    const bioRect = bio.getBoundingClientRect();

    bio.style.top =
      wrapperRect.top +
      wrapperRect.height / 2 - 
      bioRect.height / 2 +
      window.scrollY + "px";
  }

  centerBio();
  window.addEventListener("resize", centerBio);
  window.addEventListener("scroll", centerBio);
});
