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

		var hemHelper = new THREE.HemisphereLightHelper(light, 5);
		light.position.set(0, height, 0);

		scene.add(hemHelper);
		scene.add(light);
		var pointLight = new THREE.PointLight(0xff0000, 1, 100);
		var pointLightHelper = new THREE.PointLightHelper(pointLight, 5);
		pointLight.castShadow = true;
		pointLight.position.set(center.x + 200, 500, center.z);
		scene.add(pointLightHelper);
		scene.add(pointLight);

		dirLight = new THREE.DirectionalLight(0xffffff, 0);
		dirLight.color.setHSL(1, 1, 0.1);

		dirLight.castShadow = true;

		dirLight.shadow.mapSize.width = 1024;
		dirLight.shadow.mapSize.height = 1024;

		dirLight.shadow.camera.far = height + tol;
		dirLight.shadow.bias = -0.0001;
		dirLight.shadow.darkness = 0.2;
		dirLight.visible = true;
		dirLight.shadowCameraVisible = true;

		var dirHelper = new THREE.DirectionalLightHelper(dirLight, 5);

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
