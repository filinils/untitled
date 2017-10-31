import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import * as THREE from "three";
import Blueprint3d from "../../../blueprint/blueprint3d";
import ModalEffects from "./ModalEffects";
import LoadingModal from "./LoadingModal";
import Roomdesigner from "./Roomdesigner";
import Floorplanner from "./Floorplanner";

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
		this.blueprint3d.model.loadSerialized(roomData);

		this.setState({ hasMonted: true });
		this.setState({ plannerMode: "3d" });

		window.blue = this.blueprint3d;
		this.controller = this.blueprint3d.three.getController();
	}

	componentDidUpdate() {
		this.blueprint3d.three.updateWindowSize();
		this.blueprint3d.floorplanner.resizeView();
	}

	plannerMode(mode) {
		this.blueprint3d.model.floorplan.update();
		this.setState({ plannerMode: mode });
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
					controller={this.controller}
				/>
				<Floorplanner
					showing={this.getViewerClass("3d")}
					plannerMode={this.plannerMode}
				/>
			</div>
		);
	}
}
