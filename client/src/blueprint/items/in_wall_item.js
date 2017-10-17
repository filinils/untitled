import WallItem from "./wall_item";

export default class InWallItem extends WallItem {
	constructor(
		model,
		metadata,
		geometry,
		material,
		position,
		rotation,
		scale
	) {
		super(model, metadata, geometry, material, position, rotation, scale);
		this.addToWall = true;
	}

	getWallOffset() {
		// fudge factor so it saves to the right wall
		return -this.currentWallEdge.offset + 0.5;
	}
}
