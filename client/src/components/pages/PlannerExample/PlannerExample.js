import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import * as THREE from "three";
import Blueprint3d from "../../../blueprint/blueprint3d";
import ModalEffects from "./ModalEffects";
import LoadingModal from "./LoadingModal";
import Roomdesigner from "./Roomdesigner";
import Roomplanner from "./Roomplanner";

import roomData from "./roomData";

export default class PlannerExample extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showLoading: false,
      itemsLoading: 0,
      mode: "3d",
      hasMonted: false,
      showAddItemBar: false
    };
    this.info = {};

    this.plannerMode = this.plannerMode.bind(this);
  }

  componentDidMount() {
    let opts = {
      floorplannerElement: "floorplanner-canvas",
      threeElement: "viewer",
      // threeCanvasElement: "three-canvas", Isn't used in the original project
      textureDir: "models/textures",
      widget: false
    };
    this.blueprint3d = new Blueprint3d(opts);

    // This serialization format needs work
    // Load a simple rectangle room
    this.blueprint3d.model.loadSerialized(
      roomData
      // '{"floorplan":{"corners":{"f90da5e3-9e0e-eba7-173d-eb0b071e838e":{"x":204.85099999999989,"y":289.052},"da026c08-d76a-a944-8e7b-096b752da9ed":{"x":672.2109999999999,"y":289.052},"4e3d65cb-54c0-0681-28bf-bddcc7bdb571":{"x":672.2109999999999,"y":-178.308},"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2":{"x":204.85099999999989,"y":-178.308}},"walls":[{"corner1":"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2","corner2":"f90da5e3-9e0e-eba7-173d-eb0b071e838e","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}},{"corner1":"f90da5e3-9e0e-eba7-173d-eb0b071e838e","corner2":"da026c08-d76a-a944-8e7b-096b752da9ed","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}},{"corner1":"da026c08-d76a-a944-8e7b-096b752da9ed","corner2":"4e3d65cb-54c0-0681-28bf-bddcc7bdb571","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}},{"corner1":"4e3d65cb-54c0-0681-28bf-bddcc7bdb571","corner2":"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}}],"wallTextures":[],"floorTextures":{},"newFloorTextures":{}},"items":[]}'
    );

    this.floorPlanner;
    this.setState({ hasMonted: true });
    this.setState({ plannerMode: "3d" });
  }

  infoElement(style, innerHtml) {
    return <div style={style} dangerouslySetInnerHTML={innerHtml} />;
  }

  plannerMode(mode) {
    this.blueprint3d.model.floorplan.update();
    this.setState({ plannerMode: mode });
  }

  componentDidUpdate() {
    this.blueprint3d.three.updateWindowSize();
    this.blueprint3d.floorplanner.resizeView();
  }

  getViewerClass(mode) {
    if (!this.state.hasMonted) {
      return "";
    }

    return this.state.plannerMode !== mode ? "" : "hide";
  }

  render() {
    return (
      <div id="canvas-wrapper">
        <ModalEffects showLoading={this.state.itemsLoading > 0} />
        <Roomdesigner
          showing={this.getViewerClass("2d")}
          plannerMode={this.plannerMode}
        />
        <Roomdesigner
          showing={this.getViewerClass("3d")}
          plannerMode={this.plannerMode}
        />
      </div>
    );
  }
}
