import React from "react";

export default class Roomplanner extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div id="floorplanner" className={this.props.showing}>
        <canvas id="floorplanner-canvas" />
        <div className="bottom-bar">
          <div className="right">
            <button
              className="primary"
              onClick={() => this.props.plannerMode("3d")}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }
}
