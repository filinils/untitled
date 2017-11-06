import FloorItem from "./floor_item";

export default class OnFloorLamp extends FloorItem {
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
}
