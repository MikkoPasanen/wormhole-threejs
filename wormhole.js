// Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// Import the EffectComposer, RenderPass, and UnrealBloomPass
import { EffectComposer } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/postprocessing/UnrealBloomPass.js";
// Import the spline.js file
import spline from "./spline.js";

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.6);

const camera = new THREE.PerspectiveCamera(
    75,
    screenWidth / screenHeight,
    0.1,
    5
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(screenWidth, screenHeight);
document.getElementById("container3D").appendChild(renderer.domElement);

// Create the tunnel track geometry
const tubeGeometry = new THREE.TubeGeometry(spline, 200, 0.7, 16, true);
// Create wireframe geometry for the tunnel track from the tubeGeometry
const wireframe = new THREE.WireframeGeometry(tubeGeometry);

// Using wireframe geometry to create a line segments object for the tunnel track
const tubeLines = new THREE.LineSegments(
    wireframe,
    new THREE.LineBasicMaterial({
        color: 0xff0000,
    })
);
scene.add(tubeLines);

// Create a composer object to add post-processing effects such as bloom
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(screenWidth, screenHeight), // Resolution
    3.0, // Strength of bloom (higher = more intense glow)
    0.5, // Radius (how "spread out" the glow is)
    0.0 // Threshold (lower = all objects contribute to bloom)
);
composer.addPass(bloomPass);

function updateCamera() {
    const time = Date.now() * 0.4;
    const looptime = 20000;
    const t = (time % looptime) / looptime;
    const pos = tubeGeometry.parameters.path.getPointAt(t);
    camera.position.copy(pos);
    const lookAt = tubeGeometry.parameters.path.getPointAt((t + 0.01) % 1);
    camera.lookAt(lookAt);
}

// 🔄 Main animation loop
function animate() {
    requestAnimationFrame(animate);
    updateCamera();
    composer.render();
}

animate();
