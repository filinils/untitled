import * as THREE from "three";
import Utils from "../core/utils";
import Item from "./item";

export default class WallItem extends Item {
  /** The currently applied wall edge. */

  constructor(model, metadata, geometry, material, position, rotation, scale) {
    super(model, metadata, geometry, material, position, rotation, scale);
    this.currentWallEdge = null;
    /* TODO:
       This caused a huge headache.
       HalfEdges get destroyed/created every time floorplan is edited.
       This item should store a reference to a wall and front/back,
       and grab its edge reference dynamically whenever it needs it.
     */

    /** used for finding rotations */
    this.refVec = new THREE.Vector2(0, 1.0);

    /** */
    this.wallOffsetScalar = 0;

    /** */
    this.sizeX = 0;

    /** */
    this.sizeY = 0;

    /** */
    this.addToWall = false;

    /** */
    this.boundToFloor = false;

    /** */
    this.frontVisible = false;

    /** */
    this.backVisible = false;

    this.allowRotate = false;
  }

  /** Get the closet wall edge.
   * @returns The wall edge.
   */
  closestWallEdge() {
    var wallEdges = this.model.floorplan.wallEdges();

    var wallEdge = null;
    var minDistance = null;

    var itemX = this.position.x;
    var itemZ = this.position.z;

    wallEdges.forEach(edge => {
      var distance = edge.distanceTo(itemX, itemZ);
      if (minDistance === null || distance < minDistance) {
        minDistance = distance;
        wallEdge = edge;
      }
    });

    return wallEdge;
  }

  /** */
  removed() {
    if (this.currentWallEdge != null && this.addToWall) {
      Utils.removeValue(this.currentWallEdge.wall.items, this);
      this.redrawWall();
    }
  }

  /** */
  redrawWall() {
    if (this.addToWall) {
      this.currentWallEdge.wall.fireRedraw();
    }
  }

  /** */
  updateEdgeVisibility(visible, front) {
    if (front) {
      this.frontVisible = visible;
    } else {
      this.backVisible = visible;
    }
    this.visible = this.frontVisible || this.backVisible;
  }

  /** */
  updateSize() {
    this.wallOffsetScalar =
      (this.geometry.boundingBox.max.z - this.geometry.boundingBox.min.z) *
      this.scale.z /
      2.0;
    this.sizeX =
      (this.geometry.boundingBox.max.x - this.geometry.boundingBox.min.x) *
      this.scale.x;
    this.sizeY =
      (this.geometry.boundingBox.max.y - this.geometry.boundingBox.min.y) *
      this.scale.y;
  }

  /** */
  resized() {
    if (this.boundToFloor) {
      this.position.y =
        0.5 *
          (this.geometry.boundingBox.max.y - this.geometry.boundingBox.min.y) *
          this.scale.y +
        0.01;
    }

    this.updateSize();
    this.redrawWall();
  }

  /** */
  placeInRoom() {
    var closestWallEdge = this.closestWallEdge();
    this.changeWallEdge(closestWallEdge);
    this.updateSize();

    if (!this.position_set) {
      // position not set
      var center = closestWallEdge.interiorCenter();
      var newPos = new THREE.Vector3(
        center.x,
        closestWallEdge.wall.height / 2.0,
        center.y
      );
      this.boundMove(newPos);
      this.position.copy(newPos);
      this.redrawWall();
    }
  }

  /** */
  moveToPosition(vec3, intersection) {
    this.changeWallEdge(intersection.object.edge);
    this.boundMove(vec3);
    this.position.copy(vec3);
    this.redrawWall();
  }

  /** */
  getWallOffset() {
    return this.wallOffsetScalar;
  }

  /** */
  changeWallEdge(wallEdge) {
    if (this.currentWallEdge != null) {
      if (this.addToWall) {
        Utils.removeValue(this.currentWallEdge.wall.items, this);
        this.redrawWall();
      } else {
        Utils.removeValue(this.currentWallEdge.wall.onItems, this);
      }
    }

    // handle subscription to wall being removed
    if (this.currentWallEdge != null) {
      this.currentWallEdge.wall.dontFireOnDelete(this.remove.bind(this));
    }
    wallEdge.wall.fireOnDelete(this.remove.bind(this));

    // find angle between wall normals
    var normal2 = new THREE.Vector2();
    var normal3 = wallEdge.plane.geometry.faces[0].normal;
    normal2.x = normal3.x;
    normal2.y = normal3.z;

    var angle = Utils.angle(this.refVec.x, this.refVec.y, normal2.x, normal2.y);
    this.rotation.y = angle;

    // update currentWall
    this.currentWallEdge = wallEdge;
    if (this.addToWall) {
      wallEdge.wall.items.push(this);
      this.redrawWall();
    } else {
      wallEdge.wall.onItems.push(this);
    }
  }

  /** Returns an array of planes to use other than the ground plane
   * for passing intersection to clickPressed and clickDragged */
  customIntersectionPlanes() {
    return this.model.floorplan.wallEdgePlanes();
  }

  /** takes the move vec3, and makes sure object stays bounded on plane */
  boundMove(vec3) {
    var tolerance = 1;
    var edge = this.currentWallEdge;
    vec3.applyMatrix4(edge.interiorTransform);

    if (vec3.x < this.sizeX / 2.0 + tolerance) {
      vec3.x = this.sizeX / 2.0 + tolerance;
    } else if (
      vec3.x >
      edge.interiorDistance() - this.sizeX / 2.0 - tolerance
    ) {
      vec3.x = edge.interiorDistance() - this.sizeX / 2.0 - tolerance;
    }

    if (this.boundToFloor) {
      vec3.y =
        0.5 *
          (this.geometry.boundingBox.max.y - this.geometry.boundingBox.min.y) *
          this.scale.y +
        0.01;
    } else {
      if (vec3.y < this.sizeY / 2.0 + tolerance) {
        vec3.y = this.sizeY / 2.0 + tolerance;
      } else if (vec3.y > edge.height - this.sizeY / 2.0 - tolerance) {
        vec3.y = edge.height - this.sizeY / 2.0 - tolerance;
      }
    }

    vec3.z = this.getWallOffset();

    vec3.applyMatrix4(edge.invInteriorTransform);
  }
}
