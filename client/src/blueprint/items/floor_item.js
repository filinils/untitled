import * as THREE from "three";
import Utils from "../core/utils";
import Configuration from "../core/configuration";
import * as Core from "../core/configuration";
import Item from "./item";

export default class FloorItem extends Item {
	constructor(
		model,
		metadata,
		geometry,
		material,
		position,
		rotation,
		scale,
		options
	) {
		super(
			model,
			metadata,
			geometry,
			material,
			position,
			rotation,
			scale,
			options
		);
	}

	/** */
	placeInRoom() {
		if (!this.position_set) {
			const center = this.model.floorplan.getCenter();
			this.position.x = center.x;
			this.position.z = center.z;
			this.position.y =
				0.5 *
				(this.geometry.boundingBox.max.y -
					this.geometry.boundingBox.min.y);
		}
	}

	/** Take action after a resize */
	resized() {
		this.position.y = this.halfSize.y;
	}

	/** */
	moveToPosition(vec3, intersection) {
		// keeps the position in the room and on the floor
		if (!this.isValidPosition(vec3)) {
			this.showError(vec3);
			return;
		} else {
			this.hideError();
			vec3.y = this.position.y; // keep it on the floor!
			this.position.copy(vec3);
		}
	}

	/** */
	isValidPosition(vec3) {
		var corners = this.getCorners("x", "z", vec3);

		// check if we are in a room
		var rooms = this.model.floorplan.getRooms();
		var isInARoom = false;
		for (var i = 0; i < rooms.length; i++) {
			if (
				Utils.pointInPolygon(
					vec3.x,
					vec3.z,
					rooms[i].interiorCorners
				) &&
				!Utils.polygonPolygonIntersect(
					corners,
					rooms[i].interiorCorners
				)
			) {
				isInARoom = true;
			}
		}
		if (!isInARoom) {
			//console.log('object not in a room');
			return false;
		}

		return true;
	}
}
