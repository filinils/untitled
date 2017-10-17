import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import * as THREE from "three";
import Blueprint3d from "../../../blueprint/blueprint3d";
import ModalEffects from "./ModalEffects";

import LoadingModal from "./LoadingModal";

export default class PlannerExample extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showLoading: false,
      itemsLoading: 0
    };

    this.isShiftDown = false;
    this.objects = [];

    this.info = {};

    this.onDocumentKeyDown = this.onDocumentKeyDown.bind(this);
    this.onDocumentKeyUp = this.onDocumentKeyUp.bind(this);
    this.onDocumentMouseDown = this.onDocumentMouseDown.bind(this);
    this.onDocumentMouseMove = this.onDocumentMouseMove.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
  }

  ViewerFloorplanner(blueprint3d) {}

  componentDidMount() {
    let opts = {
      floorplannerElement: "floorplanner-canvas",
      threeElement: "viewer",
      // threeCanvasElement: "three-canvas", Isn't used in the original project
      textureDir: "models/textures",
      widget: false
    };
    this.blueprint3d = new Blueprint3d(opts);

    this.viewerFloorplanner = new this.ViewerFloorplanner(this.blueprint3d);

    // This serialization format needs work
    // Load a simple rectangle room
    this.blueprint3d.model.loadSerialized(
      `{
				"floorplan": {
				  "corners": {
					"56d9ebd1-91b2-875c-799d-54b3785fca1f": {
					  "x": 630.555,
					  "y": -227.58400000000006
					},
					"8f4a050d-e102-3c3f-5af9-3d9133555d76": {
					  "x": 294.64,
					  "y": -227.58400000000006
					},
					"4e312eca-6c4f-30d1-3d9a-a19a9d1ee359": { "x": 294.64, "y": 232.664 },
					"254656bf-8a53-3987-c810-66b349f49b19": {
					  "x": 745.7439999999998,
					  "y": 232.664
					},
					"11d25193-4411-fbbf-78cb-ae7c0283164b": {
					  "x": 1044.7019999999998,
					  "y": 232.664
					},
					"edf0de13-df9f-cd6a-7d11-9bd13c36ce12": {
					  "x": 1044.7019999999998,
					  "y": -105.66399999999999
					},
					"e7db8654-efe1-bda2-099a-70585874d8c0": {
					  "x": 745.7439999999998,
					  "y": -105.66399999999999
					}
				  },
				  "walls": [
					{
					  "corner1": "4e312eca-6c4f-30d1-3d9a-a19a9d1ee359",
					  "corner2": "254656bf-8a53-3987-c810-66b349f49b19",
					  "frontTexture": {
						"url": "assets/rooms/textures/wallmap.png",
						"stretch": true,
						"scale": 0
					  },
					  "backTexture": {
						"url": "assets/rooms/textures/wallmap_yellow.png",
						"stretch": true,
						"scale": null
					  }
					},
					{
					  "corner1": "254656bf-8a53-3987-c810-66b349f49b19",
					  "corner2": "e7db8654-efe1-bda2-099a-70585874d8c0",
					  "frontTexture": {
						"url": "rooms/textures/wallmap.png",
						"stretch": true,
						"scale": 0
					  },
					  "backTexture": {
						"url": "assets/rooms/textures/wallmap_yellow.png",
						"stretch": true,
						"scale": null
					  }
					},
					{
					  "corner1": "56d9ebd1-91b2-875c-799d-54b3785fca1f",
					  "corner2": "8f4a050d-e102-3c3f-5af9-3d9133555d76",
					  "frontTexture": {
						"url": "rooms/textures/wallmap.png",
						"stretch": true,
						"scale": 0
					  },
					  "backTexture": {
						"url": "assets/rooms/textures/wallmap_yellow.png",
						"stretch": true,
						"scale": null
					  }
					},
					{
					  "corner1": "8f4a050d-e102-3c3f-5af9-3d9133555d76",
					  "corner2": "4e312eca-6c4f-30d1-3d9a-a19a9d1ee359",
					  "frontTexture": {
						"url": "assets/rooms/textures/wallmap.png",
						"stretch": true,
						"scale": 0
					  },
					  "backTexture": {
						"url": "assets/rooms/textures/wallmap_yellow.png",
						"stretch": true,
						"scale": null
					  }
					},
					{
					  "corner1": "254656bf-8a53-3987-c810-66b349f49b19",
					  "corner2": "11d25193-4411-fbbf-78cb-ae7c0283164b",
					  "frontTexture": {
						"url": "assets/rooms/textures/wallmap.png",
						"stretch": true,
						"scale": 0
					  },
					  "backTexture": {
						"url": "assets/rooms/textures/wallmap.png",
						"stretch": true,
						"scale": 0
					  }
					},
					{
					  "corner1": "11d25193-4411-fbbf-78cb-ae7c0283164b",
					  "corner2": "edf0de13-df9f-cd6a-7d11-9bd13c36ce12",
					  "frontTexture": {
						"url": "assets/rooms/textures/wallmap.png",
						"stretch": true,
						"scale": 0
					  },
					  "backTexture": {
						"url": "assets/rooms/textures/light_brick.jpg",
						"stretch": false,
						"scale": 100
					  }
					},
					{
					  "corner1": "edf0de13-df9f-cd6a-7d11-9bd13c36ce12",
					  "corner2": "e7db8654-efe1-bda2-099a-70585874d8c0",
					  "frontTexture": {
						"url": "rooms/textures/wallmap.png",
						"stretch": true,
						"scale": 0
					  },
					  "backTexture": {
						"url": "rooms/textures/wallmap.png",
						"stretch": true,
						"scale": 0
					  }
					},
					{
					  "corner1": "e7db8654-efe1-bda2-099a-70585874d8c0",
					  "corner2": "56d9ebd1-91b2-875c-799d-54b3785fca1f",
					  "frontTexture": {
						"url": "rooms/textures/wallmap.png",
						"stretch": true,
						"scale": 0
					  },
					  "backTexture": {
						"url": "assets/rooms/textures/wallmap_yellow.png",
						"stretch": true,
						"scale": null
					  }
					}
				  ],
				  "wallTextures": [],
				  "floorTextures": {},
				  "newFloorTextures": {
					"11d25193-4411-fbbf-78cb-ae7c0283164b,254656bf-8a53-3987-c810-66b349f49b19,e7db8654-efe1-bda2-099a-70585874d8c0,edf0de13-df9f-cd6a-7d11-9bd13c36ce12": {
					  "url": "assets/rooms/textures/light_fine_wood.jpg",
					  "scale": 300
					}
				  }
				},
				"items": [
				  {
					"item_name": "Full Bed",
					"item_type": 1,
					"model_url": "assets/models/js/ik_nordli_full.js",
					"xpos": 939.5525544513545,
					"ypos": 50,
					"zpos": -15.988409993966997,
					"rotation": -1.5707963267948966,
					"scale_x": 1,
					"scale_y": 1,
					"scale_z": 1,
					"fixed": false
				  },
				  {
					"item_name": "Bedside table - White",
					"item_type": 1,
					"model_url": "assets/models/js/cb-archnight-white_baked.js",
					"xpos": 1001.0862865204286,
					"ypos": 31.15939942141,
					"zpos": 86.4297300551338,
					"rotation": -0.7872847644705953,
					"scale_x": 1,
					"scale_y": 1,
					"scale_z": 1,
					"fixed": false
				  },
				  {
					"item_name": "Open Door",
					"item_type": 7,
					"model_url": "assets/models/js/open_door.js",
					"xpos": 745.2440185546875,
					"ypos": 110.5,
					"zpos": 64.8291839065202,
					"rotation": -1.5707963267948966,
					"scale_x": 1.7003089598352215,
					"scale_y": 0.997292171703541,
					"scale_z": 0.999415040540576,
					"fixed": false
				  },
				  {
					"item_name": "Window",
					"item_type": 3,
					"model_url": "assets/models/js/whitewindow.js",
					"xpos": 886.8841174461031,
					"ypos": 139.1510114697785,
					"zpos": -105.16400146484375,
					"rotation": 0,
					"scale_x": 1,
					"scale_y": 1,
					"scale_z": 1,
					"fixed": false
				  },
				  {
					"item_name": "Dresser - White",
					"item_type": 1,
					"model_url": "assets/models/js/we-narrow6white_baked.js",
					"xpos": 898.0548281668393,
					"ypos": 35.611997646165,
					"zpos": 201.10860458067486,
					"rotation": -3.141592653589793,
					"scale_x": 1,
					"scale_y": 1,
					"scale_z": 1,
					"fixed": false
				  },
				  {
					"item_name": "Window",
					"item_type": 3,
					"model_url": "assets/models/js/whitewindow.js",
					"xpos": 534.9620937975317,
					"ypos": 137.60931398864443,
					"zpos": -227.08399963378906,
					"rotation": 0,
					"scale_x": 1,
					"scale_y": 1,
					"scale_z": 1,
					"fixed": false
				  },
				  {
					"item_name": "Window",
					"item_type": 3,
					"model_url": "assets/models/js/whitewindow.js",
					"xpos": 295.1400146484375,
					"ypos": 141.43383044055196,
					"zpos": 123.2280598724867,
					"rotation": 1.5707963267948966,
					"scale_x": 1,
					"scale_y": 1,
					"scale_z": 1,
					"fixed": false
				  },
				  {
					"item_name": "Media Console - White",
					"item_type": 1,
					"model_url": "assets/models/js/cb-clapboard_baked.js",
					"xpos": 658.6568227980731,
					"ypos": 67.88999754395999,
					"zpos": -141.50237235990153,
					"rotation": -0.8154064090423808,
					"scale_x": 1,
					"scale_y": 1,
					"scale_z": 1,
					"fixed": false
				  },
				  {
					"item_name": "Blue Rug",
					"item_type": 8,
					"model_url": "assets/models/js/cb-blue-block-60x96.js",
					"xpos": 905.8690190229256,
					"ypos": 0.250005,
					"zpos": 44.59927303228528,
					"rotation": -1.5707963267948966,
					"scale_x": 1,
					"scale_y": 1,
					"scale_z": 1,
					"fixed": false
				  },
				  {
					"item_name": "NYC Poster",
					"item_type": 2,
					"model_url": "assets/models/js/nyc-poster2.js",
					"xpos": 1038.448276049687,
					"ypos": 146.22618581237782,
					"zpos": 148.65033715350484,
					"rotation": -1.5707963267948966,
					"scale_x": 1,
					"scale_y": 1,
					"scale_z": 1,
					"fixed": false
				  },
				  {
					"item_name": "Sofa - Grey",
					"item_type": 1,
					"model_url": "assets/models/js/cb-rochelle-gray_baked.js",
					"xpos": 356.92671999154373,
					"ypos": 42.54509923821,
					"zpos": -21.686174295784554,
					"rotation": 1.5707963267948966,
					"scale_x": 1,
					"scale_y": 1,
					"scale_z": 1,
					"fixed": false
				  },
				  {
					"item_name": "Coffee Table - Wood",
					"item_type": 1,
					"model_url": "assets/models/js/ik-stockholmcoffee-brown.js",
					"xpos": 468.479104587435,
					"ypos": 24.01483158034958,
					"zpos": -23.468458996048412,
					"rotation": 1.5707963267948966,
					"scale_x": 1,
					"scale_y": 1,
					"scale_z": 1,
					"fixed": false
				  },
				  {
					"item_name": "Floor Lamp",
					"item_type": 1,
					"model_url": "assets/models/js/ore-3legged-white_baked.js",
					"xpos": 346.697102333121,
					"ypos": 72.163997943445,
					"zpos": -175.19915302127583,
					"rotation": 0,
					"scale_x": 1,
					"scale_y": 1,
					"scale_z": 1,
					"fixed": false
				  },
				  {
					"item_name": "Red Chair",
					"item_type": 1,
					"model_url": "assets/models/js/ik-ekero-orange_baked.js",
					"xpos": 397.676038151142,
					"ypos": 37.50235073007,
					"zpos": 156.31701312594373,
					"rotation": 2.4062972386507093,
					"scale_x": 1,
					"scale_y": 1,
					"scale_z": 1,
					"fixed": false
				  },
				  {
					"item_name": "Window",
					"item_type": 3,
					"model_url": "assets/models/js/whitewindow.js",
					"xpos": 374.7738207971076,
					"ypos": 138.62749831597068,
					"zpos": -227.08399963378906,
					"rotation": 0,
					"scale_x": 1,
					"scale_y": 1,
					"scale_z": 1,
					"fixed": false
				  },
				  {
					"item_name": "Closed Door",
					"item_type": 7,
					"model_url": "assets/models/js/closed-door28x80_baked.js",
					"xpos": 637.2176377788675,
					"ypos": 110.80000022010701,
					"zpos": 232.16400146484375,
					"rotation": 3.141592653589793,
					"scale_x": 1,
					"scale_y": 1,
					"scale_z": 1,
					"fixed": false
				  },
				  {
					"item_name": "Bookshelf",
					"item_type": 1,
					"model_url": "assets/models/js/cb-kendallbookcasewalnut_baked.js",
					"xpos": 533.1460416453955,
					"ypos": 92.17650034119151,
					"zpos": 207.7644213268835,
					"rotation": 3.141592653589793,
					"scale_x": 1,
					"scale_y": 1,
					"scale_z": 1,
					"fixed": false
				  }
				]
			  }
			  `
      // '{"floorplan":{"corners":{"f90da5e3-9e0e-eba7-173d-eb0b071e838e":{"x":204.85099999999989,"y":289.052},"da026c08-d76a-a944-8e7b-096b752da9ed":{"x":672.2109999999999,"y":289.052},"4e3d65cb-54c0-0681-28bf-bddcc7bdb571":{"x":672.2109999999999,"y":-178.308},"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2":{"x":204.85099999999989,"y":-178.308}},"walls":[{"corner1":"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2","corner2":"f90da5e3-9e0e-eba7-173d-eb0b071e838e","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}},{"corner1":"f90da5e3-9e0e-eba7-173d-eb0b071e838e","corner2":"da026c08-d76a-a944-8e7b-096b752da9ed","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}},{"corner1":"da026c08-d76a-a944-8e7b-096b752da9ed","corner2":"4e3d65cb-54c0-0681-28bf-bddcc7bdb571","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}},{"corner1":"4e3d65cb-54c0-0681-28bf-bddcc7bdb571","corner2":"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}}],"wallTextures":[],"floorTextures":{},"newFloorTextures":{}},"items":[]}'
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
        <ModalEffects showLoading={this.state.itemsLoading > 0} />
        <div id="viewer" />
        <div id="floorplanner">
          <canvas id="floorplanner-canvas" />
        </div>
      </div>
    );
  }
}
