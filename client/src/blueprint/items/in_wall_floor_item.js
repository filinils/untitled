import InWallItem from "./in_wall_item";

export default class InWallFloorItem extends InWallItem {
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
