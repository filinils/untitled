import * as THREE from "three";
import Utils from "../core/utils";
import Wall from "./wall";
import FloorPlan from "./floorplan";
import Scene from "./scene";
import Configuration from "../core/configuration";
import * as Core from "../core/configuration";
/** 
   * A Model connects a Floorplan and a Scene. 
   */
export default textureDir => {
  /** */

  /** Constructs a new model.
     * @param textureDir The directory containing the textures.
     */

  let _floorplan = new FloorPlan();
  let scene = new Scene(this, textureDir);

  function loadSerialized(json) {
    // TODO: better documentation on serialization format.
    // TODO: a much better serialization format.
   // this.roomLoadingCallbacks.fire();

    var data = JSON.parse(json);
    newRoom(data.floorplan, data.items);

    //this.roomLoadedCallbacks.fire();
  }

  function exportSerialized() {
    var items_arr = [];
    var objects = scene.getItems();
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
      _floorplan: _floorplan.saveFloorplan(),
      items: items_arr
    };

    return JSON.stringify(room);
  }

  function newRoom(floorplan, items) {
    scene.clearItems();
    _floorplan.loadFloorplan(floorplan);
    items.forEach(item => {
      var position = new THREE.Vector3(item.xpos, item.ypos, item.zpos);
      var metadata = {
        itemName: item.item_name,
        resizable: item.resizable,
        itemType: item.item_type,
        modelUrl: item.model_url
      };
      var scale = new THREE.Vector3(item.scale_x, item.scale_y, item.scale_z);
      scene.addItem(
        item.item_type,
        item.model_url,
        metadata,
        position,
        item.rotation,
        scale,
        item.fixed
      );
    });
  }
  return {
    scene,
    floorplan:_floorplan,
    loadSerialized
  };
};
