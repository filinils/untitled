import React from "react";

export default class Roomdesigner extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showAddItemBar: false
    };
  }

  onAddItemClick() {
    return;
  }

  render() {
    const showAddItemBar =
      "add-item-bar" + (this.state.showAddItemBar ? "" : " hidden");

    return (
      <div id="viewer" className={this.props.showing}>
        <div className="top-bar">
          <div className="left">
            <button onClick={() => this.props.plannerMode("2d")}>
              Edit floorplan
            </button>
          </div>
          <div className="right">
            <button className="square fa fa-rotate-left" />
            <button className="square fa fa-rotate-right" />
          </div>
        </div>
        <div className="bottom-bar">
          <div className="left">
            <button onClick={() => this.onAddItemClick()}>
              <span className="fa fa-plus" /> Add item
            </button>
          </div>
        </div>
        <div className={showAddItemBar}>
          <a onClick={() => this.onAddItemClick()} className="close" href="#">
            <span className="fa fa-close" />
          </a>
        </div>
      </div>
    );
  }
}
