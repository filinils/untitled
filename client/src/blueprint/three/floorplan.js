import Floor from "./floor";
import Edge from "./edge";

export default function(scene, floorplan, controls) {
	var scope = this;

	this.scene = scene;
	this.floorplan = floorplan;
	this.controls = controls;

	this.floors = [];
	this.edges = [];

	floorplan.fireOnUpdatedRooms(redraw);

	function redraw() {
		// clear scene
		scope.floors.forEach(floor => {
			floor.removeFromScene();
		});

		scope.edges.forEach(edge => {
			edge.remove();
		});
		scope.floors = [];
		scope.edges = [];

		// draw floors
		scope.floorplan.getRooms().forEach(room => {
			var threeFloor = new Floor(scene, room);
			scope.floors.push(threeFloor);
			threeFloor.addToScene();
		});

		// draw edges
		scope.floorplan.wallEdges().forEach(edge => {
			var threeEdge = new Edge(scene, edge, scope.controls);
			scope.edges.push(threeEdge);
		});
	}

	this.updateEdges = function () {
    scope.edges.forEach(edge=>{
      edge.updateVisibility();
    });
  }

  return{
    updateEdges:this.updateEdges
  }


}
