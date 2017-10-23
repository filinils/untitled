import Utils from "../core/utils";
import Dimensioning from "../core/dimensioning";
import * as THREE from "three";

/** */
export const floorplannerModes = {
	MOVE: 0,
	DRAW: 1,
	DELETE: 2
};

// grid parameters
const gridSpacing = 20; // pixels
const gridWidth = 1;
const gridColor = "#f1f1f1";

// room config
const roomColor = "#f9f9f9";

// wall config
const wallWidth = 5;
const wallWidthHover = 7;
const wallColor = "#dddddd";
const wallColorHover = "#008cba";
const edgeColor = "#888888";
const edgeColorHover = "#008cba";
const edgeWidth = 1;

const deleteColor = "#ff0000";

// corner config
const cornerRadius = 0;
const cornerRadiusHover = 7;
const cornerColor = "#cccccc";
const cornerColorHover = "#008cba";

/**
   * The View to be used by a Floorplanner to render in/interact with.
   */
export default (floorplan, viewmodel, canvas) => {
	/** The canvas element. */
	let scope = this;
	this.floorplan = floorplan;
	let canvasElement = document.getElementById(canvas);

	/** The 2D context. */
	let context = canvasElement.getContext("2d");

	window.addEventListener("resize", () => handleWindowResize());
	handleWindowResize();

	function handleWindowResize() {
		var canvasSel = document.getElementById(canvas);
		var parent = canvasSel.parentNode;
		canvasSel.height = parent.height;
		canvasSel.width = parent.width;
		canvasElement.height = parent.clientHeight;
		canvasElement.width = parent.clientWidth;
		draw();
	}

	/** */
	function draw() {
		context.clearRect(0, 0, canvasElement.width, canvasElement.height);

		drawGrid();

		scope.floorplan.getRooms().forEach(room => {
			drawRoom(room);
		});

		floorplan.getWalls().forEach(wall => {
			drawWall(wall);
		});

		floorplan.getCorners().forEach(corner => {
			drawCorner(corner);
		});

		if (viewmodel.mode == floorplannerModes.DRAW) {
			drawTarget(
				viewmodel.targetX,
				viewmodel.targetY,
				viewmodel.lastNode
			);
		}

		floorplan.getWalls().forEach(wall => {
			drawWallLabels(wall);
		});
	}

	/** */
	function drawWallLabels(wall) {
		// we'll just draw the shorter label... idk
		if (wall.backEdge && wall.frontEdge) {
			if (
				wall.backEdge.interiorDistance < wall.frontEdge.interiorDistance
			) {
				drawEdgeLabel(wall.backEdge);
			} else {
				drawEdgeLabel(wall.frontEdge);
			}
		} else if (wall.backEdge) {
			drawEdgeLabel(wall.backEdge);
		} else if (wall.frontEdge) {
			drawEdgeLabel(wall.frontEdge);
		}
	}

	/** */
	function drawWall(wall) {
		var hover = wall === viewmodel.activeWall;
		var color = wallColor;
		if (hover && viewmodel.mode == floorplannerModes.DELETE) {
			color = deleteColor;
		} else if (hover) {
			color = wallColorHover;
		}
		drawLine(
			viewmodel.convertX(wall.getStartX()),
			viewmodel.convertY(wall.getStartY()),
			viewmodel.convertX(wall.getEndX()),
			viewmodel.convertY(wall.getEndY()),
			hover ? wallWidthHover : wallWidth,
			color
		);
		if (!hover && wall.frontEdge) {
			drawEdge(wall.frontEdge, hover);
		}
		if (!hover && wall.backEdge) {
			drawEdge(wall.backEdge, hover);
		}
	}

	/** */
	function drawEdgeLabel(edge) {
		var pos = edge.interiorCenter();
		var length = edge.interiorDistance();
		if (length < 60) {
			// dont draw labels on walls this short
			return;
		}
		context.font = "normal 12px Arial";
		context.fillStyle = "#000000";
		context.textBaseline = "middle";
		context.textAlign = "center";
		context.strokeStyle = "#ffffff";
		context.lineWidth = 4;

		context.strokeText(
			Dimensioning.cmToMeasure(length),
			viewmodel.convertX(pos.x),
			viewmodel.convertY(pos.y)
		);
		context.fillText(
			Dimensioning.cmToMeasure(length),
			viewmodel.convertX(pos.x),
			viewmodel.convertY(pos.y)
		);
	}

	/** */
	function drawEdge(edge, hover) {
		let self = this;
		var color = edgeColor;
		if (hover && viewmodel.mode == floorplannerModes.DELETE) {
			color = deleteColor;
		} else if (hover) {
			color = edgeColorHover;
		}
		var corners = edge.corners();

		drawPolygon(
			Utils.map(corners, function(corner) {
				return viewmodel.convertX(corner.x);
			}),
			Utils.map(corners, function(corner) {
				return viewmodel.convertY(corner.y);
			}),
			false,
			null,
			true,
			color,
			edgeWidth
		);
	}

	/** */
	function drawRoom(room) {
		drawPolygon(
			Utils.map(room.corners, corner => {
				return viewmodel.convertX(corner.x);
			}),
			Utils.map(room.corners, corner => {
				return viewmodel.convertY(corner.y);
			}),
			true,
			roomColor
		);
	}

	/** */
	function drawCorner(corner) {
		var hover = corner === viewmodel.activeCorner;
		var color = cornerColor;
		if (hover && viewmodel.mode == floorplannerModes.DELETE) {
			color = deleteColor;
		} else if (hover) {
			color = cornerColorHover;
		}
		drawCircle(
			viewmodel.convertX(corner.x),
			viewmodel.convertY(corner.y),
			hover ? cornerRadiusHover : cornerRadius,
			color
		);
	}

	/** */
	function drawTarget(x, y, lastNode) {
		drawCircle(
			viewmodel.convertX(x),
			viewmodel.convertY(y),
			cornerRadiusHover,
			cornerColorHover
		);
		if (viewmodel.lastNode) {
			drawLine(
				viewmodel.convertX(lastNode.x),
				viewmodel.convertY(lastNode.y),
				viewmodel.convertX(x),
				viewmodel.convertY(y),
				wallWidthHover,
				wallColorHover
			);
		}
	}

	/** */
	function drawLine(startX, startY, endX, endY, width, color) {
		// width is an integer
		// color is a hex string, i.e. #ff0000
		context.beginPath();
		context.moveTo(startX, startY);
		context.lineTo(endX, endY);
		context.lineWidth = width;
		context.strokeStyle = color;
		context.stroke();
	}

	/** */
	function drawPolygon(
		xArr,
		yArr,
		fill,
		fillColor,
		stroke,
		strokeColor,
		strokeWidth
	) {
		// fillColor is a hex string, i.e. #ff0000
		fill = fill || false;
		stroke = stroke || false;
		context.beginPath();
		context.moveTo(xArr[0], yArr[0]);
		for (var i = 1; i < xArr.length; i++) {
			context.lineTo(xArr[i], yArr[i]);
		}
		context.closePath();
		if (fill) {
			context.fillStyle = fillColor;
			context.fill();
		}
		if (stroke) {
			context.lineWidth = strokeWidth;
			context.strokeStyle = strokeColor;
			context.stroke();
		}
	}

	/** */
	function drawCircle(centerX, centerY, radius, fillColor) {
		context.beginPath();
		context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
		context.fillStyle = fillColor;
		context.fill();
	}

	/** returns n where -gridSize/2 < n <= gridSize/2  */
	function calculateGridOffset(n) {
		if (n >= 0) {
			return (n + gridSpacing / 2.0) % gridSpacing - gridSpacing / 2.0;
		} else {
			return (n - gridSpacing / 2.0) % gridSpacing + gridSpacing / 2.0;
		}
	}

	/** */
	function drawGrid() {
		var offsetX = calculateGridOffset(-viewmodel.originX);
		var offsetY = calculateGridOffset(-viewmodel.originY);
		var width = canvasElement.width;
		var height = canvasElement.height;
		for (var x = 0; x <= width / gridSpacing; x++) {
			drawLine(
				gridSpacing * x + offsetX,
				0,
				gridSpacing * x + offsetX,
				height,
				gridWidth,
				gridColor
			);
		}
		for (var y = 0; y <= height / gridSpacing; y++) {
			drawLine(
				0,
				gridSpacing * y + offsetY,
				width,
				gridSpacing * y + offsetY,
				gridWidth,
				gridColor
			);
		}
	}

	return {
		handleWindowResize,
		draw
	};
};
