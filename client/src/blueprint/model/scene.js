import * as THREE from "three";

import FBXLoader from "three-fbx-loader";
import Utils from "../core/utils";
import Wall from "./wall";
import FloorPlan from "./floorplan";
import Configuration from "../core/configuration";
import * as Core from "../core/configuration";
import Factory from "../items/factory";
import Item from "../items/item";
import Callbacks from "../../utils/callbacks";

FBXLoader(THREE);

/**
   * The Scene is a manager of Items and also links to a ThreeJS scene.
   */
export default (model, textureDir) => {
	/** The associated ThreeJS scene. */
	let scene;
	let itemLoadingCallbacks = new Callbacks();
	let itemLoadedCallbacks = new Callbacks();
	let itemRemovedCallbacks = new Callbacks();

	let items = [];

	let needsUpdate = false;

	/**
     * Constructs a scene.
     * @param model The associated model.
     * @param textureDir The directory from which to load the textures.
     */

	scene = new THREE.Scene();
	window.scene = scene;

	// init item loader
	let loader = new THREE.JSONLoader();

	let fbxLoader = new THREE.FBXLoader();

	loader.crossOrigin = "";
	fbxLoader.crossOrigin = "";

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
		path,
		metadata,
		position,
		rotation,
		scale,
		fixed,
		options
	) {
		itemType = itemType || 1;
		var scope = this;
		let fileName = path + "/" + metadata.itemName + ".fbx";
		var loaderCallback = function(geometry, materials) {
			var item = new (Factory.getClass(itemType))(
				model,
				metadata,
				geometry,
				materials[0],
				position,
				rotation,
				scale,
				options | null
			);
			item.fixed = fixed || false;
			scope.items.push(item);
			scope.add(item);
			item.initObject();
			scope.itemLoadedCallbacks.fire(item);
		};

		this.itemLoadingCallbacks.fire();

		fbxLoader.load(
			fileName,
			group => {
				let geometries =
					!options.isOneGeometry &&
					group.children[0] &&
					group.children[0].children.length > 0
						? group.children[0].children
						: group.children;

				geometries.forEach(mesh => {
					let texturePromises = [];
					let material = null;

					metadata.textureMaps.forEach(map => {
						texturePromises.push(
							loadTexture(map.type, path, mesh.name)
						);
					});

					Promise.all(texturePromises).then(data => {
						let materialMap = [];

						data.forEach(texture => {
							if (texture[mesh.name].BaseColor)
								materialMap["map"] =
									texture[mesh.name].BaseColor;
							if (texture[mesh.name].Normal)
								materialMap["normal"] =
									texture[mesh.name].Normal;
							if (texture[mesh.name].Metallic)
								materialMap["metallic"] =
									texture[mesh.name].Metallic;
							if (texture[mesh.name].Roughness)
								materialMap["roughness"] =
									texture[mesh.name].Roughness;
						});

						var material = new THREE.MeshStandardMaterial({
							map: materialMap["map"],
							normalMap: materialMap["normal"],
							metalnessMap: materialMap["metallic"],
							roughnessMap: materialMap["roughness"],
							metalness: 1,
							roughness: 1
						});

						if (options.transparent) {
							material.opacity = options.opacity;
							material.transparent = true;
						}

						createItem(mesh.geometry, material);
					});

					function createItem(geometry, material) {
						var item = new (Factory.getClass(itemType))(
							model,
							metadata,
							geometry,
							material,
							position,
							rotation,
							scale,
							options
						);
						item.fixed = fixed || false;
						scope.items.push(item);

						scope.add(item);
						item.initObject();
						scope.itemLoadedCallbacks.fire(item);
					}
				});
			},
			prog => {},
			e => {
				console.error(e);
			}
		);
	}

	function loadTexture(type, path, name) {
		return new Promise((resovle, reject) => {
			let _resolve = resovle;
			let _reject = reject;
			let texturePath = path + "/" + name + "_" + type + "_1024.jpg";

			let textureLoader = new THREE.TextureLoader();

			textureLoader.load(
				texturePath,
				texture => {
					let obj = [];
					obj[name] = [];

					obj[name][type] = texture;
					_resolve(obj);
				},
				_reject
			);
		});
	}

	let service = {
		clearItems,
		itemLoadingCallbacks,
		itemLoadedCallbacks,
		addItem,
		getItems,
		itemRemovedCallbacks
	};

	return Object.assign(scene, service);
};
