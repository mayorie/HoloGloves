// Import modules Three.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// --- CAROUSEL ---
let index = 0;
function nextImage() {
  const slides = document.querySelectorAll('.slide');
  index = (index + 1) % slides.length;
  document.querySelector('.carousel-images').style.transform = `translateX(-${index * 100}%)`;
}
setInterval(nextImage, 3000);

// --- 3D MODEL ---
const container = document.querySelector('.model3d-container');

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
);
camera.position.set(0, 0, 5);
camera.lookAt(0, 0, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.enableDamping = true;
controls.enablePan = true;
controls.enableZoom = true;
controls.update();

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 1.5));

const dir1 = new THREE.DirectionalLight(0xffffff, 1.2);
dir1.position.set(5, 5, 5);
scene.add(dir1);

const dir2 = new THREE.DirectionalLight(0xffffff, 1.2);
dir2.position.set(-5, 5, 5);
scene.add(dir2);

const dir3 = new THREE.DirectionalLight(0xffffff, 1.2);
dir3.position.set(5, -5, 5);
scene.add(dir3);

const dir4 = new THREE.DirectionalLight(0xffffff, 1.2);
dir4.position.set(-5, -5, 5);
scene.add(dir4);

const point = new THREE.PointLight(0xffffff, 1.5, 50);
point.position.set(0, 0, 5);
scene.add(point);

// ----------------------
// 🔵 AJOUT DU CUBE 3D
// ----------------------
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({
    color: 0x00aaff,
    metalness: 0.3,
    roughness: 0.4
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// ----------------------
// Rendu hologramme
// ----------------------
function renderHologram() {
  requestAnimationFrame(renderHologram);

  const w = renderer.domElement.width;
  const h = renderer.domElement.height;

  const viewW = w * 0.25;
  const halfH = h / 2;
  const gap = (w - viewW * 3) / 2;

  controls.update();

  // Gauche
  camera.rotation.z = -Math.PI / 2;
  renderer.setViewport(gap+70, halfH / 2, viewW, halfH);
  renderer.setScissor(gap, halfH / 2, viewW, halfH);
  renderer.setScissorTest(true);
  renderer.render(scene, camera);

  // Droite
  camera.rotation.z = Math.PI / 2;
  renderer.setViewport(gap + viewW * 2-70, halfH / 2, viewW, halfH);
  renderer.setScissor(gap + viewW * 2, halfH / 2, viewW, halfH);
  renderer.setScissorTest(true);
  renderer.render(scene, camera);

  // Haut
  camera.rotation.z = 0;
  renderer.setViewport(gap + viewW, halfH, viewW, halfH);
  renderer.setScissor(gap + viewW, halfH, viewW, halfH);
  renderer.setScissorTest(true);
  renderer.render(scene, camera);

  // Bas
  camera.rotation.z = Math.PI;
  renderer.setViewport(gap + viewW, 0, viewW, halfH);
  renderer.setScissor(gap + viewW, 0, viewW, halfH);
  renderer.setScissorTest(true);
  renderer.render(scene, camera);

  camera.rotation.z = 0;
}

renderHologram();

// Chargement OBJ + MTL
const mtlLoader = new MTLLoader();
mtlLoader.load('models/Seahorse-bl.mtl', function(materials) {
  materials.preload();

  const objLoader = new OBJLoader();
  objLoader.setMaterials(materials);

  objLoader.load(
    'models/Seahorse-bl.obj',
    function (object) {
        object.scale.set(1, 1, 1);
        object.position.set(0, 0, 0);

        // → On ajoute UN SEUL modèle dans la scène
        scene.add(object);
    },

    (xhr) => console.log((xhr.loaded / xhr.total * 100) + '% chargé'),
    (error) => console.error('Erreur OBJ :', error)
);

});
