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

        /* Daylight */
        var light = new THREE.HemisphereLight(0xffffff, 0x888888, 1.1);
        // light.position.set(0, 30, 0);
        light.position.set(center.x, center.y, center.z);

        // var hemHelper = new THREE.HemisphereLightHelper(light, 1000);
        // scene.add(hemHelper);
        scene.add(light);

        /* Sun */
        let sunLight = new THREE.PointLight(0xffffff, 1, 400, 2);
        sunLight.distance = 2000;
        sunLight.castShadow = true;
        var pointLightHelper2 = new THREE.PointLightHelper(sunLight, 100);

        sunLight.states = {
            night: { x: 400, y: 200, z: -500 },
            morning: { x: 600, y: 300, z: -500 },
            noon: { x: 900, y: 400, z: -500 },
            evening: { x: 1100, y: 300, z: -500 },
            night2: { x: 1100, y: 200, z: -500 }
        };

        sunLight.position.set(
            sunLight.states.noon.x,
            sunLight.states.noon.y,
            sunLight.states.noon.y
        );

        sunLight.state = "noon";

        pointLightHelper2.name = "Sun helper";
        scene.add(pointLightHelper2);
        sunLight.name = "Sun";
        window.sun = sunLight;
        scene.add(sunLight);
        scene.sun = sunLight;

        /* */
        // dirLight = new THREE.DirectionalLight(0xffffff, 1);
        // dirLight.color.setHSL(1, 1, 0.1);

        // dirLight.castShadow = true;

        // dirLight.shadow.mapSize.width = 1024;
        // dirLight.shadow.mapSize.height = 1024;

        // dirLight.shadow.camera.far = height + tol;
        // dirLight.shadow.bias = -0.0001;
        // dirLight.shadow.darkness = 0.2;
        // dirLight.visible = true;

        // // let cameraHelper = new THREE.CameraHelper(dirLight.shadow.camera);

        // var dirHelper = new THREE.DirectionalLightHelper(dirLight, 1000);

        // // scene.add(cameraHelper);

        // scene.add(dirHelper);
        // scene.add(dirLight);
        // scene.add(dirLight.target);

        floorplan.fireOnUpdatedRooms(updateShadowCamera);
    }

    function updateShadowCamera() {
        var size = floorplan.getSize();
        var d = (Math.max(size.z, size.x) + tol) / 2.0;

        var center = floorplan.getCenter();
        var pos = new THREE.Vector3(center.x, height, center.z);
        // dirLight.position.copy(pos);
        // dirLight.target.position.copy(center);
        //dirLight.updateMatrix();
        //dirLight.updateWorldMatrix()
        // dirLight.shadow.camera.left = -d;
        // dirLight.shadow.camera.right = d;
        // dirLight.shadow.camera.top = d;
        // dirLight.shadow.camera.bottom = -d;
        // this is necessary for updates
        // if (dirLight.shadowCamera) {
        //     dirLight.shadowCamera.left = dirLight.shadowCameraLeft;
        //     dirLight.shadowCamera.right = dirLight.shadowCameraRight;
        //     dirLight.shadowCamera.top = dirLight.shadowCameraTop;
        //     dirLight.shadowCamera.bottom = dirLight.shadowCameraBottom;
        //     dirLight.shadowCamera.updateProjectionMatrix();
        // }
    }

    init();
}
