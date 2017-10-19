import Wall from "./wall";
import FloorPlan from "./floorplan";
import Callbacks from "../../utils/callbacks";
import Utils from "../core/utils";

const cornerTolerance = 20;

/**
   * Corners are used to define Walls.
   */
export default (floorplan, x, y, newId) => {
	let id = newId || Utils.guid();
	let wallStarts = [];
	let wallEnds = [];

	let moved_callbacks = Callbacks();

	/** Callbacks to be fired on removal. */
	let deleted_callbacks = Callbacks();

	/** Callbacks to be fired in case of action. */
	let action_callbacks = Callbacks();

	/** Add function to moved callbacks.
     * @param func The function to be added.
    */
	function fireOnMove(func) {
		moved_callbacks.add(func);
	}

	/** Add function to deleted callbacks.
     * @param func The function to be added.
     */
	function fireOnDelete(func) {
		//deleted_callbacks.add(func);
	}

	/** Add function to action callbacks.
     * @param func The function to be added.
     */
	function fireOnAction(func) {
		action_callbacks.add(func);
	}

	/**
     * @returns
     * @deprecated
     */
	function getX() {
		return x;
	}

	/**
     * @returns
     * @deprecated
     */
	function getY() {
		return y;
	}

	/**
     * 
     */
	function snapToAxis(tolerance) {
		// try to snap this corner to an axis
		var snapped = {
			x: false,
			y: false
		};

		adjacentCorners().forEach(corner => {
			if (Math.abs(corner.x - x) < tolerance) {
				x = corner.x;
				snapped.x = true;
			}
			if (Math.abs(corner.y - y) < tolerance) {
				y = corner.y;
				snapped.y = true;
			}
		});
		return snapped;
	}

	/** Moves corner relatively to new position.
     * @param dx The delta x.
     * @param dy The delta y.
     */
	function relativeMove(dx, dy) {
		move(x + dx, y + dy);
	}

	function fireAction(action) {
		action_callbacks.fire(action);
	}

	/** Remove callback. Fires the delete callbacks. */
	function remove() {
		deleted_callbacks.fire(this);
	}

	/** Removes all walls. */
	function removeAll() {
		for (var i = 0; i < wallStarts.length; i++) {
			wallStarts[i].remove();
		}
		for (var i = 0; i < wallEnds.length; i++) {
			wallEnds[i].remove();
		}
		remove();
	}

	/** Moves corner to new position.
     * @param newX The new x position.
     * @param newY The new y position.
     */
	function move(newX, newY) {
		x = newX;
		y = newY;
		mergeWithIntersected();
		moved_callbacks.fire(x, y);

		wallStarts.forEach(wall => {
			wall.fireMoved();
		});

		wallEnds.forEach(wall => {
			wall.fireMoved();
		});
	}

	/** Gets the adjacent corners.
     * @returns Array of corners.
     */
	function adjacentCorners() {
		let retArray = [];
		let i;
		for (i = 0; i < wallStarts.length; i++) {
			retArray.push(wallStarts[i].end);
		}
		for (i = 0; i < wallEnds.length; i++) {
			retArray.push(wallEnds[i].start);
		}
		return retArray;
	}

	/** Checks if a wall is connected.
     * @param wall A wall.
     * @returns True in case of connection.
     */
	function isWallConnected(wall) {
		let i;
		for (i = 0; i < wallStarts.length; i++) {
			if (wallStarts[i] == wall) {
				return true;
			}
		}
		for (i = 0; i < wallEnds.length; i++) {
			if (wallEnds[i] == wall) {
				return true;
			}
		}
		return false;
	}

	/**
     * 
     */
	function distanceFrom(x, y) {
		var distance = Utils.distance(x, y, x, y);
		return distance;
	}

	/** Gets the distance from a wall.
     * @param wall A wall.
     * @returns The distance.
     */
	function distanceFromWall(wall) {
		return wall.distanceFrom(x, y);
	}

	/** Gets the distance from a corner.
     * @param corner A corner.
     * @returns The distance.
     */
	function distanceFromCorner(corner) {
		return distanceFrom(corner.x, corner.y);
	}

	/** Detaches a wall.
     * @param wall A wall.
     */
	function detachWall(wall) {
		Utils.removeValue(wallStarts, wall);
		Utils.removeValue(wallEnds, wall);
		if (wallStarts.length == 0 && wallEnds.length == 0) {
			remove();
		}
	}

	/** Attaches a start wall.
     * @param wall A wall.
     */
	function attachStart(wall) {
		wallStarts.push(wall);
	}

	/** Attaches an end wall.
     * @param wall A wall.
     */
	function attachEnd(wall) {
		wallEnds.push(wall);
	}

	/** Get wall to corner.
     * @param corner A corner.
     * @return The associated wall or null.
     */
	function wallTo(corner) {
		for (var i = 0; i < wallStarts.length; i++) {
			if (wallStarts[i].getEnd() === corner) {
				return wallStarts[i];
			}
		}
		return null;
	}

	/** Get wall from corner.
     * @param corner A corner.
     * @return The associated wall or null.
     */
	function wallFrom(corner) {
		for (var i = 0; i < wallEnds.length; i++) {
			if (wallEnds[i].getStart() === corner) {
				return wallEnds[i];
			}
		}
		return null;
	}

	/** Get wall to or from corner.
     * @param corner A corner.
     * @return The associated wall or null.
     */
	function wallToOrFrom(corner) {
		return wallTo(corner) || wallFrom(corner);
	}

	/**
     * 
     */
	function combineWithCorner(corner) {
		// update position to other corner's
		x = corner.x;
		y = corner.y;
		// absorb the other corner's wallStarts and wallEnds
		for (var i = corner.wallStarts.length - 1; i >= 0; i--) {
			corner.wallStarts[i].setStart(this);
		}
		for (var i = corner.wallEnds.length - 1; i >= 0; i--) {
			corner.wallEnds[i].setEnd(this);
		}
		// delete the other corner
		corner.removeAll();
		removeDuplicateWalls();
		floorplan.update();
	}

	function mergeWithIntersected() {
		//console.log('mergeWithIntersected for object: ' + type);
		// check corners
		for (var i = 0; i < floorplan.a().getCorners().length; i++) {
			var corner = floorplan.getCorners()[i];
			if (
				distanceFromCorner(corner) < cornerTolerance &&
				corner != this
			) {
				combineWithCorner(corner);
				return true;
			}
		}
		// check walls
		for (var i = 0; i < floorplan.a().getWalls().length; i++) {
			var wall = floorplan.getWalls()[i];
			if (
				distanceFromWall(wall) < cornerTolerance &&
				!isWallConnected(wall)
			) {
				// update position to be on wall
				var intersection = Utils.closestPointOnLine(
					x,
					y,
					wall.getStart().x,
					wall.getStart().y,
					wall.getEnd().x,
					wall.getEnd().y
				);
				x = intersection.x;
				y = intersection.y;
				// merge this corner into wall by breaking wall into two parts
				floorplan.newWall(this, wall.getEnd());
				wall.setEnd(this);
				floorplan.update();
				return true;
			}
		}
		return false;
	}

	/** Ensure we do not have duplicate walls (i.e. same start and end points) */
	function removeDuplicateWalls() {
		// delete the wall between these corners, if it exists
		var wallEndpoints = {};
		var wallStartpoints = {};
		for (var i = wallStarts.length - 1; i >= 0; i--) {
			if (wallStarts[i].getEnd() === this) {
				// remove zero length wall
				wallStarts[i].remove();
			} else if (wallStarts[i].getEnd().id in wallEndpoints) {
				// remove duplicated wall
				wallStarts[i].remove();
			} else {
				wallEndpoints[wallStarts[i].getEnd().id] = true;
			}
		}
		for (var i = wallEnds.length - 1; i >= 0; i--) {
			if (wallEnds[i].getStart() === this) {
				// removed zero length wall
				wallEnds[i].remove();
			} else if (wallEnds[i].getStart().id in wallStartpoints) {
				// removed duplicated wall
				wallEnds[i].remove();
			} else {
				wallStartpoints[wallEnds[i].getStart().id] = true;
			}
		}
	}

	return {
		fireOnDelete,
		fireAction,
		fireOnMove,
		attachStart,
		attachEnd,
		adjacentCorners,
		getX,
		getY,
		distanceFrom,
		distanceFromWall,
		distanceFromCorner,
		move,
		snapToAxis,
		relativeMove,
		x,
		y,
		id
	};
};
