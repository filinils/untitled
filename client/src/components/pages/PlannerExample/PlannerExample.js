import * as THREE from "three";
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Blueprint3d from "../../../blueprint/blueprint3d";
import * as Floorplanner from "../../../blueprint/floorplanner/floorplanner_view";
import ModalEffects from "./ModalEffects";

class PlannerExample extends React.Component {
  constructor(props) {
    super(props);

    this.isShiftDown = false;
    this.objects = [];

    this.info = {};

    this.onDocumentKeyDown = this.onDocumentKeyDown.bind(this);
    this.onDocumentKeyUp = this.onDocumentKeyUp.bind(this);
    this.onDocumentMouseDown = this.onDocumentMouseDown.bind(this);
    this.onDocumentMouseMove = this.onDocumentMouseMove.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
  }

  ViewerFloorplanner(blueprint3d) {
    var canvasWrapper = "#floorplanner";

    // buttons
    var move = "#move";
    var remove = "#delete";
    var draw = "#draw";

    var activeStlye = "btn-primary disabled";

    this.floorplanner = blueprint3d.floorplanner;

    var scope = this;

    function init() {
      // $(window).resize(scope.handleWindowResize);
      scope.handleWindowResize();

      //TODO: EVENTS!!

      // // mode buttons
      // scope.floorplanner.modeResetCallbacks.add(function(mode) {
      //   $(draw).removeClass(activeStlye);
      //   $(remove).removeClass(activeStlye);
      //   $(move).removeClass(activeStlye);
      //   if (mode == Floorplanner.floorplannerModes.MOVE) {
      //     $(move).addClass(activeStlye);
      //   } else if (mode == Floorplanner.floorplannerModes.DRAW) {
      //     $(draw).addClass(activeStlye);
      //   } else if (mode == Floorplanner.floorplannerModes.DELETE) {
      //     $(remove).addClass(activeStlye);
      //   }

      //   if (mode == Floorplanner.floorplannerModes.DRAW) {
      //     $("#draw-walls-hint").show();
      //     scope.handleWindowResize();
      //   } else {
      //     $("#draw-walls-hint").hide();
      //   }
      // });

      // $(move).click(function() {
      //   scope.floorplanner.setMode(Floorplanner.floorplannerModes.MOVE);
      // });

      // $(draw).click(function() {
      //   scope.floorplanner.setMode(Floorplanner.floorplannerModes.DRAW);
      // });

      // $(remove).click(function() {
      //   scope.floorplanner.setMode(Floorplanner.floorplannerModes.DELETE);
      // });
    }

    this.updateFloorplanView = function() {
      scope.floorplanner.reset();
    };

    this.handleWindowResize = function() {
      // $(canvasWrapper).height(
      //   window.innerHeight - $(canvasWrapper).offset().top
      // );
      scope.floorplanner.resizeView();
    };

    init();
  }

  componentDidMount() {
    // main setup
    let opts = {
      floorplannerElement: "floorplanner-canvas",
      threeElement: "viewer",
      threeCanvasElement: "three-canvas",
      textureDir: "models/textures/",
      widget: false
    };
    this.blueprint3d = new Blueprint3d(opts);

    this.modalEffects = new ModalEffects(this.blueprint3d);
    this.viewerFloorplanner = new this.ViewerFloorplanner(this.blueprint3d);
    //this.contextMenu = new ContextMenu(blueprint3d);
    //this.sideMenu = new SideMenu(blueprint3d, viewerFloorplanner, modalEffects);
    //this.textureSelector = new TextureSelector(blueprint3d, sideMenu);
    //this.cameraButtons = new CameraButtons(blueprint3d);
    //mainControls(blueprint3d);

    // This serialization format needs work
    // Load a simple rectangle room
    this.blueprint3d.model.loadSerialized(
      '{"floorplan":{"corners":{"f90da5e3-9e0e-eba7-173d-eb0b071e838e":{"x":204.85099999999989,"y":289.052},"da026c08-d76a-a944-8e7b-096b752da9ed":{"x":672.2109999999999,"y":289.052},"4e3d65cb-54c0-0681-28bf-bddcc7bdb571":{"x":672.2109999999999,"y":-178.308},"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2":{"x":204.85099999999989,"y":-178.308}},"walls":[{"corner1":"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2","corner2":"f90da5e3-9e0e-eba7-173d-eb0b071e838e","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}},{"corner1":"f90da5e3-9e0e-eba7-173d-eb0b071e838e","corner2":"da026c08-d76a-a944-8e7b-096b752da9ed","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}},{"corner1":"da026c08-d76a-a944-8e7b-096b752da9ed","corner2":"4e3d65cb-54c0-0681-28bf-bddcc7bdb571","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}},{"corner1":"4e3d65cb-54c0-0681-28bf-bddcc7bdb571","corner2":"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}}],"wallTextures":[],"floorTextures":{},"newFloorTextures":{}},"items":[]}'
    );
  }

  render3D() {
    if (this.renderer) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  infoElement(style, innerHtml) {
    return <div style={style} dangerouslySetInnerHTML={innerHtml} />;
  }

  onDocumentMouseMove(event) {
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

  onDocumentMouseDown(event) {}

  onDocumentKeyDown(event) {
    switch (event.keyCode) {
      case 16:
        this.isShiftDown = true;
        break;
    }
  }

  onDocumentKeyUp(event) {
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
      >
        <canvas id="floorplanner-canvas" />
        <div id="viewer" />
      </div>
    );
  }
}

PlannerExample.propTypes = {};

function mapStateToProps(state, ownProps) {
  return {};
}

export default connect(mapStateToProps)(PlannerExample);
