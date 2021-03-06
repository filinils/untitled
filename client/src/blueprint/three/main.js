import * as THREE from "three";
import Controller from "./controller";
import Floorplan from "./floorplan";
import Controls from "./controls";
import Lights from "./lights";
import Skybox from "./skybox";
import HUD from "./hud";
import Callbacks from "../../utils/callbacks";
import CAMERAS from "../../data/mockup/cameras";
import FPController from "../../lib/Three/Controls/FPController";

export default function(model, element, canvasElement, opts) {
    let scope = this;
    let activeCameraIndex = 0;
    let cameras = [];
    let sun = undefined;

    this.itemSelectedCallbacks = new Callbacks();
    this.itemUnselectedCallbacks = new Callbacks();
    this.nothingClicked = new Callbacks();

    const options = {
        resize: true,
        pushHref: false,
        spin: true,
        spinSpeed: 0.00002,
        clickPan: true,
        canMoveFixedItems: false
    };

    // override with manually set options
    for (let opt in options) {
        if (options.hasOwnProperty(opt) && opts.hasOwnProperty(opt)) {
            options[opt] = opts[opt];
        }
    }

    let scene = model.scene;

    this.element = document.getElementById(element);
    let domElement;

    let camera;
    let renderer;
    this.controls;
    let canvas;
    let controller;
    let floorplan;
    let fpController;

    let needsUpdate = false;

    let lastRender = Date.now();
    let mouseOver = false;
    let hasClicked = false;

    let hud;

    this.heightMargin;
    this.widthMargin;
    this.elementHeight;
    this.elementWidth;

    function init() {
        THREE.ImageUtils.crossOrigin = "";

        domElement = scope.element; // Container

        cameras = createCameras();
        camera = cameras[0];

        renderer = new THREE.WebGLRenderer({
            antialias: true,
            preserveDrawingBuffer: true // required to support .toDataURL()
        });
        renderer.autoClear = false;
        renderer.shadowMap.enabled = true;
        renderer.shadowMapSoft = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        const skybox = new Skybox(scene);

        fpController = new FPController(renderer, scene, model.floorplan);

        scope.controls = new Controls(cameras[activeCameraIndex], domElement);

        hud = new HUD(scope);

        controller = new Controller(
            scope,
            model,
            cameras[activeCameraIndex],
            scope.element,
            scope.controls,
            hud
        );

        domElement.appendChild(renderer.domElement);

        // handle window resizing
        scope.updateWindowSize();
        if (options.resize) {
            window.addEventListener("resize", scope.updateWindowSize);
        }

        // setup camera nicely
        scope.centerCamera();
        model.floorplan.fireOnUpdatedRooms(scope.centerCamera);

        const lights = new Lights(scene, model.floorplan);

        floorplan = new Floorplan(scene, model.floorplan, scope.controls);

        animate();
        scope.element.addEventListener("mouseenter", function() {
            mouseOver = true;
        });
        scope.element.addEventListener("mouseenter", function() {
            mouseOver = false;
        });
        scope.element.addEventListener("click", function() {
            hasClicked = true;
        });
        window.addEventListener("keydown", function(event) {
            switch (event.keyCode) {
                case 32: //space
                    changeCamera();
                    break;
                case 48: //0
                    toggleFPController();
                    break;
            }
        });
    }

    function spin() {
        if (options.spin && !mouseOver && !hasClicked) {
            const theta =
                2 * Math.PI * options.spinSpeed * (Date.now() - lastRender);
            scope.controls.rotateLeft(theta);
            scope.controls.update();
        }
    }
    function changeCamera() {
        if (!scope.controls.enabled || !controller.enabled) return;

        let currentCameraIndex = activeCameraIndex;
        activeCameraIndex += 1;
        if (activeCameraIndex >= cameras.length) activeCameraIndex = 0;
        scope.controls.object = cameras[activeCameraIndex];
        scope.controls.update();
        controller.setCamera(cameras[activeCameraIndex]);
        floorplan.updateEdges();
        setCameraTransform(cameras[currentCameraIndex], currentCameraIndex);
    }
    function createCameras() {
        let camsData = CAMERAS;
        let cameras = [];
        camsData.forEach((item, index) => {
            let camera = new THREE.PerspectiveCamera(
                item.fov,
                2.195,
                0.1,
                1000000
            );
            setCameraTransform(camera, index);
            cameras.push(camera);
        });

        return cameras;
    }

    function setCameraTransform(camera, index) {
        let item = CAMERAS[index];
        camera.zoom = item.zoom;
        camera.updateProjectionMatrix();
        let rotation = new THREE.Euler(
            item.rotation.x,
            item.rotation.y,
            item.rotation.z
        );
        camera.position.x = item.position.x;
        camera.position.y = item.position.y;
        camera.position.z = item.position.z;
        camera.rotation.x = rotation.x;
        camera.rotation.y = rotation.y;
        camera.rotation.z = rotation.y;
    }

    function toggleFPController() {
        let toggle = !fpController.enabled;
        scope.controls.enabled = !toggle;
        controller.enabled = !toggle;
        fpController.setEnable(toggle);

        if (!toggle) {
            scope.controls.needsUpdate = controller.needsUpdate = needsUpdate = model.scene.needsUpdate = true;
        }
    }

    this.dataUrl = function() {
        const dataUrl = renderer.domElement.toDataURL("image/png");
        return dataUrl;
    };

    this.stopSpin = function() {
        hasClicked = true;
    };

    this.options = function() {
        return options;
    };

    this.getModel = function() {
        return model;
    };

    this.getScene = function() {
        return scene;
    };

    this.getController = function() {
        return controller;
    };

    this.getCamera = function() {
        return cameras[activeCameraIndex];
    };

    this.needsUpdate = function() {
        needsUpdate = true;
    };
    function shouldRender() {
        // Do we need to draw a new frame
        if (
            scope.controls.needsUpdate ||
            controller.needsUpdate ||
            needsUpdate ||
            model.scene.needsUpdate
        ) {
            scope.controls.needsUpdate = false;
            controller.needsUpdate = false;
            needsUpdate = false;
            model.scene.needsUpdate = false;
            return true;
        } else {
            return false;
        }
    }

    function render() {
        if (fpController.enabled) {
            floorplan.updateEdges();
            fpController.render();
            return;
        }

        renderSun();

        // if (shouldRender()) {
        renderer.clear();
        renderer.render(scene, cameras[activeCameraIndex]);
        renderer.clearDepth();
        renderer.render(hud.getScene(), cameras[activeCameraIndex]);
        // }
        lastRender = Date.now();
    }

    function animate() {
        const delay = 30;
        setTimeout(function() {
            requestAnimationFrame(animate);
        }, delay);
        render();
    }

    this.rotatePressed = function() {
        controller.rotatePressed();
    };

    this.rotateReleased = function() {
        controller.rotateReleased();
    };

    this.setCursorStyle = function(cursorStyle) {
        domElement.style.cursor = cursorStyle;
    };

    this.updateWindowSize = function() {
        scope.heightMargin = scope.element.offsetTop;
        scope.widthMargin = scope.element.offsetLeft;

        scope.elementWidth = scope.element.offsetWidth;
        if (options.resize) {
            scope.elementHeight = window.innerHeight - scope.heightMargin;
        } else {
            scope.elementHeight = scope.element.offsetHeight;
        }

        camera.aspect = scope.elementWidth / scope.elementHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(scope.elementWidth, scope.elementHeight);
        needsUpdate = true;
    };

    this.centerCamera = function() {
        const yOffset = 150.0;
        const pan = model.floorplan.getCenter();
        pan.y = yOffset;

        scope.controls.target = pan;

        const distance = model.floorplan.getSize().z * 1.5;

        const offset = pan
            .clone()
            .add(new THREE.Vector3(0, distance, distance));
        camera.position.copy(offset);

        scope.controls.update();
    };

    // projects the object's center point into x,y screen coords
    // x,y are relative to top left corner of viewer
    this.projectVector = function(vec3, ignoreMargin) {
        ignoreMargin = ignoreMargin || false;

        const widthHalf = scope.elementWidth / 2;
        const heightHalf = scope.elementHeight / 2;

        const vector = new THREE.Vector3();
        vector.copy(vec3);
        vector.project(camera);

        const vec2 = new THREE.Vector2();

        vec2.x = vector.x * widthHalf + widthHalf;
        vec2.y = -(vector.y * heightHalf) + heightHalf;

        if (!ignoreMargin) {
            vec2.x += scope.widthMargin;
            vec2.y += scope.heightMargin;
        }

        return vec2;
    };

    const renderSun = () => {
        if (sun === undefined) {
            sun = scene.sun;
            return;
        } else {
            /* Rendering sun */
            sun.position.set(
                sun.states[sun.state].x,
                sun.states[sun.state].y,
                sun.states[sun.state].z
            );
        }
    };
    init();
}
