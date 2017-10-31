import * as THREE from "three";
import Utils from "../core/utils";
import Wall from "./wall";
import FloorPlan from "./floorplan";
import Scene from "./scene";
import Configuration from "../core/configuration";
import * as Core from "../core/configuration";
import Callbacks from "../../utils/callbacks";
/**
   * A Model connects a Floorplan and a Scene.
   */
export default textureDir => {
	/** Constructs a new model.
     * @param textureDir The directory containing the textures.
     */
	let scope = this;

	let roomLoadingCallbacks = new Callbacks();
	let roomLoadedCallbacks = new Callbacks();
	let roomSavedCallbacks = new Callbacks();
	let roomDeletedCallbacks = new Callbacks();

	this.floorplan = new FloorPlan();
	this.scene = new Scene(this, textureDir);

	function loadSerialized(json) {
		// TODO: better documentation on serialization format.
		// TODO: a much better serialization format.
		roomLoadingCallbacks.fire();

		//var data = JSON.parse(json);
    var data = json;
    if(!data)return null;

    newRoom(data.floorplan, data.items);
		roomLoadedCallbacks.fire();
	}

	function exportSerialized() {
		var items_arr = [];
		var objects = scope.scene.getItems();
		for (var i = 0; i < objects.length; i++) {
			var object = objects[i];
			items_arr[i] = {
				item_name: object.metadata.itemName,
				item_type: object.metadata.itemType,
				model_url: object.metadata.modelUrl,
				xpos: object.position.x,
				ypos: object.position.y,
				zpos: object.position.z,
				rotation: object.rotation.y,
				scale_x: object.scale.x,
				scale_y: object.scale.y,
				scale_z: object.scale.z,
				fixed: object.fixed
			};
		}

		var room = {
			floorplan: this.floorplan.saveFloorplan(),
			items: items_arr
		};

		return JSON.stringify(room);
	}

	function newRoom(floorplan, items) {
		scope.scene.clearItems();
		scope.floorplan.loadFloorplan(floorplan);
		items.forEach(item => {
			var position = new THREE.Vector3(item.xpos, item.ypos, item.zpos);
			var metadata = {
				itemName: item.item_name,
				resizable: item.resizable,
				itemType: item.item_type,
				modelUrl: item.model_url,
				textureMaps: item.texture_maps ? item.texture_maps : null
			};
			var scale = new THREE.Vector3(
				item.scale_x,
				item.scale_y,
				item.scale_z
			);
			scope.scene.addItem(
				item.item_type,
				item.model_url,
				metadata,
				position,
				item.rotation,
				scale,
				item.fixed,
				item.options
			);
		});
	}

	return {
		scene: this.scene,
		floorplan: this.floorplan,
		loadSerialized
	};
};
