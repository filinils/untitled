import FloorItem from "./floor_item";

export default class OnFloorItem extends FloorItem {
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
		this.obstructFloorMoves = false;
		this.receiveShadow = true;
	}
}
