// Import modules Three.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';

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
scene.background = new THREE.Color(0xf0f0f0);

// Camera
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.z = 5;

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Lumière
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7.5);
scene.add(light);

// Cube test
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshNormalMaterial();
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Resize automatique
window.addEventListener('resize', () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});

// Animation
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Chargement OBJ + MTL
const mtlLoader = new MTLLoader();
mtlLoader.load('models/Seahorse-bl.mtl', function(materials) {
  materials.preload();
  const objLoader = new OBJLoader();
  objLoader.setMaterials(materials);
  objLoader.load('models/Seahorse-bl.obj', function(object) {
    object.scale.set(1, 1, 1);
    object.position.set(0, 0, 0);
    scene.add(object);
  }, 
  (xhr) => console.log((xhr.loaded / xhr.total * 100) + '% chargé'),
  (error) => console.error('Erreur OBJ :', error));
});
