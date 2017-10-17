import * as THREE from "three";
import Utils from "../core/utils";
import Wall from "./wall";
import FloorPlan from "./floorplan";
import Configuration from "../core/configuration";
import * as Core from "../core/configuration";
import Factory from "../items/factory";
import Item from "../items/item";
import callbacks from "../../utils/callbacks";

/**
   * The Scene is a manager of Items and also links to a ThreeJS scene.
   */
export default (model, textureDir) => {
	/** The associated ThreeJS scene. */
	let scene;
	let itemLoadingCallbacks = new callbacks();
	let itemLoadedCallbacks = new callbacks();
	/** */
	let items = [];

	/** */
	let needsUpdate = false;

	/**
     * Constructs a scene.
     * @param model The associated model.
     * @param textureDir The directory from which to load the textures.
     */

	scene = new THREE.Scene();

	// init item loader
	let loader = new THREE.JSONLoader();
	loader.crossOrigin = "";

	/** Adds a non-item, basically a mesh, to the scene.
     * @param mesh The mesh to be added.
     */
	function add(mesh) {
		scene.add(mesh);
	}

	/** Removes a non-item, basically a mesh, from the scene.
     * @param mesh The mesh to be removed.
     */
	function remove(mesh) {
		scene.remove(mesh);
		Utils.removeValue(this.items, mesh);
	}

	/** Gets the scene.
     * @returns The scene.
     */
	function getScene() {
		return scene;
	}

	/** Gets the items.
     * @returns The items.
     */
	function getItems() {
		return this.items;
	}

	/** Gets the count of items.
     * @returns The count.
     */
	function itemCount() {
		return this.items.length;
	}

	/** Removes all items. */
	function clearItems() {
		var items_copy = this.items;
		var scope = this;
		items.forEach(item => {
			scope.removeItem(item, true);
		});
		this.items = [];
	}

	/**
     * Removes an item.
     * @param item The item to be removed.
     * @param dontRemove If not set, also remove the item from the items list.
     */
	function removeItem(item, dontRemove) {
		dontRemove = dontRemove || false;
		// use this for item meshes
		this.itemRemovedCallbacks.fire(item);
		item.removed();
		scene.remove(item);
		if (!dontRemove) {
			Utils.removeValue(this.items, item);
		}
	}

	/**
     * Creates an item and adds it to the scene.
     * @param itemType The type of the item given by an enumerator.
     * @param fileName The name of the file to load.
     * @param metadata TODO
     * @param position The initial position.
     * @param rotation The initial rotation around the y axis.
     * @param scale The initial scaling.
     * @param fixed True if fixed.
     */
	function addItem(
		itemType,
		fileName,
		metadata,
		position,
		rotation,
		scale,
		fixed
	) {
		itemType = itemType || 1;
		var scope = this;
		var loaderCallback = function(geometry, materials) {
			var item = new (Factory.getClass(itemType))(
				scope.model,
				metadata,
				geometry,
				new THREE.MeshFaceMaterial(materials),
				position,
				rotation,
				scale
			);
			item.fixed = fixed || false;
			scope.items.push(item);
			scope.add(item);
			item.initObject();
			scope.itemLoadedCallbacks.fire(item);
		};

		this.itemLoadingCallbacks.fire();
		loader.load(
			fileName,
			loaderCallback,
			undefined // TODO_Ekki
		);
	}

	let service = {
		clearItems,
		itemLoadingCallbacks,
		itemLoadedCallbacks,
		addItem
	};

	return Object.assign(scene, service);
};
