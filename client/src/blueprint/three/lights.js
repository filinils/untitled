import Utils from "../core/utils";
import * as THREE from "three";

export default function(scene, floorplan) {
	var scope = this;

	var tol = 1;
	var height = 1000; // TODO: share with Blueprint.Wall

	var dirLight;

	this.getDirLight = function() {
		return dirLight;
	};

	function init() {
		var center = floorplan.getCenter();
		var light = new THREE.HemisphereLight(0xffffff, 0x888888, 1.1);

		// var hemHelper = new THREE.HemisphereLightHelper(light, 1000);
		light.position.set(0, 30, 0);

		// scene.add(hemHelper);
		scene.add(light);

		var pointLight1 = new THREE.PointLight(0xffffff, 1, 400, 2);
		pointLight1.distance = 2000;
		pointLight1.castShadow = true;
		var pointLightHelper1 = new THREE.PointLightHelper(pointLight1, 100);
		pointLight1.position.set(800, 300, 50);
		var pointLight2 = new THREE.PointLight(0xffffff, 1, 400, 2);
		pointLight2.distance = 2000;
		pointLight2.castShadow = true;
		var pointLightHelper2 = new THREE.PointLightHelper(pointLight2, 100);
		pointLight2.position.set(900, 400, -500);

		// scene.add(pointLightHelper2);
		scene.add(pointLight2);
		// scene.add(pointLightHelper1);
		scene.add(pointLight1);

		dirLight = new THREE.DirectionalLight(0xffffff, 1);
		dirLight.color.setHSL(1, 1, 0.1);

		dirLight.castShadow = true;

		dirLight.shadow.mapSize.width = 1024;
		dirLight.shadow.mapSize.height = 1024;

		dirLight.shadow.camera.far = height + tol;
		dirLight.shadow.bias = -0.0001;
		dirLight.shadow.darkness = 0.2;
		dirLight.visible = true;

		// let cameraHelper = new THREE.CameraHelper(dirLight.shadow.camera);

		var dirHelper = new THREE.DirectionalLightHelper(dirLight, 1000);

		// scene.add(cameraHelper);

		scene.add(dirHelper);
		scene.add(dirLight);
		scene.add(dirLight.target);

		floorplan.fireOnUpdatedRooms(updateShadowCamera);
	}

	function updateShadowCamera() {
		var size = floorplan.getSize();
		var d = (Math.max(size.z, size.x) + tol) / 2.0;

		var center = floorplan.getCenter();
		var pos = new THREE.Vector3(center.x, height, center.z);
		dirLight.position.copy(pos);
		dirLight.target.position.copy(center);
		//dirLight.updateMatrix();
		//dirLight.updateWorldMatrix()
		dirLight.shadow.camera.left = -d;
		dirLight.shadow.camera.right = d;
		dirLight.shadow.camera.top = d;
		dirLight.shadow.camera.bottom = -d;
		// this is necessary for updates
		if (dirLight.shadowCamera) {
			dirLight.shadowCamera.left = dirLight.shadowCameraLeft;
			dirLight.shadowCamera.right = dirLight.shadowCameraRight;
			dirLight.shadowCamera.top = dirLight.shadowCameraTop;
			dirLight.shadowCamera.bottom = dirLight.shadowCameraBottom;
			dirLight.shadowCamera.updateProjectionMatrix();
		}
	}

	init();
}
