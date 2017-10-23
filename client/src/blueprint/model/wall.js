import Corner from "./corner";
import Utils from "../core/utils";
import Item from "../items/item";
import HalfEdge from "./half_edge";
import Configuration from "../core/configuration";
import * as Core from "../core/configuration";
import Callbacks from "../../utils/callbacks";

/** The default wall texture. */
const defaultWallTexture = {
	url: "assets/rooms/textures/wallmap.png",
	stretch: true,
	scale: 0
};

/** 
   * A Wall is the basic element to create Rooms.
   * 
   * Walls consists of two half edges.
   */
export default class Wall {
	/** 
     * Constructs a new wall.
     * @param start Start corner.
     * @param end End corner.
     */
	constructor(start, end) {
		this.start = start;
		this.end = end;
		this.id = this.getUuid();

		this.start.attachStart(this);
		this.end.attachEnd(this);

		this.frontEdge = null;
		this.backEdge = null;
		this.orphan = false;
		this.items = [];
		this.onItems = [];
		this.frontTexture = defaultWallTexture;
		this.backTexture = defaultWallTexture;
		this.thickness = Configuration.getNumericValue(
			Core.configWallThickness
		);
		this.height = Configuration.getNumericValue(Core.configWallHeight);
		this.getUuid = this.getUuid.bind(this);

		this.deleted_callbacks = new Callbacks();
		/** Actions to be applied after movement. */
		this.moved_callbacks = new Callbacks();

		// /** Actions to be applied on removal. */

		// /** Actions to be applied explicitly. */
		this.action_callbacks = new Callbacks();
	}

	getUuid() {
		return [this.start.id, this.end.id].join();
	}

	resetFrontBack() {
		this.frontEdge = null;
		this.backEdge = null;
		this.orphan = false;
	}

	snapToAxis(tolerance) {
		// order here is important, but unfortunately arbitrary
		this.start.snapToAxis(tolerance);
		this.end.snapToAxis(tolerance);
	}

	fireOnMove(func) {
		this.moved_callbacks.add(func);
	}

	fireOnDelete(func) {
		this.deleted_callbacks.add(func);
	}

	dontFireOnDelete(func) {
		this.deleted_callbacks.remove(func);
	}

	fireOnAction(func) {
		this.action_callbacks.add(func);
	}

	fireAction(action) {
		this.action_callbacks.fire(action);
	}

	relativeMove(dx, dy) {
		this.start.relativeMove(dx, dy);
		this.end.relativeMove(dx, dy);
	}

	fireMoved() {
		this.moved_callbacks.fire();
	}

	fireRedraw() {
		if (this.frontEdge) {
			this.frontEdge.redrawCallbacks.fire();
		}
		if (this.backEdge) {
			this.backEdge.redrawCallbacks.fire();
		}
	}

	getStart() {
		return this.start;
	}

	getEnd() {
		return this.end;
	}

	getStartX() {
		return this.start.getX();
	}

	getEndX() {
		return this.end.getX();
	}

	getStartY() {
		return this.start.getY();
	}

	getEndY() {
		return this.end.getY();
	}

	remove() {
		this.start.detachWall(this);
		this.end.detachWall(this);
		this.deleted_callbacks.fire(this);
	}

	setStart(corner) {
		this.start.detachWall(this);
		corner.attachStart(this);
		this.start = corner;
		this.fireMoved();
	}

	setEnd(corner) {
		this.end.detachWall(this);
		corner.attachEnd(this);
		this.end = corner;
		this.fireMoved();
	}

	distanceFrom(x, y) {
		return Utils.pointDistanceFromLine(
			x,
			y,
			this.getStartX(),
			this.getStartY(),
			this.getEndX(),
			this.getEndY()
		);
	}

	/** Return the corner opposite of the one provided.
     * @param corner The given corner.
     * @returns The opposite corner.
     */
	oppositeCorner(corner) {
		if (this.start === corner) {
			return this.end;
		} else if (this.end === corner) {
			return this.start;
		} else {
			console.log("Wall does not connect to corner");
		}
	}
}
