import Utils from "../core/utils";
import * as THREE from "three";

/**
   * Drawings on "top" of the scene. e.g. rotate arrows
   */
export default function(three) {
    let scope = this;

    let hudScene = new THREE.Scene();

    let selectedItem = null;

    let rotating = false;
    let mouseover = false;

    let tolerance = 10;
    let height = 5;
    let distance = 20;
    let color = "#ffffff";
    let hoverColor = "#f1c40f";

    let activeObject = null;

    this.getScene = function() {
        return hudScene;
    };

    this.getObject = function() {
        return activeObject;
    };

    function init() {
        three.itemSelectedCallbacks.add(itemSelected);
        three.itemUnselectedCallbacks.add(itemUnselected);
    }

    this.resetSelectedItem = () => {
        selectedItem = null;
        if (activeObject) {
            hudScene.remove(hudScene.children[0]);
            activeObject = null;
        }
    };

    function itemSelected(item) {
        if (selectedItem != item) {
            scope.resetSelectedItem();
            if (item.allowRotate && !item.fixed) {
                selectedItem = item;
                activeObject = makeObject(selectedItem);
                hudScene.add(activeObject);
            }
        }
    }

    function itemUnselected() {
        scope.resetSelectedItem();
    }

    this.setRotating = function(isRotating) {
        rotating = isRotating;
        setColor();
    };

    this.setMouseover = function(isMousedOver) {
        mouseover = isMousedOver;
        setColor();
    };

    function setColor() {
        if (activeObject) {
            activeObject.children.forEach(obj => {
                obj.material.color.set(getColor());
            });
        }
        three.needsUpdate();
    }

    function getColor() {
        return mouseover || rotating ? hoverColor : color;
    }

    this.update = function() {
        if (activeObject) {
            activeObject.rotation.y = selectedItem.rotation.y;
            activeObject.position.x = selectedItem.position.x;
            activeObject.position.z = selectedItem.position.z;
        }
    };

    function makeLineGeometry(item) {
        let geometry = new THREE.Geometry();

        geometry.vertices.push(new THREE.Vector3(0, 0, 0), rotateVector(item));

        return geometry;
    }

    function rotateVector(item) {
        let vec = new THREE.Vector3(
            0,
            0,
            Math.max(item.halfSize.x, item.halfSize.z) + 1.4 + distance
        );
        return vec;
    }

    function makeLineMaterial(rotating) {
        let mat = new THREE.LineBasicMaterial({
            color: getColor(),
            linewidth: 3
        });
        return mat;
    }

    function makeCone(item) {
        let coneGeo = new THREE.CylinderGeometry(5, 0, 10);
        let coneMat = new THREE.MeshBasicMaterial({
            color: getColor()
        });
        let cone = new THREE.Mesh(coneGeo, coneMat);
        cone.position.copy(rotateVector(item));

        cone.rotation.x = -Math.PI / 2.0;

        return cone;
    }

    function makeSphere(item) {
        let geometry = new THREE.SphereGeometry(4, 16, 16);
        let material = new THREE.MeshBasicMaterial({
            color: getColor()
        });
        let sphere = new THREE.Mesh(geometry, material);
        return sphere;
    }

    function makeObject(item) {
        let object = new THREE.Object3D();
        let line = new THREE.Line(
            makeLineGeometry(item),
            makeLineMaterial(scope.rotating),
            THREE.LinePieces
        );

        let cone = makeCone(item);
        let sphere = makeSphere(item);

        object.add(line);
        object.add(cone);
        object.add(sphere);

        object.name = "Arrow";
        object.rotation.y = item.rotation.y;
        object.position.x = item.position.x;
        object.position.z = item.position.z;
        object.position.y = height;

        return object;
    }

    init();
}
