import * as Three from "three";

function initCamera() {
	let camera = new Three.PerspectiveCamera(
		45,
		window.innerWidth / window.innerHeight,
		1,
		10000
	);
	camera.position.set(500, 800, 1300);
	camera.lookAt(new Three.Vector3());
	return camera;
}

function init(data) {
	var container, stats;
	var camera, scene, renderer;

	container = document.createElement("div");
	document.body.appendChild(container);

	scene = new Three.Scene();
	scene.background = new Three.Color(0xf0f0f0);

	renderer = new Three.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	container.appendChild(renderer.domElement);

	return { container, stats, camera, scene, renderer };
}

export default init;
