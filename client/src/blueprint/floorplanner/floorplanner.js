import Floorplan from "../model/floorplan";
import FloorplannerView, { floorplannerModes } from "./floorplanner_view";
import Callbacks from "../../utils/callbacks";

/** how much will we move a corner to make a wall axis aligned (cm) */
const snapTolerance = 25;
/** 
   * The Floorplanner implements an interactive tool for creation of floorplans.
   */
export default class Floorplanner {
	constructor(canvas, floorplan) {
		this.canvasElement = document.getElementById(canvas);
		this.modeResetCallbacks = new Callbacks();

		this.canvas = canvas;
		this.floorplan = floorplan;
		this.view = new FloorplannerView(this.floorplan, this, canvas);

		var cmPerFoot = 30.48;
		var pixelsPerFoot = 15.0;
		this.cmPerPixel = cmPerFoot * (1.0 / pixelsPerFoot);
		this.pixelsPerCm = 1.0 / this.cmPerPixel;

		this.wallWidth = 10.0 * this.pixelsPerCm;
		this.setMode(floorplannerModes.MOVE);

		var scope = this;

		this.canvasElement.addEventListener("mousedown", () =>
			scope.mousedown()
		);
		this.canvasElement.addEventListener("mousemove", e =>
			scope.mousemove(event)
		);
		this.canvasElement.addEventListener("mouseup", () => scope.mouseup());

		this.canvasElement.addEventListener("mouseleave", () => {
			scope.mouseleave();
		});

		document.addEventListener("keyup", e => {
			if (e.keyCode == 27) {
				scope.escapeKey();
			}
		});

		floorplan.roomLoadedCallbacks.add(() => {
			scope.reset();
		});

		let mode = 0;

		let activeWall = null;

		let activeCorner = null;

		let originX = 0;

		let originY = 0;

		let targetX = 0;

		let targetY = 0;

		let lastNode = null;

		let wallWidth;

		let modeResetCallbacks = new Callbacks();

		let canvasElement;

		let view;

		let mouseDown = false;

		let mouseMoved = false;

		let mouseX = 0;

		let mouseY = 0;

		let rawMouseX = 0;

		/** in ThreeJS coords */
		let rawMouseY = 0;

		/** mouse position at last click */
		let lastX = 0;

		/** mouse position at last click */
		let lastY = 0;

		/** */
		let cmPerPixel;

		/** */
		let pixelsPerCm;

		/* Bindings */
		this.updateTarget = this.updateTarget.bind(this);
	}

	/** */
	escapeKey() {
		this.setMode(floorplannerModes.MOVE);
	}

	/** */
	updateTarget() {
		if (this.mode == floorplannerModes.DRAW && this.lastNode) {
			if (Math.abs(this.mouseX - this.lastNode.x) < snapTolerance) {
				this.targetX = this.lastNode.x;
			} else {
				this.targetX = this.mouseX;
			}
			if (Math.abs(this.mouseY - this.lastNode.y) < snapTolerance) {
				this.targetY = this.lastNode.y;
			} else {
				this.targetY = this.mouseY;
			}
		} else {
			this.targetX = this.mouseX;
			this.targetY = this.mouseY;
		}

		this.view.draw();
	}

	/** */
	mousedown() {
		this.mouseDown = true;
		this.mouseMoved = false;
		this.lastX = this.rawMouseX;
		this.lastY = this.rawMouseY;

		// delete
		if (this.mode == floorplannerModes.DELETE) {
			if (this.activeCorner) {
				this.activeCorner.removeAll();
			} else if (this.activeWall) {
				this.activeWall.remove();
			} else {
				this.setMode(floorplannerModes.MOVE);
			}
		}
	}

	/** */
	mousemove(event) {
		this.mouseMoved = true;

		// update mouse
		this.rawMouseX = event.clientX;
		this.rawMouseY = event.clientY;

		this.mouseX =
			(event.clientX - this.canvasElement.offsetLeft) * this.cmPerPixel +
			this.originX * this.cmPerPixel;
		this.mouseY =
			(event.clientY - this.canvasElement.offsetTop) * this.cmPerPixel +
			this.originY * this.cmPerPixel;

		// update target (snapped position of actual mouse)
		if (
			this.mode == floorplannerModes.DRAW ||
			(this.mode == floorplannerModes.MOVE && this.mouseDown)
		) {
			this.updateTarget();
		}

		// update object target
		if (this.mode != floorplannerModes.DRAW && !this.mouseDown) {
			var hoverCorner = this.floorplan.overlappedCorner(
				this.mouseX,
				this.mouseY
			);
			var hoverWall = this.floorplan.overlappedWall(
				this.mouseX,
				this.mouseY
			);
			var draw = false;
			if (hoverCorner != this.activeCorner) {
				this.activeCorner = hoverCorner;
				draw = true;
			}
			// corner takes precendence
			if (this.activeCorner == null) {
				if (hoverWall != this.activeWall) {
					this.activeWall = hoverWall;
					draw = true;
				}
			} else {
				this.activeWall = null;
			}
			if (draw) {
				this.view.draw();
			}
		}

		// panning
		if (this.mouseDown && !this.activeCorner && !this.activeWall) {
			this.originX += this.lastX - this.rawMouseX;
			this.originY += this.lastY - this.rawMouseY;
			this.lastX = this.rawMouseX;
			this.lastY = this.rawMouseY;
			this.view.draw();
		}

		// dragging
		if (this.mode == floorplannerModes.MOVE && this.mouseDown) {
			if (this.activeCorner) {
				this.activeCorner.move(this.mouseX, this.mouseY);
				this.activeCorner.snapToAxis(snapTolerance);
			} else if (this.activeWall) {
				this.activeWall.relativeMove(
					(this.rawMouseX - this.lastX) * this.cmPerPixel,
					(this.rawMouseY - this.lastY) * this.cmPerPixel
				);
				this.activeWall.snapToAxis(snapTolerance);
				this.lastX = this.rawMouseX;
				this.lastY = this.rawMouseY;
			}
			this.view.draw();
		}
	}

	/** */
	mouseup() {
		this.mouseDown = false;

		// drawing
		if (this.mode == floorplannerModes.DRAW && !this.mouseMoved) {
			var corner = this.floorplan.newCorner(this.targetX, this.targetY);
			if (this.lastNode != null) {
				this.floorplan.newWall(this.lastNode, corner);
			}
			if (corner.mergeWithIntersected() && this.lastNode != null) {
				this.setMode(floorplannerModes.MOVE);
			}
			this.lastNode = corner;
		}
	}

	/** */
	mouseleave() {
		this.mouseDown = false;
		// Commentet out originally
		//scope.setMode(scope.modes.MOVE);
	}

	/** */
	reset() {
		this.resizeView();
		this.setMode(floorplannerModes.MOVE);
		this.resetOrigin();
		this.view.draw();
	}

	/** */
	resizeView() {
		this.view.handleWindowResize();
	}

	/** */
	setMode(mode) {
		this.lastNode = null;
		this.mode = mode;
		this.modeResetCallbacks.fire(mode);
		this.updateTarget();
	}

	/** Sets the origin so that floorplan is centered */
	resetOrigin() {
		var centerX = this.canvasElement.offsetWidth / 2.0;
		var centerY = this.canvasElement.offsetHeight / 2.0;
		var centerFloorplan = this.floorplan.getCenter();
		this.originX = centerFloorplan.x * this.pixelsPerCm - centerX;
		this.originY = centerFloorplan.z * this.pixelsPerCm - centerY;
	}

	/** Convert from THREEjs coords to canvas coords. */
	convertX(x) {
		return (x - this.originX * this.cmPerPixel) * this.pixelsPerCm;
	}

	/** Convert from THREEjs coords to canvas coords. */
	convertY(y) {
		return (y - this.originY * this.cmPerPixel) * this.pixelsPerCm;
	}
}
