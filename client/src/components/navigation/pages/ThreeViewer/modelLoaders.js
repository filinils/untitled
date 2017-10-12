import * as Three from "three";
import MTLLoader from "three-react-mtl-loader";
import OBJLoader from "three-obj-loader";
OBJLoader(Three);

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

	var onError = function(xhr) {
		console.log("Error in loadWireframeModel");
	};
	let objLoader = new Three.OBJLoader();
	let material = new Three.MeshBasicMaterial({
		color: 0xff0000,
		opacity: 0.5,
		transparent: true,
		wireframe: true
	});
	objLoader.setPath("assets/");
	objLoader.load(
		modelName + ".obj",
		function(object) {
			console.log("WIREFRAMEOBJ: ", object);
			object.children.forEach(c => (c.material = material));
			callback(object);
		},
		onProgress,
		onError
	);
};
