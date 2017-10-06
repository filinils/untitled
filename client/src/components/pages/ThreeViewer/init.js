import * as THREE from "three";
import MTLLoader from "three-react-mtl-loader";
// import OBJLoader from "three-react-obj-loader";
import OBJLoader from "three-obj-loader";
OBJLoader(THREE);

function init(data) {
	var container, stats;
	var camera, scene, renderer;

	container = document.createElement("div");
	document.body.appendChild(container);

	camera = new THREE.PerspectiveCamera(
		45,
		window.innerWidth / window.innerHeight,
		1,
		10000
	);
	camera.position.set(500, 800, 1300);
	camera.lookAt(new THREE.Vector3());
	scene = new THREE.Scene();
	scene.background = new THREE.Color(0xf0f0f0);

	// var ambient = new THREE.AmbientLight(0x444444);
	// scene.add(ambient);
	// var directionalLight = new THREE.DirectionalLight(0xffeedd);
	// directionalLight.position.set(0, 0, 1).normalize();
	// scene.add(directionalLight);
	// model

	//
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	container.appendChild(renderer.domElement);

	return { container, stats, camera, scene, renderer };
}

export const loadModel = (point, modelName, scene) => {
	var onProgress = function(xhr) {
		if (xhr.lengthComputable) {
			var percentComplete = xhr.loaded / xhr.total * 100;
			console.log(Math.round(percentComplete, 2) + "% downloaded");
		}
	};

	var onError = function(xhr) {};

	let mtlLoader = new MTLLoader();
	mtlLoader.setPath("assets/");
	mtlLoader.load(modelName + ".mtl", function(materials) {
		materials.preload();
		let objLoader = new THREE.OBJLoader();
		objLoader.setMaterials(materials);
		objLoader.setPath("assets/");
		objLoader.load(
			modelName + ".obj",
			function(object) {
				object.position.y = point.y;
				object.position.x = point.x;
				object.position.z = point.z;
				scene.add(object);
			},
			onProgress,
			onError
		);
	});
};

export default init;
