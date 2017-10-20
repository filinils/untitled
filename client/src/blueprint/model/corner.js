import Wall from "./wall";
import FloorPlan from "./floorplan";
import Callbacks from "../../utils/callbacks";
import Utils from "../core/utils";

/**
   * Corners are used to define Walls.
   */
export default class Corner {
	constructor(floorplan, x, y, id) {
		this.id = id || Utils.guid();

		this.x = x;
		this.y = y;
		this.floorplan = floorplan;

		this.wallStarts = [];
		this.wallEnds = [];
		this.moved_callbacks = new Callbacks();
		this.deleted_callbacks = new Callbacks();
		this.action_callbacks = new Callbacks();

		this.cornerTolerancer = 20;
	}

	fireOnMove(func) {
		this.moved_callbacks.add(func);
	}

	fireOnDelete(func) {
		this.deleted_callbacks.add(func);
	}

	fireOnAction(func) {
		this.action_callbacks.add(func);
	}

	/**
     * @returns
     * @deprecated
     */
	getX() {
		return this.x;
	}

	/**
     * @returns
     * @deprecated
     */
	getY() {
		return this.y;
	}

	/**
     * 
     */
	snapToAxis(tolerance) {
		// try to snap this corner to an axis
		var snapped = {
			x: false,
			y: false
		};

		var scope = this;

		this.adjacentCorners().forEach(corner => {
			if (Math.abs(corner.x - scope.x) < tolerance) {
				scope.x = corner.x;
				snapped.x = true;
			}
			if (Math.abs(corner.y - scope.y) < tolerance) {
				scope.y = corner.y;
				snapped.y = true;
			}
		});
		return snapped;
	}

	/** Moves corner relatively to new position.
     * @param dx The delta x.
     * @param dy The delta y.
     */
	relativeMove(dx, dy) {
		this.move(this.x + dx, this.y + dy);
	}

	fireAction(action) {
		this.action_callbacks.fire(action);
	}

	/** Remove callback. Fires the delete callbacks. */
	remove() {
		this.deleted_callbacks.fire(this);
	}

	/** Removes all walls. */
	removeAll() {
		let i;
		for (i = 0; i < this.wallStarts.length; i++) {
			this.wallStarts[i].remove();
		}
		for (i = 0; i < this.wallEnds.length; i++) {
			this.wallEnds[i].remove();
		}
		this.remove();
	}

	/** Moves corner to new position.
     * @param newX The new x position.
     * @param newY The new y position.
     */
	move(newX, newY) {
		this.x = newX;
		this.y = newY;
		this.mergeWithIntersected();
		this.moved_callbacks.fire(this.x, this.y);

		this.wallStarts.forEach(wall => {
			wall.fireMoved();
		});

		this.wallEnds.forEach(wall => {
			wall.fireMoved();
		});
	}

	/** Gets the adjacent corners.
     * @returns Array of corners.
     */
	adjacentCorners() {
		var retArray = [];
		let i;
		for (i = 0; i < this.wallStarts.length; i++) {
			retArray.push(this.wallStarts[i].getEnd());
		}
		for (i = 0; i < this.wallEnds.length; i++) {
			retArray.push(this.wallEnds[i].getStart());
		}
		return retArray;
	}

	/** Checks if a wall is connected.
     * @param wall A wall.
     * @returns True in case of connection.
     */
	isWallConnected(wall) {
		let i;
		for (i = 0; i < this.wallStarts.length; i++) {
			if (this.wallStarts[i] == wall) {
				return true;
			}
		}
		for (i = 0; i < this.wallEnds.length; i++) {
			if (this.wallEnds[i] == wall) {
				return true;
			}
		}
		return false;
	}

	/**
     * 
     */
	distanceFrom(x, y) {
		var distance = Utils.distance(x, y, this.x, this.y);
		//console.log('x,y ' + x + ',' + y + ' to ' + this.getX() + ',' + this.getY() + ' is ' + distance);
		return distance;
	}

	/** Gets the distance from a wall.
     * @param wall A wall.
     * @returns The distance.
     */
	distanceFromWall(wall) {
		return wall.distanceFrom(this.x, this.y);
	}

	/** Gets the distance from a corner.
     * @param corner A corner.
     * @returns The distance.
     */
	distanceFromCorner(corner) {
		return this.distanceFrom(corner.x, corner.y);
	}

	/** Detaches a wall.
     * @param wall A wall.
     */
	detachWall(wall) {
		Utils.removeValue(this.wallStarts, wall);
		Utils.removeValue(this.wallEnds, wall);
		if (this.wallStarts.length == 0 && this.wallEnds.length == 0) {
			this.remove();
		}
	}

	/** Attaches a start wall.
     * @param wall A wall.
     */
	attachStart(wall) {
		this.wallStarts.push(wall);
	}

	/** Attaches an end wall.
     * @param wall A wall.
     */
	attachEnd(wall) {
		this.wallEnds.push(wall);
	}

	/** Get wall to corner.
     * @param corner A corner.
     * @return The associated wall or null.
     */
	wallTo(corner) {
		for (var i = 0; i < this.wallStarts.length; i++) {
			if (this.wallStarts[i].getEnd() === corner) {
				return this.wallStarts[i];
			}
		}
		return null;
	}

	/** Get wall from corner.
     * @param corner A corner.
     * @return The associated wall or null.
     */
	wallFrom(corner) {
		for (var i = 0; i < this.wallEnds.length; i++) {
			if (this.wallEnds[i].getStart() === corner) {
				return this.wallEnds[i];
			}
		}
		return null;
	}

	/** Get wall to or from corner.
     * @param corner A corner.
     * @return The associated wall or null.
     */
	wallToOrFrom(corner) {
		return this.wallTo(corner) || this.wallFrom(corner);
	}

	/**
     * 
     */
	combineWithCorner(corner) {
		// update position to other corner's
		this.x = corner.x;
		this.y = corner.y;
		// absorb the other corner's wallStarts and wallEnds
		let i;
		for (i = corner.wallStarts.length - 1; i >= 0; i--) {
			corner.wallStarts[i].setStart(this);
		}
		for (i = corner.wallEnds.length - 1; i >= 0; i--) {
			corner.wallEnds[i].setEnd(this);
		}
		// delete the other corner
		corner.removeAll();
		this.removeDuplicateWalls();
		this.floorplan.update();
	}

	mergeWithIntersected() {
		//console.log('mergeWithIntersected for object: ' + this.type);
		// check corners
		let i;
		for (i = 0; i < this.floorplan.getCorners().length; i++) {
			var corner = this.floorplan.getCorners()[i];
			if (
				this.distanceFromCorner(corner) < this.cornerTolerance &&
				corner != this
			) {
				this.combineWithCorner(corner);
				return true;
			}
		}
		// check walls
		for (i = 0; i < this.floorplan.getWalls().length; i++) {
			var wall = this.floorplan.getWalls()[i];
			if (
				this.distanceFromWall(wall) < this.cornerTolerance &&
				!this.isWallConnected(wall)
			) {
				// update position to be on wall
				var intersection = Utils.closestPointOnLine(
					this.x,
					this.y,
					wall.getStart().x,
					wall.getStart().y,
					wall.getEnd().x,
					wall.getEnd().y
				);
				this.x = intersection.x;
				this.y = intersection.y;
				// merge this corner into wall by breaking wall into two parts
				this.floorplan.newWall(this, wall.getEnd());
				wall.setEnd(this);
				this.floorplan.update();
				return true;
			}
		}
		return false;
	}

	/** Ensure we do not have duplicate walls (i.e. same start and end points) */
	removeDuplicateWalls() {
		// delete the wall between these corners, if it exists
		var wallEndpoints = {};
		var wallStartpoints = {};
		let i;
		for (i = this.wallStarts.length - 1; i >= 0; i--) {
			if (this.wallStarts[i].getEnd() === this) {
				// remove zero length wall
				this.wallStarts[i].remove();
			} else if (this.wallStarts[i].getEnd().id in wallEndpoints) {
				// remove duplicated wall
				this.wallStarts[i].remove();
			} else {
				wallEndpoints[this.wallStarts[i].getEnd().id] = true;
			}
		}
		for (i = this.wallEnds.length - 1; i >= 0; i--) {
			if (this.wallEnds[i].getStart() === this) {
				// removed zero length wall
				this.wallEnds[i].remove();
			} else if (this.wallEnds[i].getStart().id in wallStartpoints) {
				// removed duplicated wall
				this.wallEnds[i].remove();
			} else {
				wallStartpoints[this.wallEnds[i].getStart().id] = true;
			}
		}
	}
}
