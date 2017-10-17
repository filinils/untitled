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

  let self = this;
  let base = new THREE.Mesh();
  let scene = model.scene;
  let errorColor = 0xff0000;
  let resizable = metadata.resizable;
  let castShadow = true;
  let receiveShadow = false;

  if (position) {
    position.copy(position);
    position_set = true;
  } else {
    position_set = false;
  }

  // center in its boundingbox
  geometry.computeBoundingBox();
  geometry.applyMatrix(
    new THREE.Matrix4().makeTranslation(
      -0.5 * (geometry.boundingBox.max.x + geometry.boundingBox.min.x),
      -0.5 * (geometry.boundingBox.max.y + geometry.boundingBox.min.y),
      -0.5 * (geometry.boundingBox.max.z + geometry.boundingBox.min.z)
    )
  );
  geometry.computeBoundingBox();
  halfSize = objectHalfSize();

  if (rotation) {
    rotation.y = rotation;
  }

  if (scale != null) {
    setScale(scale.x, scale.y, scale.z);
  }

  /** */
  let errorGlow = new THREE.Mesh();

  /** */
  let hover = false;

  /** */
  let selected = false;

  /** */
  let highlighted = false;

  /** */
  let error = false;

  /** */
  let emissiveColor = 0x444444;

  /** Does this object affect other floor items */
  let obstructFloorMoves = true;

  /** */
  let position_set;

  /** Show rotate option in context menu */
  let allowRotate = true;

  /** */
  let fixed = false;

  /** dragging */
  let dragOffset = new THREE.Vector3();

  /** */
  let halfSize;

  /** Constructs an item. 
        * @param model TODO
        * @param metadata TODO
        * @param geometry TODO
        * @param material TODO
        * @param position TODO
        * @param rotation TODO
        * @param scale TODO 
        */

  /** */
  function remove() {
    scene.removeItem(this);
  }

  /** */
  function resize(height, width, depth) {
    var x = width / getWidth();
    var y = height / getHeight();
    var z = depth / getDepth();
    setScale(x, y, z);
  }

  /** */
  function setScale(x, y, z) {
    var scaleVec = new THREE.Vector3(x, y, z);
    halfSize.multiply(scaleVec);
    scaleVec.multiply(scale);
    scale.set(scaleVec.x, scaleVec.y, scaleVec.z);
    resized();
    scene.needsUpdate = true;
  }

  /** */
  function setFixed(fixed) {}

  /** Subclass can define to take action after a resize. */

  /** */
  function getHeight() {
    return halfSize.y * 2.0;
  }

  /** */
  function getWidth() {
    return halfSize.x * 2.0;
  }

  /** */
  function getDepth() {
    return halfSize.z * 2.0;
  }

  /** */

  /** */
  function initObject() {
    placeInRoom();
    // select and stuff
    scene.needsUpdate = true;
  }

  /** */
  function removed() {}

  /** on is a bool */
  function updateHighlight() {
    var on = hover || selected;
    highlighted = on;
    var hex = on ? emissiveColor : 0x000000;
    material.materials.forEach(material => {
      // TODO_Ekki emissive doesn't exist anymore?
      material.emissive.setHex(hex);
    });
  }

  /** */
  function mouseOver() {
    hover = true;
    updateHighlight();
  }

  /** */
  function mouseOff() {
    hover = false;
    updateHighlight();
  }

  /** */
  function setSelected() {
    selected = true;
    updateHighlight();
  }

  /** */
  function setUnselected() {
    selected = false;
    updateHighlight();
  }

  /** intersection has attributes point (vec3) and object (THREE.Mesh) */
  function clickPressed(intersection) {
    dragOffset.copy(intersection.point).sub(position);
  }

  /** */
  function clickDragged(intersection) {
    if (intersection) {
      moveToPosition(intersection.point.sub(dragOffset), intersection);
    }
  }

  /** */
  function rotate(intersection) {
    if (intersection) {
      let angle = Utils.angle(
        0,
        1,
        intersection.point.x - position.x,
        intersection.point.z - position.z
      );

      var snapTolerance = Math.PI / 16.0;

      // snap to intervals near Math.PI/2
      for (var i = -4; i <= 4; i++) {
        if (Math.abs(angle - i * (Math.PI / 2)) < snapTolerance) {
          angle = i * (Math.PI / 2);
          break;
        }
      }

      rotation.y = angle;
    }
  }

  /** */
  function moveToPosition(vec3, intersection) {
    position.copy(vec3);
  }

  /** */
  function clickReleased() {
    if (error) {
      hideError();
    }
  }

  /**
        * Returns an array of planes to use other than the ground plane
        * for passing intersection to clickPressed and clickDragged
        */
  function customIntersectionPlanes() {
    return [];
  }

  /** 
        * returns the 2d corners of the bounding polygon
        * 
        * offset is Vector3 (used for getting corners of object at a new position)
        * 
        * TODO: handle rotated objects better!
        */
  function getCorners(xDim, yDim, position) {
    position = position || position;

    var halfSize = halfSize.clone();

    var c1 = new THREE.Vector3(-halfSize.x, 0, -halfSize.z);
    var c2 = new THREE.Vector3(halfSize.x, 0, -halfSize.z);
    var c3 = new THREE.Vector3(halfSize.x, 0, halfSize.z);
    var c4 = new THREE.Vector3(-halfSize.x, 0, halfSize.z);

    var transform = new THREE.Matrix4();
    //console.log(rotation.y);
    transform.makeRotationY(rotation.y); //  + Math.PI/2)

    c1.applyMatrix4(transform);
    c2.applyMatrix4(transform);
    c3.applyMatrix4(transform);
    c4.applyMatrix4(transform);

    c1.add(position);
    c2.add(position);
    c3.add(position);
    c4.add(position);

    //halfSize.applyMatrix4(transform);

    //var min = position.clone().sub(halfSize);
    //var max = position.clone().add(halfSize);

    var corners = [
      { x: c1.x, y: c1.z },
      { x: c2.x, y: c2.z },
      { x: c3.x, y: c3.z },
      { x: c4.x, y: c4.z }
    ];

    return corners;
  }

  /** */

  /** */
  function showError(vec3) {
    vec3 = vec3 || position;
    if (!error) {
      error = true;
      errorGlow = createGlow(errorColor, 0.8, true);
      scene.add(errorGlow);
    }
    errorGlow.position.copy(vec3);
  }

  /** */
  function hideError() {
    if (error) {
      error = false;
      scene.remove(errorGlow);
    }
  }

  /** */
  function objectHalfSize() {
    var objectBox = new THREE.Box3();
    objectBox.setFromObject(this);
    return objectBox.max
      .clone()
      .sub(objectBox.min)
      .divideScalar(2);
  }

  /** */
  function createGlow(color, opacity, ignoreDepth) {
    ignoreDepth = ignoreDepth || false;
    opacity = opacity || 0.2;
    var glowMaterial = new THREE.MeshBasicMaterial({
      color: color,
      blending: THREE.AdditiveBlending,
      opacity: 0.2,
      transparent: true,
      depthTest: !ignoreDepth
    });

    var glow = new THREE.Mesh(geometry.clone(), glowMaterial);
    glow.position.copy(position);
    glow.rotation.copy(rotation);
    glow.scale.copy(scale);
    return glow;
  }

  return {
    self
  };
};
