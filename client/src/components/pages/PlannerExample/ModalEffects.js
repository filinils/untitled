export default function(blueprint3d) {
  var scope = this;
  var itemsLoading = 0;

  this.setActiveItem = function(active) {
    let itemSelected = active;
    update();
  };

  function update() {
    //TODO: Loading based o react- window.requestAnimationFrame?
    // if (itemsLoading > 0) {
    //   $("#loading-modal").show();
    // } else {
    //   $("#loading-modal").hide();
    // }
  }

  function init() {
    //TODO: Eventhandling
    // blueprint3d.model.scene.itemLoadingCallbacks.add(function() {
    //   itemsLoading += 1;
    //   update();
    // });

    // blueprint3d.model.scene.itemLoadedCallbacks.add(function() {
    //   itemsLoading -= 1;
    //   update();
    // });

    update();
  }

  init();
}
