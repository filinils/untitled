import callbacks from "../../../utils/callbacks";

export default function(blueprint3d) {
	var scope = this;
	var itemsLoading = 0;
	let itemLoadingCallbacks = new callbacks();

	this.setActiveItem = function(active) {
		let itemSelected = active;
		update();
	};

	function update() {
		//TODO: Loading based o react- window.requestAnimationFrame?
		if (itemsLoading > 0) {
			// $("#loading-modal").show();
			// document.getElementById("loading-modal").style.display = true;
		} else {
			// $("#loading-modal").hide();
			// document.getElementById("loading-modal").style.display = false;
		}
	}

	function init() {
		blueprint3d.model.scene.itemLoadingCallbacks.add(function() {
			itemsLoading += 1;
			update();
		});

		blueprint3d.model.scene.itemLoadedCallbacks.add(function() {
			itemsLoading -= 1;
			update();
		});

		update();
	}

	init();
}
