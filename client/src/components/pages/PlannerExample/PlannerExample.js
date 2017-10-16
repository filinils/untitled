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

		// let move = document.getElementById("move");
		// this.remove = document.getElementById("remove");
		// this.draw = document.getElementById("draw");
		// buttons
		// OLD CODE
		var move = "#move";
		var remove = "#delete";
		var draw = "#draw";

		var activeStlye = "btn-primary disabled";

		this.floorplanner = blueprint3d.floorplanner;

		var scope = this;

		function init() {
			window.addEventListener("resize", () => scope.handleWindowResize());
			scope.handleWindowResize();

			//TODO: EVENTS!!

			// mode buttons
			scope.floorplanner.modeResetCallbacks.add(function(mode) {
				draw.classNameList.remove(activeStlye);
				remove.classNameList.remove(activeStlye);
				move.classNameList.remove(activeStlye);

				if (mode == Floorplanner.floorplannerModes.MOVE) {
					move.classNameList.add(activeStlye);
				} else if (mode == Floorplanner.floorplannerModes.DRAW) {
					draw.classNameList.add(activeStlye);
				} else if (mode == Floorplanner.floorplannerModes.DELETE) {
					remove.add(activeStlye);
				}

				if (mode == Floorplanner.floorplannerModes.DRAW) {
					document.getElementById(
						"draw-walls-hint"
					).style.display = true;
					scope.handleWindowResize();
				} else {
					document.getElementById(
						"draw-walls-hint"
					).style.display = false;
				}
			});

			document.querySelector(move).click(function() {
				scope.floorplanner.setMode(Floorplanner.floorplannerModes.MOVE);
			});

			document.querySelector(draw).click(function() {
				scope.floorplanner.setMode(Floorplanner.floorplannerModes.DRAW);
			});

			document.querySelector(remove).click(function() {
				scope.floorplanner.setMode(
					Floorplanner.floorplannerModes.DELETE
				);
			});
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
		this.contextMenu = new ContextMenu(this.blueprint3d);
		this.sideMenu = new SideMenu(
			this.blueprint3d,
			this.viewerFloorplanner,
			this.modalEffects
		);
		this.textureSelector = new TextureSelector(blueprint3d, sideMenu);
		this.cameraButtons = new CameraButtons(blueprint3d);
		mainControls(blueprint3d);

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
			<div>
				<div
					className="_layout-diagram"
					ref={el => {
						this.container = el;
					}}
				/>
				<div className="container-fluid">
					<div className="row main-row">
						<div className="col-xs-3 sidebar">
							<ul className="nav nav-sidebar">
								<li id="floorplan_tab">
									<a href="#">
										Edit Floorplan
										<span className="glyphicon glyphicon-chevron-right pull-right" />
									</a>
								</li>
								<li id="design_tab">
									<a href="#">
										Design
										<span className="glyphicon glyphicon-chevron-right pull-right" />
									</a>
								</li>
								<li id="items_tab">
									<a href="#">
										Add Items
										<span className="glyphicon glyphicon-chevron-right pull-right" />
									</a>
								</li>
							</ul>
							<hr />

							<div id="context-menu">
								<div style={{ margin: "0 20px" }}>
									<span
										id="context-menu-name"
										className="lead"
									/>
									<br />
									<br />
									<button
										className="btn btn-block btn-danger"
										id="context-menu-delete"
									>
										<span className="glyphicon glyphicon-trash" />
										Delete Item
									</button>
									<br />
									<div className="panel panel-default">
										<div className="panel-heading">
											Adjust Size
										</div>
										<div
											className="panel-body"
											style={{ color: "#333333" }}
										>
											<div
												className="form form-horizontal"
												className="lead"
											>
												<div className="form-group">
													<label className="col-sm-5 control-label">
														Width
													</label>
													<div className="col-sm-6">
														<input
															type="number"
															className="form-control"
															id="item-width"
														/>
													</div>
												</div>
												<div className="form-group">
													<label className="col-sm-5 control-label">
														Depth
													</label>
													<div className="col-sm-6">
														<input
															type="number"
															className="form-control"
															id="item-depth"
														/>
													</div>
												</div>
												<div className="form-group">
													<label className="col-sm-5 control-label">
														Height
													</label>
													<div className="col-sm-6">
														<input
															type="number"
															className="form-control"
															id="item-height"
														/>
													</div>
												</div>
											</div>
											<small>
												<span className="text-muted">
													Measurements in inches.
												</span>
											</small>
										</div>
									</div>

									<label>
										<input type="checkbox" id="fixed" />{" "}
										Lock in place
									</label>
									<br />
									<br />
								</div>
							</div>

							{/* Floor textures */}
							<div
								id="floorTexturesDiv"
								style={{ display: "none", padding: "0 20px" }}
							>
								<div className="panel panel-default">
									<div className="panel-heading">
										Adjust Floor
									</div>
									<div className="panel-body">
										style="color: #333333"
										<div className="col-sm-6">
											style="padding: 3px"
											<a
												href="#"
												className="thumbnail texture-select-thumbnail"
												texture-url="rooms/textures/light_fine_wood.jpg"
												texture-stretch="false"
												texture-scale="300"
											>
												<img
													alt="Thumbnail light fine wood"
													src="rooms/thumbnails/thumbnail_light_fine_wood.jpg"
												/>
											</a>
										</div>
									</div>
								</div>
							</div>

							<div id="wallTextures">
								style="display:none; padding: 0 20px"
								<div className="panel panel-default">
									<div className="panel-heading">
										Adjust Wall
									</div>
									<div className="panel-body">
										style="color: #333333"
										<div className="col-sm-6">
											style="padding: 3px"
											<a
												href="#"
												className="thumbnail texture-select-thumbnail"
												texture-url="rooms/textures/marbletiles.jpg"
												texture-stretch="false"
												texture-scale="300"
											>
												<img
													alt="Thumbnail marbletiles"
													src="rooms/thumbnails/thumbnail_marbletiles.jpg"
												/>
											</a>
										</div>
										<div className="col-sm-6">
											/* style="padding: 3px" */
											<a
												href="#"
												className="thumbnail texture-select-thumbnail"
												texture-url="rooms/textures/wallmap_yellow.png"
												texture-stretch="true"
												texture-scale=""
											>
												<img
													alt="Thumbnail wallmap yellow"
													src="rooms/thumbnails/thumbnail_wallmap_yellow.png"
												/>
											</a>
										</div>
										<div className="col-sm-6">
											style="padding: 3px"
											<a
												href="#"
												className="thumbnail texture-select-thumbnail"
												texture-url="rooms/textures/light_brick.jpg"
												texture-stretch="false"
												texture-scale="100"
											>
												<img
													alt="Thumbnail light brick"
													src="rooms/thumbnails/thumbnail_light_brick.jpg"
												/>
											</a>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* <!-- Right Column --> */}
						<div className="col-xs-9 main">
							{/* <!-- 3D Viewer --> */}
							<div id="viewer">
								<div id="main-controls">
									<a
										href="#"
										className="btn btn-default btn-sm"
										id="new"
									>
										New Plan
									</a>
									<a
										href="#"
										className="btn btn-default btn-sm"
										id="saveFile"
									>
										Save Plan
									</a>
									<a className="btn btn-sm btn-default btn-file">
										<input
											type="file"
											className="hidden-input"
											id="loadFile"
										/>
										Load Plan
									</a>
								</div>

								<div id="camera-controls">
									<a
										href="#"
										className="btn btn-default bottom"
										id="zoom-out"
									>
										<span className="glyphicon glyphicon-zoom-out" />
									</a>
									<a
										href="#"
										className="btn btn-default bottom"
										id="reset-view"
									>
										<span className="glyphicon glyphicon glyphicon-home" />
									</a>
									<a
										href="#"
										className="btn btn-default bottom"
										id="zoom-in"
									>
										<span className="glyphicon glyphicon-zoom-in" />
									</a>

									<span>&nbsp;</span>

									<a
										className="btn btn-default bottom"
										href="#"
										id="move-left"
									>
										<span className="glyphicon glyphicon-arrow-left" />
									</a>
									<span className="btn-group-vertical">
										<a
											className="btn btn-default"
											href="#"
											id="move-up"
										>
											<span className="glyphicon glyphicon-arrow-up" />
										</a>
										<a
											className="btn btn-default"
											href="#"
											id="move-down"
										>
											<span className="glyphicon glyphicon-arrow-down" />
										</a>
									</span>
									<a
										className="btn btn-default bottom"
										href="#"
										id="move-right"
									>
										<span className="glyphicon glyphicon-arrow-right" />
									</a>
								</div>

								<div id="loading-modal">
									<h1>Loading...</h1>
								</div>
							</div>

							{/* <!-- 2D Floorplanner --> */}
							<div id="floorplanner">
								<canvas id="floorplanner-canvas" />
								<div id="floorplanner-controls">
									<button
										id="move"
										className="btn btn-sm btn-default"
									>
										<span className="glyphicon glyphicon-move" />
										Move Walls
									</button>
									<button
										id="draw"
										className="btn btn-sm btn-default"
									>
										<span className="glyphicon glyphicon-pencil" />
										Draw Walls
									</button>
									<button
										id="delete"
										className="btn btn-sm btn-default"
									>
										<span className="glyphicon glyphicon-remove" />
										Delete Walls
									</button>
									<span className="pull-right">
										<button
											className="btn btn-primary btn-sm"
											id="update-floorplan"
										>
											Done &raquo;
										</button>
									</span>
								</div>
								<div id="draw-walls-hint">
									Press the "Esc" key to stop drawing walls
								</div>
							</div>

							{/* <!-- Add Items --> */}
							<div id="add-items">
								<div className="row" id="items-wrapper">
									{/* <!-- Items added here by items.js --> */}
								</div>
							</div>
						</div>
						{/* <!-- End Right Column --> */}
					</div>
				</div>
			</div>
		);
	}
}

PlannerExample.propTypes = {};

function mapStateToProps(state, ownProps) {
	return {};
}

export default connect(mapStateToProps)(PlannerExample);

var ContextMenu = function(blueprint3d) {
	var scope = this;
	var selectedItem;
	var three = blueprint3d.three;

	function init() {
		document.querySelector("#context-menu-delete").click(function(event) {
			selectedItem.remove();
		});

		three.itemSelectedCallbacks.add(itemSelected);
		three.itemUnselectedCallbacks.add(itemUnselected);

		initResize();

		document.querySelector("#fixed").click(function() {
			var checked = this.prop("checked");
			selectedItem.setFixed(checked);
		});
	}

	function cmToIn(cm) {
		return cm / 2.54;
	}

	function inToCm(inches) {
		return inches * 2.54;
	}

	function itemSelected(item) {
		selectedItem = item;

		$("#context-menu-name").text(item.metadata.itemName);

		$("#item-width").val(cmToIn(selectedItem.getWidth()).toFixed(0));
		$("#item-height").val(cmToIn(selectedItem.getHeight()).toFixed(0));
		$("#item-depth").val(cmToIn(selectedItem.getDepth()).toFixed(0));

		$("#context-menu").show();

		$("#fixed").prop("checked", item.fixed);
	}

	function resize() {
		selectedItem.resize(
			inToCm($("#item-height").val()),
			inToCm($("#item-width").val()),
			inToCm($("#item-depth").val())
		);
	}

	function initResize() {
		$("#item-height").change(resize);
		$("#item-width").change(resize);
		$("#item-depth").change(resize);
	}

	function itemUnselected() {
		selectedItem = null;
		$("#context-menu").hide();
	}

	init();
};
