import * as Three from "three";
import MTLLoader from "three-react-mtl-loader";
// import OBJLoader from "three-react-obj-loader";
import OBJLoader from "three-obj-loader";
OBJLoader(Three);

function init(data) {
	var container, stats;
	var camera, scene, renderer;

	container = document.createElement("div");
	document.body.appendChild(container);

	camera = new Three.PerspectiveCamera(
		45,
		window.innerWidth / window.innerHeight,
		1,
		10000
	);
	camera.position.set(500, 800, 1300);
	camera.lookAt(new Three.Vector3());
	scene = new Three.Scene();
	scene.background = new Three.Color(0xf0f0f0);

	// var ambient = new Three.AmbientLight(0x444444);
	// scene.add(ambient);
	// var directionalLight = new Three.DirectionalLight(0xffeedd);
	// directionalLight.position.set(0, 0, 1).normalize();
	// scene.add(directionalLight);
	// model

	//
	renderer = new Three.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	container.appendChild(renderer.domElement);

	return { container, stats, camera, scene, renderer };
}

export const loadModel = (modelName, callback) => {
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
		let objLoader = new Three.OBJLoader();
		objLoader.setMaterials(materials);
		objLoader.setPath("assets/");
		objLoader.load(
			modelName + ".obj",
			function(object) {
				callback(object);
			},
			onProgress,
			onError
		);
	});
};

export const loadWireframeModel = (modelName, callback) => {
	var onProgress = function(xhr) {
		if (xhr.lengthComputable) {
			var percentComplete = xhr.loaded / xhr.total * 100;
			console.log(Math.round(percentComplete, 2) + "% downloaded");
		}
	};

	var onError = function(xhr) {};
	let material = new Three();
	let objLoader = new Three.OBJLoader();
	objLoader.setMaterials(materials);
	objLoader.setPath("assets/");
	objLoader.load(
		modelName + ".obj",
		function(object) {
			callback(object);
		},
		onProgress,
		onError
	);
};

export default init;
