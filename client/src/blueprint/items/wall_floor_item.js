import WallItem from "./wall_item";

export default class WallFloorItem extends WallItem {
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
		this.boundToFloor = true;
	}
}
