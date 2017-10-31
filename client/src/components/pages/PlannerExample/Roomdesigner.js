import React from "react";
import ObjectActions from "./ObjectActions";

export default class Roomdesigner extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			showAddItemBar: false,
			showObjectActions: false,
			objectActionsPosition: { x: 0, y: 0 }
		};
	}

	addItemClick(e) {
		e.stopPropagation();
	}

	viewerClick(e) {
		if (this.props.controller.getSelectedObject()) {
			if (this.state.showObjectActions) return;
			this.setState({
				showObjectActions: true,
				objectActionsPosition: { x: e.screenX, y: e.screenY - 200 }
			});
		} else {
			this.setState({ showObjectActions: false });
		}
	}

	closeAddItemBar() {
		this.setState({ showAddItemBar: false });
	}

	render() {
		const showAddItemBar =
			"add-item-bar" + (this.state.showAddItemBar ? "" : " hidden");

		return (
			<div
				id="viewer"
				onClick={e => this.viewerClick(e)}
				className={this.props.showing}
			>
				<ObjectActions
					showing={this.state.showObjectActions}
					position={this.state.objectActionsPosition}
				/>
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
						<button onClick={this.addItemClick}>
							<span className="fa fa-plus" /> Add item
						</button>
					</div>
				</div>
				<div className={showAddItemBar}>
					<a
						onClick={this.closeAddItemBar}
						className="close"
						href="#"
					>
						<span className="fa fa-close" />
					</a>
				</div>
			</div>
		);
	}
}
