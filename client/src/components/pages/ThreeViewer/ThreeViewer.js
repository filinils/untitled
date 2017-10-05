import * as THREE from "three";
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class ThreeViewer extends React.Component {
  constructor(props) {
    super(props);

    this.camera, this.scene, this.renderer, this.helper;
    this.plane, this.cube;
    this.mouse, this.raycaster, (this.isShiftDown = false);
    this.rollOverMesh, this.rollOverMaterial;
    this.cubeGeo, this.cubeMaterial;
    this.objects = [];

    this.info = {};

    this.init = this.init.bind(this);

    this.onDocumentMouseMove = this.onDocumentMouseMove.bind(this);
    this.onDocumentMouseDown = this.onDocumentMouseDown.bind(this);
    this.onDocumentKeyDown = this.onDocumentKeyDown.bind(this);
    this.onDocumentKeyUp = this.onDocumentKeyUp.bind(this);

    this.onWindowResize = this.onWindowResize.bind(this);
  }

  componentDidMount() {
    this.init();
    this.render3D();
  }

  render3D() {
    if (this.renderer) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  infoElement(style, innerHtml) {
    return <div style={style} dangerouslySetInnerHTML={innerHtml} />;
  }

  init() {
    let infoStyle = {
      position: "absolute",
      top: "10px",
      width: "100%",
      textAlign: "center"
    };

    let infoInnerHtml =
      '<a href="http://threejs.org" target="_blank" rel="noopener">three.js</a> - voxel painter - webgl<br><strong>click</strong>: add voxel, <strong>shift + click</strong>: remove voxel';

    this.info = this.infoElement(infoStyle, infoInnerHtml);

    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );

    this.camera.position.set(300, 500, 1300);
    this.camera.lookAt(new THREE.Vector3());
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf0f0f0);

    // roll-over helpers
    let rollOverGeo = new THREE.BoxGeometry(50, 50, 50);

    this.rollOverMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      opacity: 0.5,
      transparent: true
    });

    this.helper = new THREE.CameraHelper(this.camera);
    this.scene.add(this.helper);
    this.rollOverMesh = new THREE.Mesh(rollOverGeo, this.rollOverMaterial);
    this.scene.add(this.rollOverMesh);

    // cubes
    this.cubeGeo = new THREE.BoxGeometry(50, 50, 50);
    this.cubeMaterial = new THREE.MeshLambertMaterial({
      color: 0xfeb74c,
      map: new THREE.TextureLoader().load("textures/square-outline-texture.png")
    });

    // grid
    let gridHelper = new THREE.GridHelper(1000, 20);
    this.scene.add(gridHelper);

    //
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    let geometry = new THREE.PlaneBufferGeometry(1000, 1000);
    geometry.rotateX(-Math.PI / 2);

    this.plane = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({
        visible: false
      })
    );

    this.scene.add(this.plane);
    this.objects.push(this.plane);

    // Lights
    let ambientLight = new THREE.AmbientLight(0x606060);
    this.scene.add(ambientLight);

    let directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 0.75, 0.5).normalize();

    this.scene.add(directionalLight);
    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    });

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.container.appendChild(this.renderer.domElement);

    document.addEventListener("mousemove", this.onDocumentMouseMove, false);
    document.addEventListener("mousedown", this.onDocumentMouseDown, false);
    document.addEventListener("keydown", this.onDocumentKeyDown, false);
    document.addEventListener("keyup", this.onDocumentKeyUp, false);
    //
    window.addEventListener("resize", this.onWindowResize, false);
  }

  onDocumentMouseMove() {
    event.preventDefault();
    this.mouse.set(
      event.clientX / window.innerWidth * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );

    this.raycaster.setFromCamera(this.mouse, this.camera);
    let intersects = this.raycaster.intersectObjects(this.objects);

    if (intersects.length > 0) {
      let intersect = intersects[0];
      this.rollOverMesh.position
        .copy(intersect.point)
        .add(intersect.face.normal);
      this.rollOverMesh.position
        .divideScalar(50)
        .floor()
        .multiplyScalar(50)
        .addScalar(25);
    }

    this.container.appendChild(this.renderer.domElement);
    this.render3D();
  }

  onDocumentMouseDown() {
    event.preventDefault();
    this.mouse.set(
      event.clientX / window.innerWidth * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );

    this.raycaster.setFromCamera(this.mouse, this.camera);
    let intersects = this.raycaster.intersectObjects(this.objects);
    if (intersects.length > 0) {
      let intersect = intersects[0];
      // delete cube
      if (this.isShiftDown) {
        if (intersect.object != this.plane) {
          this.scene.remove(intersect.object);
          this.objects.splice(this.objects.indexOf(intersect.object), 1);
        }
        // create cube
      } else {
        let voxel = new THREE.Mesh(this.cubeGeo, this.cubeMaterial);
        voxel.position.copy(intersect.point).add(intersect.face.normal);
        voxel.position
          .divideScalar(50)
          .floor()
          .multiplyScalar(50)
          .addScalar(25);
        this.scene.add(voxel);
        this.objects.push(voxel);
      }
      this.render3D();
    }
  }

  onDocumentKeyDown() {
    switch (event.keyCode) {
      case 16:
        this.isShiftDown = true;
        break;
    }
  }

  onDocumentKeyUp() {
    switch (event.keyCode) {
      case 16:
        this.isShiftDown = false;
        break;
    }
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  render() {
    return (
      <div
        className="_layout-diagram"
        ref={el => {
          this.container = el;
        }}
      />
    );
  }
}

ThreeViewer.propTypes = {};

function mapStateToProps(state, ownProps) {
  return {};
}

export default connect(mapStateToProps)(ThreeViewer);
