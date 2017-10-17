import * as THREE from "three";
import Utils from "../core/utils";

export default (
  model,
  metadata,
  geometry,
  material,
  position,
  rotation,
  scale
) => {
  /** The currently applied wall edge. */
  let currentWallEdge = null;
  /* TODO:
       This caused a huge headache.
       HalfEdges get destroyed/created every time floorplan is edited.
       This item should store a reference to a wall and front/back,
       and grab its edge reference dynamically whenever it needs it.
     */

  /** used for finding rotations */
  let refVec = new THREE.Vector2(0, 1.0);

  /** */
  let wallOffsetScalar = 0;

  /** */
  let sizeX = 0;

  /** */
  let sizeY = 0;

  /** */
  let addToWall = false;

  /** */
  let boundToFloor = false;

  /** */
  let frontVisible = false;

  /** */
  let backVisible = false;

  let allowRotate = false;

  /** Get the closet wall edge.
     * @returns The wall edge.
     */
  function closestWallEdge() {
    var wallEdges = model.floorplan.wallEdges();

    var wallEdge = null;
    var minDistance = null;

    var itemX = position.x;
    var itemZ = position.z;

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
  function removed() {
    if (currentWallEdge != null && addToWall) {
      Utils.removeValue(currentWallEdge.wall.items, this);
      redrawWall();
    }
  }

  /** */
  function redrawWall() {
    if (addToWall) {
      currentWallEdge.wall.fireRedraw();
    }
  }

  /** */
  function updateEdgeVisibility(visible, front) {
    if (front) {
      frontVisible = visible;
    } else {
      backVisible = visible;
    }
    visible = frontVisible || backVisible;
  }

  /** */
  function updateSize() {
    wallOffsetScalar =
      (geometry.boundingBox.max.z - geometry.boundingBox.min.z) * scale.z / 2.0;
    sizeX = (geometry.boundingBox.max.x - geometry.boundingBox.min.x) * scale.x;
    sizeY = (geometry.boundingBox.max.y - geometry.boundingBox.min.y) * scale.y;
  }

  /** */
  function resized() {
    if (boundToFloor) {
      position.y =
        0.5 *
          (geometry.boundingBox.max.y - geometry.boundingBox.min.y) *
          scale.y +
        0.01;
    }

    updateSize();
    redrawWall();
  }

  /** */
  function placeInRoom() {
    var closestWallEdge = closestWallEdge();
    changeWallEdge(closestWallEdge);
    updateSize();

    if (!position_set) {
      // position not set
      var center = closestWallEdge.interiorCenter();
      var newPos = new THREE.Vector3(
        center.x,
        closestWallEdge.wall.height / 2.0,
        center.y
      );
      boundMove(newPos);
      position.copy(newPos);
      redrawWall();
    }
  }

  /** */
  function moveToPosition(vec3, intersection) {
    changeWallEdge(intersection.object.edge);
    boundMove(vec3);
    position.copy(vec3);
    redrawWall();
  }

  /** */
  function getWallOffset() {
    return wallOffsetScalar;
  }

  /** */
  function changeWallEdge(wallEdge) {
    if (currentWallEdge != null) {
      if (addToWall) {
        Utils.removeValue(currentWallEdge.wall.items, this);
        redrawWall();
      } else {
        Utils.removeValue(currentWallEdge.wall.onItems, this);
      }
    }

    // handle subscription to wall being removed
    if (currentWallEdge != null) {
      currentWallEdge.wall.dontFireOnDelete(remove.bind(this));
    }
    wallEdge.wall.fireOnDelete(remove.bind(this));

    // find angle between wall normals
    var normal2 = new THREE.Vector2();
    var normal3 = wallEdge.plane.geometry.faces[0].normal;
    normal2.x = normal3.x;
    normal2.y = normal3.z;

    var angle = Utils.angle(refVec.x, refVec.y, normal2.x, normal2.y);
    rotation.y = angle;

    // update currentWall
    currentWallEdge = wallEdge;
    if (addToWall) {
      wallEdge.wall.items.push(this);
      redrawWall();
    } else {
      wallEdge.wall.onItems.push(this);
    }
  }

  /** Returns an array of planes to use other than the ground plane
     * for passing intersection to clickPressed and clickDragged */
  function customIntersectionPlanes() {
    return model.floorplan.wallEdgePlanes();
  }

  /** takes the move vec3, and makes sure object stays bounded on plane */
  function boundMove(vec3) {
    var tolerance = 1;
    var edge = currentWallEdge;
    vec3.applyMatrix4(edge.interiorTransform);

    if (vec3.x < sizeX / 2.0 + tolerance) {
      vec3.x = sizeX / 2.0 + tolerance;
    } else if (vec3.x > edge.interiorDistance() - sizeX / 2.0 - tolerance) {
      vec3.x = edge.interiorDistance() - sizeX / 2.0 - tolerance;
    }

    if (boundToFloor) {
      vec3.y =
        0.5 *
          (geometry.boundingBox.max.y - geometry.boundingBox.min.y) *
          scale.y +
        0.01;
    } else {
      if (vec3.y < sizeY / 2.0 + tolerance) {
        vec3.y = sizeY / 2.0 + tolerance;
      } else if (vec3.y > edge.height - sizeY / 2.0 - tolerance) {
        vec3.y = edge.height - sizeY / 2.0 - tolerance;
      }
    }

    vec3.z = getWallOffset();

    vec3.applyMatrix4(edge.invInteriorTransform);
  }
};
