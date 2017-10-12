import FloorplannerView from "./floorplanner_view";
import * as floorConfig from "./floorplanner_view";

/** how much will we move a corner to make a wall axis aligned (cm) */

const snapTolerance = 25;

/** 
   * The Floorplanner implements an interactive tool for creation of floorplans.
   */
export default (canvas, floorplan) => {
  /** */
  let mode = 0;

  /** */
  let activeWall = null;

  /** */
  let activeCorner = null;

  /** */
  let originX = 0;

  /** */
  let originY = 0;

  /** drawing state */
  let targetX = 0;

  /** drawing state */
  let targetY = 0;

  /** drawing state */
  let lastNode = null;

  /** */
  let wallWidth;

  /** */

  /** */
  let canvasElement;

  /** */
  let view;

  /** */
  let mouseDown = false;

  /** */
  let mouseMoved = false;

  /** in ThreeJS coords */
  let mouseX = 0;

  /** in ThreeJS coords */
  let mouseY = 0;

  /** in ThreeJS coords */
  let rawMouseX = 0;

  /** in ThreeJS coords */
  let rawMouseY = 0;

  /** mouse position at last click */
  let lastX = 0;

  /** mouse position at last click */
  let lastY = 0;

  /** */
  let cmPerPixel;

  /** */
  let pixelsPerCm;

  /** */
  function constructor(canvas, floorplan) {
    this.canvasElement = $("#" + canvas);

    view = new FloorplannerView(this.floorplan, this, canvas);

    var cmPerFoot = 30.48;
    var pixelsPerFoot = 15.0;
    this.cmPerPixel = cmPerFoot * (1.0 / pixelsPerFoot);
    this.pixelsPerCm = 1.0 / this.cmPerPixel;

    this.wallWidth = 10.0 * this.pixelsPerCm;

    // Initialization:

    this.setMode(floorConfig.floorplannerModes.MOVE);

    var scope = this;

    this.canvasElement.mousedown(() => {
      scope.mousedown();
    });
    this.canvasElement.mousemove(event => {
      scope.mousemove(event);
    });
    this.canvasElement.mouseup(() => {
      scope.mouseup();
    });
    this.canvasElement.mouseleave(() => {
      scope.mouseleave();
    });

    $(document).keyup(e => {
      if (e.keyCode == 27) {
        scope.escapeKey();
      }
    });

    floorplan.roomLoadedCallbacks.add(() => {
      scope.reset();
    });
  }

  /** */
  function escapeKey() {
    this.setMode(floorConfig.floorplannerModes.MOVE);
  }

  /** */
  function updateTarget() {
    if (this.mode == floorConfig.floorplannerModes.DRAW && this.lastNode) {
      if (Math.abs(this.mouseX - this.lastNode.x) < snapTolerance) {
        this.targetX = this.lastNode.x;
      } else {
        this.targetX = this.mouseX;
      }
      if (Math.abs(this.mouseY - this.lastNode.y) < snapTolerance) {
        this.targetY = this.lastNode.y;
      } else {
        this.targetY = this.mouseY;
      }
    } else {
      this.targetX = this.mouseX;
      this.targetY = this.mouseY;
    }

    this.view.draw();
  }

  /** */
  function mousedown() {
    this.mouseDown = true;
    this.mouseMoved = false;
    this.lastX = this.rawMouseX;
    this.lastY = this.rawMouseY;

    // delete
    if (this.mode == floorConfig.floorplannerModes.DELETE) {
      if (this.activeCorner) {
        this.activeCorner.removeAll();
      } else if (this.activeWall) {
        this.activeWall.remove();
      } else {
        this.setMode(floorConfig.floorplannerModes.MOVE);
      }
    }
  }

  /** */
  function mousemove(event) {
    this.mouseMoved = true;

    // update mouse
    this.rawMouseX = event.clientX;
    this.rawMouseY = event.clientY;

    this.mouseX =
      (event.clientX - this.canvasElement.offset().left) * this.cmPerPixel +
      this.originX * this.cmPerPixel;
    this.mouseY =
      (event.clientY - this.canvasElement.offset().top) * this.cmPerPixel +
      this.originY * this.cmPerPixel;

    // update target (snapped position of actual mouse)
    if (
      this.mode == floorConfig.floorplannerModes.DRAW ||
      (this.mode == floorConfig.floorplannerModes.MOVE && this.mouseDown)
    ) {
      this.updateTarget();
    }

    // update object target
    if (this.mode != floorConfig.floorplannerModes.DRAW && !this.mouseDown) {
      var hoverCorner = this.floorplan.overlappedCorner(
        this.mouseX,
        this.mouseY
      );
      var hoverWall = this.floorplan.overlappedWall(this.mouseX, this.mouseY);
      var draw = false;
      if (hoverCorner != this.activeCorner) {
        this.activeCorner = hoverCorner;
        draw = true;
      }
      // corner takes precendence
      if (this.activeCorner == null) {
        if (hoverWall != this.activeWall) {
          this.activeWall = hoverWall;
          draw = true;
        }
      } else {
        this.activeWall = null;
      }
      if (draw) {
        this.view.draw();
      }
    }

    // panning
    if (this.mouseDown && !this.activeCorner && !this.activeWall) {
      this.originX += this.lastX - this.rawMouseX;
      this.originY += this.lastY - this.rawMouseY;
      this.lastX = this.rawMouseX;
      this.lastY = this.rawMouseY;
      this.view.draw();
    }

    // dragging
    if (this.mode == floorConfig.floorplannerModes.MOVE && this.mouseDown) {
      if (this.activeCorner) {
        this.activeCorner.move(this.mouseX, this.mouseY);
        this.activeCorner.snapToAxis(snapTolerance);
      } else if (this.activeWall) {
        this.activeWall.relativeMove(
          (this.rawMouseX - this.lastX) * this.cmPerPixel,
          (this.rawMouseY - this.lastY) * this.cmPerPixel
        );
        this.activeWall.snapToAxis(snapTolerance);
        this.lastX = this.rawMouseX;
        this.lastY = this.rawMouseY;
      }
      this.view.draw();
    }
  }

  /** */
  function mouseup() {
    this.mouseDown = false;

    // drawing
    if (this.mode == floorConfig.floorplannerModes.DRAW && !this.mouseMoved) {
      var corner = this.floorplan.newCorner(this.targetX, this.targetY);
      if (this.lastNode != null) {
        this.floorplan.newWall(this.lastNode, corner);
      }
      if (corner.mergeWithIntersected() && this.lastNode != null) {
        this.setMode(floorConfig.floorplannerModes.MOVE);
      }
      this.lastNode = corner;
    }
  }

  /** */
  function mouseleave() {
    this.mouseDown = false;
    //scope.setMode(scope.modes.MOVE);
  }

  /** */
  function reset() {
    this.resizeView();
    this.setMode(floorConfig.floorplannerModes.MOVE);
    this.resetOrigin();
    this.view.draw();
  }

  /** */
  function resizeView() {
    // view.handleWindowResize();
  }

  /** */
  function setMode(mode) {
    this.lastNode = null;
    this.mode = mode;
    this.modeResetCallbacks.fire(mode);
    this.updateTarget();
  }

  /** Sets the origin so that floorplan is centered */
  function resetOrigin() {
    var centerX = this.canvasElement.innerWidth() / 2.0;
    var centerY = this.canvasElement.innerHeight() / 2.0;
    var centerFloorplan = this.floorplan.getCenter();
    this.originX = centerFloorplan.x * this.pixelsPerCm - centerX;
    this.originY = centerFloorplan.z * this.pixelsPerCm - centerY;
  }

  /** Convert from THREEjs coords to canvas coords. */
  function convertX(x) {
    return (x - this.originX * this.cmPerPixel) * this.pixelsPerCm;
  }

  /** Convert from THREEjs coords to canvas coords. */
  function convertY(y) {
    return (y - this.originY * this.cmPerPixel) * this.pixelsPerCm;
  }

  return {
    resizeView
  };
};
