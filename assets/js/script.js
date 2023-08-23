//Import
import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js";

//--------------------------------------------
//NOTE Creating renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
//--------------------------------------------

//--------------------------------------------
//NOTE Creating scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x666666);
//--------------------------------------------

//--------------------------------------------
//NOTE Perspective Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

//--------------------------------------------
//NOTE Percpective controll
const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, -35, 60);
camera.lookAt(0, -35, 0);
orbit.target.set(0, -35, 0);
//--------------------------------------------

//--------------------------------------------
//NOTE - direction light
const directionLight = new THREE.DirectionalLight(0xffffff, 3);
scene.add(directionLight);
directionLight.position.set(30, 20, 50);
directionLight.castShadow = true;
const frustumSize = 100;
directionLight.shadow.camera.left = -frustumSize;
directionLight.shadow.camera.right = frustumSize;
directionLight.shadow.camera.top = frustumSize;
directionLight.shadow.camera.bottom = -frustumSize;
//--------------------------------------------

//--------------------------------------------
//NOTE - ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);
//--------------------------------------------

//--------------------------------------------
//NOTE -load manager
const loadingManager = new THREE.LoadingManager();
const progressBar = document.getElementById("progress-bar");
loadingManager.onProgress = function (url, loaded, total) {
  progressBar.value = (loaded / total) * 100;
};

const progressBarContainer = document.querySelector(".progress-bar-container");

loadingManager.onLoad = function () {
  setTimeout(() => {
    progressBarContainer.style.display = "none";
  }, 2500);
};
//--------------------------------------------

//--------------------------------------------
//NOTE texture loader
const textureLoader = new THREE.TextureLoader(loadingManager);
//--------------------------------------------

//--------------------------------------------
//NOTE: import font
const loader = new THREE.FontLoader(loadingManager);
const font = {};
const allFontName = [
  "Noto Sans Thin_Regular.json",
  "Noto Sans SemiBold_Regular.json",
  "Roboto Light_Regular.json",
  "Noto Sans Medium_Regular.json",
  "Noto Serif Georgian_Regular.json",
];

allFontName.forEach((df) => {
  loader.load(
    `https://ankitjha2603.github.io/font/${df}`,
    function (temp_font) {
      font[df] = temp_font;
    }
  );
});
//--------------------------------------------

//--------------------------------------------
//NOTE: Create 3D text
const makeText = (text, x, y, z, size, color, font_type) => {
  const geometry = new THREE.TextGeometry(text, {
    font: font[font_type],
    size: size,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.00001,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  const textMaterial = new THREE.MeshStandardMaterial({
    color: color,
    roughness: 0.5,
    metalness: 0.5,
  });
  const textMesh = new THREE.Mesh(geometry, textMaterial);
  textMesh.castShadow = true;
  textMesh.receiveShadow = true; // Enable shadow receiving
  scene.add(textMesh);
  textMesh.position.y = y + st_y;
  textMesh.position.x = x + st_x;
  textMesh.position.z = z - 0.25;
  return textMesh;
};
//--------------------------------------------

//--------------------------------------------
//NOTE: constant
const st_x = -20;
const st_y = 0;
//--------------------------------------------

//--------------------------------------------
//NOTE: invisible background
const backgrounds = new Array();
const swap_visibility = new Array();
//--------------------------------------------

//--------------------------------------------
//NOTE: white background of page
const white_background = new THREE.Mesh(
  new THREE.PlaneGeometry(80, 120),
  new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })
);
scene.add(white_background);
backgrounds.push(white_background);
white_background.position.set(4.5, -35 + st_y, -0.1);
//--------------------------------------------

//--------------------------------------------
//NOTE: Profile pic
const texture = textureLoader.load(
  "https://ankitjha2603.github.io/resume/asset/profile/ankitjha2603.jpg"
);
const profile_pic = new THREE.Mesh(
  new THREE.PlaneGeometry(7, 7),
  new THREE.MeshBasicMaterial({ map: texture })
);
scene.add(profile_pic);
profile_pic.position.set(-10 + st_x, 20 + st_y, 0);
//--------------------------------------------

//--------------------------------------------
//NOTE: process
const process = new Object();
let processed = false;
//--------------------------------------------

//--------------------------------------------
//NOTE: link object
const object = [];
//--------------------------------------------

//--------------------------------------------
//NOTE: resume header
process.resume_header = () => {
  makeText(
    "Ankit Kumar Jha",
    -3,
    20,
    0,
    3,
    0x000000,
    "Noto Serif Georgian_Regular.json"
  );
  makeText(
    "Top 50 Global Rank on GeeksforGeeks | Skilled 3D Web Developer",
    -3,
    17.5,
    0,
    1,
    0x000000,
    "Roboto Light_Regular.json"
  );
};
//--------------------------------------------

//--------------------------------------------
//NOTE: light grey background for socia meadia and contact link
const light_grey_background = new THREE.Mesh(
  new THREE.PlaneGeometry(80, 7.5),
  new THREE.MeshBasicMaterial({ color: 0xf0eff0 })
);
scene.add(light_grey_background);
backgrounds.push(light_grey_background);
light_grey_background.position.set(4.5, -15 + 27 + st_y, 0);
//--------------------------------------------

//--------------------------------------------
//NOTE: contact detail block
const text_hover_box = (x, y, width) => {
  // Create a background plane
  var backgroundGeometry = new THREE.PlaneGeometry(width, 2.5); // Adjust size as needed
  var backgroundMaterial = new THREE.MeshBasicMaterial({
    color: 0x222222,
    transparent: true,
    opacity: 0.5,
  }); // Adjust material as needed

  var backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
  backgroundMesh.position.set(x, y, 0.2);
  scene.add(backgroundMesh);
  backgroundMesh.visible = false;
  return backgroundMesh;
};
const basic_url = "https://ankitjha2603.github.io/3d-resume/asssets";
const contact_detain_block = (x, y, block_icon_src, text, bgw, social_link) => {
  const block_icon_mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.MeshBasicMaterial({
      map: textureLoader.load(
        `${basic_url}/img/visible_state/${block_icon_src}.png`
      ),
    })
  );
  const block_icon_mesh_visibility = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.MeshBasicMaterial({
      map: textureLoader.load(
        `${basic_url}/img/invisible_state/${block_icon_src}.png`
      ),
    })
  );
  scene.add(block_icon_mesh);
  scene.add(block_icon_mesh_visibility);
  block_icon_mesh_visibility.visible = false;
  swap_visibility.push([block_icon_mesh, block_icon_mesh_visibility]);
  block_icon_mesh.position.set(x - 32.5, y + 13.5 + st_y, 0.1);
  block_icon_mesh_visibility.position.set(x - 32.5, y + 13.5 + st_y, 0.1);

  let text_mesh = makeText(
    text,
    x - 10.5,
    y + 13.1 + st_y,
    0.1,
    1,
    0x000000,
    "Roboto Light_Regular.json"
  );
  const text_bg = text_hover_box(
    x - 32.5 + bgw / 2 - 1.5,
    y + 13.5 + st_y,
    bgw
  );
  object.push([text_bg, text_mesh, social_link]);
};
process.detail_block = () => {
  contact_detain_block(
    0,
    0,
    "phone",
    "+91 7303892845",
    19.2,
    "tel:+917303892845"
  );
  contact_detain_block(
    0,
    -3,
    "email",
    "ankitjha2603@gmail.com",
    19.2,
    "mailto:ankitjha2603@gmail.com"
  );

  contact_detain_block(
    20,
    0,
    "earth",
    "Portfolio",
    10,
    "http://ankitjha2603.github.io/"
  );
  contact_detain_block(
    20,
    -3,
    "github",
    "Github",
    10,
    "http://github.com/ankitjha2603"
  );

  contact_detain_block(
    31,
    0,
    "linkedin",
    "Linkedin",
    11,
    "https://www.linkedin.com/in/ankitjha2603/"
  );
  contact_detain_block(
    31,
    -3,
    "leetcode",
    "leetcode",
    11,
    "https://leetcode.com/ankitjha2603/"
  );

  contact_detain_block(
    43,
    0,
    "gfg",
    "geeksforgeeks",
    15,
    "https://auth.geeksforgeeks.org/user/ankitjha2603"
  );
  contact_detain_block(
    43,
    -3,
    "hackerrank",
    "Hackerrank",
    15,
    "https://www.hackerrank.com/ankitjha2603"
  );

  contact_detain_block(
    59,
    0,
    "docker",
    "Docker hub",
    12,
    "https://hub.docker.com/u/ankitjha2603"
  );
};
//--------------------------------------------

//--------------------------------------------
//NOTE: Internship
const create_list_dot = (x, y, z) => {
  const radius = 0.3;
  const segments = 64;

  const list_dot = new THREE.Mesh(
    new THREE.CircleGeometry(radius, segments),
    new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.DoubleSide,
    })
  );
  scene.add(list_dot);
  list_dot.position.set(x, y, z);
};
//--------------------------------------------

//--------------------------------------------
//NOTE: Internship
process.internship = () => {
  makeText(
    "Internship",
    -14,
    4,
    0,
    2,
    0x0e2d4b,
    "Noto Sans Medium_Regular.json"
  );
  makeText("OAKNST", -14, 0, 0, 1.75, 0x000000, "Roboto Light_Regular.json");
  makeText(
    "Full Stack Web Developer and SEO Specialist",
    -14,
    -2.5,
    0,
    1,
    0x000000,
    "Noto Sans SemiBold_Regular.json"
  );
  create_list_dot(-32, -5.5, 0);
  makeText(
    `Developed practical full-stack web development skills\nby building an ERP using Laravel.`,
    -10,
    -6,
    0,
    1,
    0x000000,
    "Noto Sans Thin_Regular.json"
  );
  create_list_dot(-32, -10.47, 0);
  makeText(
    `Optimized a website for search engines, leading to a\n40% increase in organic traffic and improved online\nvisibility.`,
    -10,
    -11,
    0,
    1,
    0x000000,
    "Noto Sans Thin_Regular.json"
  );
};
//--------------------------------------------

//--------------------------------------------
//NOTE: Volunteer
process.volunteer = () => {
  makeText(
    "Volunteer",
    -14,
    -20,
    0,
    2,
    0x0e2d4b,
    "Noto Sans Medium_Regular.json"
  );
  makeText(
    "SMART INDIA HACKATHON",
    -14,
    -22.5,
    0,
    1,
    0x000000,
    "Noto Sans SemiBold_Regular.json"
  );
  create_list_dot(-32, -25.5, 0);
  makeText(
    `I was a student volunteer in SIH which is organized by\nthe Government of India.`,
    -10,
    -26,
    0,
    1,
    0x000000,
    "Noto Sans Thin_Regular.json"
  );
};
//--------------------------------------------

//--------------------------------------------
//NOTE: Projects
process.projects = () => {
  makeText(
    "Projects",
    -14,
    -33,
    0,
    2,
    0x0e2d4b,
    "Noto Sans Medium_Regular.json"
  );
  //3d city tour
  create_list_dot(-32, -35.5, 0);
  makeText(
    "3d city tour",
    -10,
    -36,
    0,
    1,
    0x000000,
    "Noto Sans SemiBold_Regular.json"
  );
  makeText(
    `Made with three.js and YUKA, our 3D website lets\nusers take immersive city tours in virtual cars.\nWe've added time options and realistic\nlighting for an even more authentic experience.`,
    -10,
    -38,
    0,
    1,
    0x000000,
    "Noto Sans Thin_Regular.json"
  );
  //Falling ball
  create_list_dot(-32, -49.5, 0);
  makeText(
    "Falling ball",
    -10,
    -50,
    0,
    1,
    0x000000,
    "Noto Sans SemiBold_Regular.json"
  );
  makeText(
    `Try our interactive 3D Ball Physics Sim: Click to\ncreate realistic balls. Watch them fall, bounce, and\nroll convincingly with gravity, bringing true physics\nto your screen.`,
    -10,
    -53,
    0,
    1,
    0x000000,
    "Noto Sans Thin_Regular.json"
  );
  //Play connect
  create_list_dot(-32, -63.5, 0);
  makeText(
    "Play connect",
    -10,
    -64,
    0,
    1,
    0x000000,
    "Noto Sans SemiBold_Regular.json"
  );
  makeText(
    `Real-time multiplayer game built with React,\nenabling seamless gameplay across locations.\nImplemented login, code sharing, and engaging\nchallenges for players at a distance.`,
    -10,
    -67,
    0,
    1,
    0x000000,
    "Noto Sans Thin_Regular.json"
  );
  //Play connect
  create_list_dot(-32, -77.5, 0);
  makeText(
    "Costly Item",
    -10,
    -78,
    0,
    1,
    0x000000,
    "Noto Sans SemiBold_Regular.json"
  );
  makeText(
    `Python software for comparing prices from\nmultiple websites, finding affordable alternatives,\nall on one screen.`,
    -10,
    -81,
    0,
    1,
    0x000000,
    "Noto Sans Thin_Regular.json"
  );
};
//--------------------------------------------

//--------------------------------------------
//NOTE: skill blocks
const create_curveBlock = (x, y, height, width) => {
  const segments = 5;
  const borderRadius = 0.75;

  const roundedRectShape = new THREE.Shape();
  roundedRectShape.moveTo(0, borderRadius);
  roundedRectShape.lineTo(0, height - borderRadius);
  roundedRectShape.quadraticCurveTo(0, height, borderRadius, height);
  roundedRectShape.lineTo(width - borderRadius, height);
  roundedRectShape.quadraticCurveTo(
    width,
    height,
    width,
    height - borderRadius
  );
  roundedRectShape.lineTo(width, borderRadius);
  roundedRectShape.quadraticCurveTo(width, 0, width - borderRadius, 0);
  roundedRectShape.lineTo(borderRadius, 0);
  roundedRectShape.quadraticCurveTo(0, 0, 0, borderRadius);

  const geometry = new THREE.ShapeGeometry(roundedRectShape, segments);
  const material = new THREE.MeshBasicMaterial({
    color: 0x4682b4,
  });
  const rectangle = new THREE.Mesh(geometry, material);
  scene.add(rectangle);
  backgrounds.push(rectangle);
  rectangle.position.set(x, y, 0.01);
  return rectangle;
};

const block = (text, block_info, text_info) => {
  create_curveBlock();
  let curveBlock = create_curveBlock(
    block_info.x,
    block_info.y,
    3,
    block_info.width
  );
  makeText(
    text,
    text_info.x,
    text_info.y,
    0.1,
    1,
    0xffffff,
    "Noto Sans SemiBold_Regular.json"
  );
};

//--------------------------------------------

//--------------------------------------------
//NOTE: Technology known
process.technology_block = () => {
  makeText(
    "Technology known",
    24,
    4,
    0,
    2,
    0x0e2d4b,
    "Noto Sans Medium_Regular.json"
  );
  const technology = [
    {
      text: "Python",
      block_info: { x: 4, y: -1, width: 8 },
      text_info: { x: 25.5, y: 0 },
    },
    {
      text: "HTML & CSS",
      block_info: { x: 13, y: -1, width: 10 },
      text_info: { x: 34, y: 0 },
    },
    {
      text: "3D Web development",
      block_info: { x: 24, y: -1, width: 16.5 },
      text_info: { x: 45, y: 0 },
    },
    {
      text: "SCSS/SASS",
      block_info: { x: 4, y: -5, width: 10 },
      text_info: { x: 25.5, y: -4 },
    },
    {
      text: "Javascript",
      block_info: { x: 15, y: -5, width: 9.5 },
      text_info: { x: 36.5, y: -4 },
    },
    {
      text: "SEO/SEM",
      block_info: { x: 25.5, y: -5, width: 8 },
      text_info: { x: 46.5, y: -4 },
    },
    {
      text: "SQL",
      block_info: { x: 34.5, y: -5, width: 6 },
      text_info: { x: 56, y: -4 },
    },
    {
      text: "Machine Learning",
      block_info: { x: 4, y: -9, width: 15 },
      text_info: { x: 25.5, y: -8 },
    },
    {
      text: "Firebase",
      block_info: { x: 20, y: -9, width: 8.5 },
      text_info: { x: 41.5, y: -8 },
    },
    {
      text: "DSA",
      block_info: { x: 29.5, y: -9, width: 5 },
      text_info: { x: 50.5, y: -8 },
    },
    {
      text: "PHP",
      block_info: { x: 35.5, y: -9, width: 5 },
      text_info: { x: 56.5, y: -8 },
    },
    {
      text: "Node.js",
      block_info: { x: 4, y: -13, width: 8 },
      text_info: { x: 25.5, y: -12 },
    },
  ];
  technology.forEach(({ text, block_info, text_info }) =>
    block(text, block_info, text_info)
  );
};
//--------------------------------------------

//--------------------------------------------
//NOTE: libraries and framework
process.libraries_and_frameworks_block = () => {
  makeText(
    "libraries and frameworks",
    24,
    -18,
    0,
    2,
    0x0e2d4b,
    "Noto Sans Medium_Regular.json"
  );
  const libraries_and_frameworks = [
    {
      text: "Three.js",
      block_info: { x: 4, y: -23, width: 8 },
      text_info: { x: 25.5, y: -22 },
    },
    {
      text: "React.js",
      block_info: { x: 13, y: -23, width: 8 },
      text_info: { x: 34.5, y: -22 },
    },
    {
      text: "Cannon.js",
      block_info: { x: 22, y: -23, width: 9.5 },
      text_info: { x: 43.5, y: -22 },
    },
    {
      text: "YUKA",
      block_info: { x: 32.5, y: -23, width: 7 },
      text_info: { x: 54.25, y: -22 },
    },
    {
      text: "Dat-gui",
      block_info: { x: 4, y: -27, width: 8 },
      text_info: { x: 25.5, y: -22 - 4 },
    },
    {
      text: "Flask",
      block_info: { x: 13, y: -27, width: 6.5 },
      text_info: { x: 34.5, y: -26 },
    },
    {
      text: "jQuery",
      block_info: { x: 20.5, y: -27, width: 7.5 },
      text_info: { x: 42, y: -26 },
    },
    {
      text: "Scikit-Learn",
      block_info: { x: 29, y: -27, width: 10 },
      text_info: { x: 50, y: -26 },
    },
    {
      text: "Selenium",
      block_info: { x: 4, y: -31, width: 8.75 },
      text_info: { x: 25.5, y: -30 },
    },
    {
      text: "tkinter",
      block_info: { x: 14, y: -31, width: 7.5 },
      text_info: { x: 35.5, y: -30 },
    },
    {
      text: "Beautiful Soup",
      block_info: { x: 22.5, y: -31, width: 13 },
      text_info: { x: 44, y: -30 },
    },
    {
      text: "Django",
      block_info: { x: 29 + 7.5, y: -31, width: 7 },
      text_info: { x: 50 + 7.5, y: -30 },
    },
    {
      text: "Laravel",
      block_info: { x: 4, y: -35, width: 8.75 },
      text_info: { x: 25.5, y: -34 },
    },
  ];
  libraries_and_frameworks.forEach(({ text, block_info, text_info }) =>
    block(text, block_info, text_info)
  );
};
//--------------------------------------------

//--------------------------------------------
//NOTE: Tools
process.tools = () => {
  makeText("Tools", 24, -39, 0, 2, 0x0e2d4b, "Noto Sans Medium_Regular.json");
  const tools = [
    {
      text: "PhpMyAdmin",
      block_info: { x: 4, y: -43, width: 12 },
      text_info: { x: 25.5, y: -42 },
    },
    {
      text: "Docker",
      block_info: { x: 17, y: -43, width: 8 },
      text_info: { x: 38.5, y: -42 },
    },
    {
      text: "Adobe XD",
      block_info: { x: 26.25, y: -43, width: 10 },
      text_info: { x: 47.75, y: -42 },
    },
    {
      text: "Bootstrap",
      block_info: { x: 4, y: -47, width: 10 },
      text_info: { x: 25.5, y: -46 },
    },
    {
      text: "Git & GitHub",
      block_info: { x: 15, y: -47, width: 11.5 },
      text_info: { x: 36.5, y: -46 },
    },
    {
      text: "Google Analytics",
      block_info: { x: 28.25 - 0.75, y: -47, width: 14 },
      text_info: { x: 49.75 - 0.75, y: -46 },
    },
  ];
  tools.forEach(({ text, block_info, text_info }) =>
    block(text, block_info, text_info)
  );
};
//--------------------------------------------

//--------------------------------------------
//NOTE: Achievements
process.achievements = () => {
  makeText(
    "Achievements",
    24,
    -52,
    0,
    2,
    0x0e2d4b,
    "Noto Sans Medium_Regular.json"
  );
  create_list_dot(6, -54.5, 0);
  makeText(
    `Top 50 Global Rank on GeeksforGeeks`,
    28,
    -55,
    0,
    1,
    0x000000,
    "Noto Sans Thin_Regular.json"
  );
  create_list_dot(6, -57, 0);
  makeText(
    `1314th global Rank in TCS Codevita`,
    28,
    -57.5,
    0,
    1,
    0x000000,
    "Noto Sans Thin_Regular.json"
  );
  create_list_dot(6, -59.5, 0);
  makeText(
    `1416th global rank in Google Code`,
    28,
    -60,
    0,
    1,
    0x000000,
    "Noto Sans Thin_Regular.json"
  );
};
//--------------------------------------------

//--------------------------------------------
//NOTE: Certificates
process.certificates = () => {
  makeText(
    "Certificates",
    24,
    -64,
    0,
    2,
    0x0e2d4b,
    "Noto Sans Medium_Regular.json"
  );
  create_list_dot(6, -66.5, 0);
  makeText(
    `Foundations of Project Management by Google`,
    28,
    -67,
    0,
    1,
    0x000000,
    "Noto Sans Thin_Regular.json"
  );
  create_list_dot(6, -69, 0);
  makeText(
    `Google digitalgarage`,
    28,
    -69.5,
    0,
    1,
    0x000000,
    "Noto Sans Thin_Regular.json"
  );
  create_list_dot(6, -71.5, 0);
  makeText(
    `Google digitalunlocked`,
    28,
    -72,
    0,
    1,
    0x000000,
    "Noto Sans Thin_Regular.json"
  );
  create_list_dot(6, -74, 0);
  makeText(
    `Hackerrank Python (Basic) Certificate`,
    28,
    -74.5,
    0,
    1,
    0x000000,
    "Noto Sans Thin_Regular.json"
  );
  create_list_dot(6, -76.5, 0);
  makeText(
    `Hackerrank JavaScript (Basic) Certificate`,
    28,
    -77,
    0,
    1,
    0x000000,
    "Noto Sans Thin_Regular.json"
  );
};
//--------------------------------------------

//--------------------------------------------
//NOTE: Interest & Hobbies
process.interest_hobbies = () => {
  makeText(
    "Interest & Hobbies",
    24,
    -82,
    0,
    2,
    0x0e2d4b,
    "Noto Sans Medium_Regular.json"
  );
  create_list_dot(6, -84.5, 0);
  makeText(
    `listening Book summary`,
    28,
    -85,
    0,
    1,
    0x000000,
    "Noto Sans SemiBold_Regular.json"
  );
  makeText(
    `(Favorite Books :`,
    45,
    -85,
    0,
    1,
    0x000000,
    "Noto Sans Thin_Regular.json"
  );
  makeText(
    `Unposted letter, Atomic habit.)`,
    28,
    -87.5,
    0,
    1,
    0x000000,
    "Noto Sans Thin_Regular.json"
  );
};
//--------------------------------------------

//--------------------------------------------
//NOTE: created using html info
process.info = () => {
  makeText(
    `*created using HTML5, CSS3, JS, Three.js`,
    34,
    -93.5,
    0,
    1,
    0x444444,
    "Noto Sans SemiBold_Regular.json"
  );
};
//--------------------------------------------

//--------------------------------------------
//NOTE - GUI options
var GUI = dat.gui.GUI;
const gui = new GUI();
const options = {
  background: true,
};
gui.add(options, "background").onChange((e) => {
  backgrounds.forEach((bg) => {
    bg.visible = e;
  });
  swap_visibility.forEach(([pic1, pic2]) => {
    pic1.visible = e;
    pic2.visible = !e;
  });
});
//--------------------------------------------

//--------------------------------------------
//NOTE: animate functions
const animate = () => {
  if (!processed) {
    if (Object.keys(font).length === allFontName.length) {
      process.resume_header();
      process.detail_block();
      process.internship();
      process.volunteer();
      process.projects();
      process.technology_block();
      process.libraries_and_frameworks_block();
      process.tools();
      process.achievements();
      process.certificates();
      process.interest_hobbies();
      process.info();
      processed = true;
      //TODO console.clear();
    }
  }
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};
animate();
//--------------------------------------------

//--------------------------------------------
//NOTE - resize camera view
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
//--------------------------------------------

//--------------------------------------------
//NOTE - add EventListener to move camera by click
window.addEventListener("dblclick", function (event) {
  let windowHeight = window.innerHeight;
  let clickY = event.clientY;
  let y = camera.position.y;
  let speed = 10;
  let part = 0.25;
  if (clickY <= part * windowHeight) {
    y += speed;
  } else if (clickY >= (1 - part) * windowHeight) {
    y -= speed;
  }
  camera.position.y = y;
  camera.lookAt(0, y, 0);
  orbit.target.set(0, y, 0);
});
//--------------------------------------------

//--------------------------------------------
//NOTE - hover effect on social link
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("mousemove", (event) => {
  const canvas_element = document.querySelector("canvas");
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(object.map((e) => e[0]));

  if (intersects.length === 1) {
    canvas_element.classList.add("pointer");
    const hoveredObject = intersects[0].object;
    object.forEach(([d_obj, d_text, d_link]) => {
      d_text.material.color = new THREE.Color(
        hoveredObject == d_obj ? 0x00ff37 : 0x000000
      );
    });
  } else {
    canvas_element.classList.remove("pointer");
    object.forEach(([d_obj, d_text, d_link]) => {
      d_text.material.color = new THREE.Color(0x000000);
    });
  }
});
//--------------------------------------------

//--------------------------------------------
//NOTE - click effect on social link
window.addEventListener("click", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(object.map((e) => e[0]));
  if (intersects.length === 1) {
    const hoveredObject = intersects[0].object;
    object.forEach(([d_obj, d_text, d_link]) => {
      if (d_obj === hoveredObject) {
        window.open(d_link, "_blank");
      }
    });
  }
});
//--------------------------------------------
