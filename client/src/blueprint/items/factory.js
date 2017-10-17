import * as THREE from "three";
import Utils from "../core/utils";
import Configuration from "../core/configuration";
import FloorItem from "./floor_item";
import WallItem from "./wall_item";
import InWallItem from "./in_wall_item";
import InWallFloorItem from "./in_wall_floor_item";
import OnFloorItem from "./on_floor_item";
import WallFloorItem from "./wall_floor_item";

import * as Core from "../core/configuration";

/** Enumeration of item types. */
const item_types = {
	1: FloorItem,
	2: WallItem,
	3: InWallItem,
	7: InWallFloorItem,
	8: OnFloorItem,
	9: WallFloorItem
};

/** Factory class to create items. */
export default (() => {
	/** Gets the class for the specified item. */
	function getClass(itemType) {
		return item_types[itemType];
	}

	return {
		getClass
	};
})();
