import * as THREE from "three";
import Controller from "./controller";
import Floorplan from "./floorplan";
import Controls from "./controls";
import Lights from "./lights";
import Skybox from "./skybox";
import HUD from "./hud";
import Callbacks from "../../utils/callbacks";

export default function(model, element, canvasElement, opts) {
	var scope = this;

	this.itemSelectedCallbacks = new Callbacks();
	this.itemUnselectedCallbacks = new Callbacks();
	this.nothingClicked = new Callbacks();

	var options = {
		resize: true,
		pushHref: false,
		spin: true,
		spinSpeed: 0.00002,
		clickPan: true,
		canMoveFixedItems: false
	};

	// override with manually set options
	for (var opt in options) {
		if (options.hasOwnProperty(opt) && opts.hasOwnProperty(opt)) {
			options[opt] = opts[opt];
		}
	}

	let scene = model.scene;

	this.element = document.getElementById(element);
	var domElement;

	var camera;
	var renderer;
	this.controls;
	var canvas;
	var controller;
	var floorplan;

	var needsUpdate = false;

	var lastRender = Date.now();
	var mouseOver = false;
	var hasClicked = false;

	var hud;

	this.heightMargin;
	this.widthMargin;
	this.elementHeight;
	this.elementWidth;

	function init() {
		THREE.ImageUtils.crossOrigin = "";

		domElement = scope.element; // Container
		camera = new THREE.PerspectiveCamera(45, 1, 1, 10000);
		renderer = new THREE.WebGLRenderer({
			antialias: true,
			preserveDrawingBuffer: true // required to support .toDataURL()
		});
		renderer.autoClear = false;
		renderer.shadowMap.enabled = true;
		renderer.shadowMapSoft = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		var skybox = new Skybox(scene);

		scope.controls = new Controls(camera, domElement);

		hud = new HUD(scope);
		console.log(hud);

		controller = new Controller(
			scope,
			model,
			camera,
			scope.element,
			scope.controls,
			hud
		);

		domElement.appendChild(renderer.domElement);

		// handle window resizing
		scope.updateWindowSize();
		if (options.resize) {
			window.addEventListener("resize", () => scope.updateWindowSize);
		}

		// setup camera nicely
		scope.centerCamera();
		model.floorplan.fireOnUpdatedRooms(scope.centerCamera);

		var lights = new Lights(scene, model.floorplan);

		floorplan = new Floorplan(scene, model.floorplan, scope.controls);

		animate();
		scope.element.addEventListener("mouseenter", function() {
			mouseOver = true;
		});
		scope.element.addEventListener("mouseenter", function() {
			mouseOver = false;
		});
		scope.element.addEventListener("click", function(e) {
			hasClicked = true;
		});
	}

	function spin() {
		if (options.spin && !mouseOver && !hasClicked) {
			var theta =
				2 * Math.PI * options.spinSpeed * (Date.now() - lastRender);
			scope.controls.rotateLeft(theta);
			scope.controls.update();
		}
	}

	this.dataUrl = function() {
		var dataUrl = renderer.domElement.toDataURL("image/png");
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
		return camera;
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
		spin();
		if (shouldRender()) {
			renderer.clear();
			renderer.render(scene, camera);
			renderer.clearDepth();
			renderer.render(hud.getScene(), camera);
		}
		lastRender = Date.now();
	}

	function animate() {
		var delay = 50;
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
		var yOffset = 150.0;
		var pan = model.floorplan.getCenter();
		pan.y = yOffset;

		scope.controls.target = pan;

		var distance = model.floorplan.getSize().z * 1.5;

		var offset = pan.clone().add(new THREE.Vector3(0, distance, distance));
		camera.position.copy(offset);

		scope.controls.update();
	};

	// projects the object's center point into x,y screen coords
	// x,y are relative to top left corner of viewer
	this.projectVector = function(vec3, ignoreMargin) {
		ignoreMargin = ignoreMargin || false;

		var widthHalf = scope.elementWidth / 2;
		var heightHalf = scope.elementHeight / 2;

		var vector = new THREE.Vector3();
		vector.copy(vec3);
		vector.project(camera);

		var vec2 = new THREE.Vector2();

		vec2.x = vector.x * widthHalf + widthHalf;
		vec2.y = -(vector.y * heightHalf) + heightHalf;

		if (!ignoreMargin) {
			vec2.x += scope.widthMargin;
			vec2.y += scope.heightMargin;
		}

		return vec2;
	};

	init();
}
