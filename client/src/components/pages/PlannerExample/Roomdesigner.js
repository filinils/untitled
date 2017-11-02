import React from "react";
import ObjectActions from "./ObjectActions";
import AddItemBar from "./AddItemBar";
import ObjectInformation from "./ObjectInformation";

export default class Roomdesigner extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			showAddItemBar: false,
			showObjectActions: false,
			showObjectInformation: false,
			objectActionsPosition: { x: 0, y: 0 },
			selectedObject: null
		};
	}

	addItemClick(e) {
		e.stopPropagation();
		this.setState({ showAddItemBar: true });
	}

	viewerClick(e) {
		const selectedObject = this.props.controller.getSelectedObject();
		if (selectedObject) {
			if (this.state.selectedObject === selectedObject) return;

			this.setState({
				showObjectActions: true,
				selectedObject,
				objectActionsPosition: { x: e.screenX, y: e.screenY - 200 }
			});
		} else {
			this.setState({ showObjectActions: false, selectedObject: false });
		}
	}

	closeItemBar() {
		this.setState({ showAddItemBar: false });
	}

	closeObjectInformation() {
		this.setState({ showObjectInformation: false });
	}

	removeSelectedObject() {
		this.props.controller.scene.remove(this.state.selectedObject);
		this.setState({ showObjectActions: false });
	}

	showObjectInformation() {
		this.setState({ showObjectInformation: true });
	}

	render() {
		return (
			<div>
				<div
					id="viewer"
					onClick={e => this.viewerClick(e)}
					className={this.props.showing}
				>
					<div className="top-bar">
						<div className="left">
							<button
								onClick={() => this.props.plannerMode("2d")}
							>
								Edit floorplan
							</button>
              <button
                className="primary"
                onClick={this.props.onSaveClick}
              >
                save scene
              </button>
						</div>
						<div className="right">
							<button className="square fa fa-rotate-left" />
							<button className="square fa fa-rotate-right" />
						</div>
					</div>
					<div className="bottom-bar">
						<div className="left">
							<button onClick={e => this.addItemClick(e)}>
								<span className="fa fa-plus" /> Add item
							</button>
						</div>
					</div>
				</div>
				<AddItemBar
					showing={this.state.showAddItemBar}
					close={() => this.closeItemBar()}
				/>
				<ObjectActions
					showing={this.state.showObjectActions}
					position={this.state.objectActionsPosition}
					openInfo={() => this.showObjectInformation()}
					removeSelectedObject={() => this.removeSelectedObject()}
				/>
				<ObjectInformation
					showing={this.state.showObjectInformation}
					articleId={29023402}
					close={() => this.closeObjectInformation()}
				/>
			</div>
		);
	}
}
