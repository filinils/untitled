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

  let id = getUuid();

  let start;
  let end;

  start.attachStart(this);
  end.attachEnd(this);

  function getUuid() {
    return [start.id, end.id].join();
  }

  function resetFrontBack() {
    this.frontEdge = null;
    this.backEdge = null;
    this.orphan = false;
  }

  function snapToAxis(tolerance) {
    // order here is important, but unfortunately arbitrary
    start.snapToAxis(tolerance);
    end.snapToAxis(tolerance);
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
    start.relativeMove(dx, dy);
    end.relativeMove(dx, dy);
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
    return start;
  }

  function getEnd() {
    return end;
  }

  function getStartX() {
    return start.getX();
  }

  function getEndX() {
    return end.getX();
  }

  function getStartY() {
    return start.getY();
  }

  function getEndY() {
    return end.getY();
  }

  function remove() {
    start.detachWall(this);
    end.detachWall(this);
    this.deleted_callbacks.fire(this);
  }

  function setStart(corner) {
    start.detachWall(this);
    corner.attachStart(this);
    start = corner;
    this.fireMoved();
  }

  function setEnd(corner) {
    end.detachWall(this);
    corner.attachEnd(this);
    end = corner;
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
    if (start === corner) {
      return end;
    } else if (end === corner) {
      return start;
    } else {
      console.log("Wall does not connect to corner");
    }
  }
};
