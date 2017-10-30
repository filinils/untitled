import * as THREE from "three";
import Floorplanner from "./floorplanner/floorplanner";
import Model from "./model/model";
import Main from "./three/main";

/** Blueprint3D core application. */
export default options => {
	let model;
	let three;
	let floorplanner;

	model = new Model(options.textureDir);
	this.three = new Main(
		model,
		options.threeElement,
		options.threeCanvasElement,
		{}
	);

	if (!options.widget) {
		floorplanner = new Floorplanner(
			options.floorplannerElement,
			model.floorplan
		);
	} else {
		this.three.getController().enabled = false;
	}

	return {
		model,
		three: this.three,
		floorplanner
	};
};
