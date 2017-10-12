import * as THREE from "three";
import Utils from "../core/utils";
import Configuration from "../core/configuration";
import * as Core from "../core/configuration";

/** The default wall texture. */
const defaultWallTexture = {
  url: "rooms/textures/wallmap.png",
  stretch: true,
  scale: 0
};

/** 
   * A Wall is the basic element to create Rooms.
   * 
   * Walls consists of two half edges.
   */
export default () => {
  /** The unique id of each wall. */
  let id;

  /** Front is the plane from start to end. */
  let frontEdge = null;

  /** Back is the plane from end to start. */
  let backEdge = null;

  /** */
  let orphan = false;

  /** Items attached to this wall */
  let items = [];

  /** */
  let onItems = [];

  /** The front-side texture. */
  let frontTexture = defaultWallTexture;

  /** The back-side texture. */
  let backTexture = defaultWallTexture;

  /** Wall thickness. */
  let thickness = Configuration.getNumericValue(Core.configWallThickness);

  /** Wall height. */
  let height = Configuration.getNumericValue(Core.configWallHeight);

  /** Actions to be applied after movement. */

  /** 
     * Constructs a new wall.
     * @param start Start corner.
     * @param end End corner.
     */

  this.id = this.getUuid();

  this.start.attachStart(this);
  this.end.attachEnd(this);

  function getUuid() {
    return [this.start.id, this.end.id].join();
  }

  function resetFrontBack() {
    this.frontEdge = null;
    this.backEdge = null;
    this.orphan = false;
  }

  function snapToAxis(tolerance) {
    // order here is important, but unfortunately arbitrary
    this.start.snapToAxis(tolerance);
    this.end.snapToAxis(tolerance);
  }

  function fireOnMove(func) {
    this.moved_callbacks.add(func);
  }

  function fireOnDelete(func) {
    this.deleted_callbacks.add(func);
  }

  function dontFireOnDelete(func) {
    this.deleted_callbacks.remove(func);
  }

  function fireOnAction(func) {
    this.action_callbacks.add(func);
  }

  function fireAction(action) {
    this.action_callbacks.fire(action);
  }

  function relativeMove(dx, dy) {
    this.start.relativeMove(dx, dy);
    this.end.relativeMove(dx, dy);
  }

  function fireMoved() {
    this.moved_callbacks.fire();
  }

  function fireRedraw() {
    if (this.frontEdge) {
      this.frontEdge.redrawCallbacks.fire();
    }
    if (this.backEdge) {
      this.backEdge.redrawCallbacks.fire();
    }
  }

  function getStart() {
    return this.start;
  }

  function getEnd() {
    return this.end;
  }

  function getStartX() {
    return this.start.getX();
  }

  function getEndX() {
    return this.end.getX();
  }

  function getStartY() {
    return this.start.getY();
  }

  function getEndY() {
    return this.end.getY();
  }

  function remove() {
    this.start.detachWall(this);
    this.end.detachWall(this);
    this.deleted_callbacks.fire(this);
  }

  function setStart(corner) {
    this.start.detachWall(this);
    corner.attachStart(this);
    this.start = corner;
    this.fireMoved();
  }

  function setEnd(corner) {
    this.end.detachWall(this);
    corner.attachEnd(this);
    this.end = corner;
    this.fireMoved();
  }

  function distanceFrom(x, y) {
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
  function oppositeCorner(corner) {
    if (this.start === corner) {
      return this.end;
    } else if (this.end === corner) {
      return this.start;
    } else {
      console.log("Wall does not connect to corner");
    }
  }
};
