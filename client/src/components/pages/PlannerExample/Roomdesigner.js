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
		console.log(this.state.selectedObject);
		console.log(this.props.controller.scene.children);
		this.props.controller.removeObjectFromScene(this.state.selectedObject);
		console.log(this.props.controller.scene.children);
		this.setState({ showObjectActions: false });
	}

	showObjectInformation() {
		this.setState({ showObjectInformation: true });
	}

	addItemToScene(article) {
		if (article && article.articleId) {
			this.props.controller.model.addItemByArticleId(article.articleId);
		} else {
			console.log("Cant load item: ", article);
		}
	}

	render() {
		const objectInformation = this.state.showObjectInformation ? (
			<ObjectInformation
				articleId={this.state.selectedObject.metadata.articleId}
				close={() => this.closeObjectInformation()}
			/>
		) : null;

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
					addItemToScene={this.addItemToScene.bind(this)}
				/>
				<ObjectActions
					showing={this.state.showObjectActions}
					position={this.state.objectActionsPosition}
					openInfo={() => this.showObjectInformation()}
					removeSelectedObject={() => this.removeSelectedObject()}
				/>
				{objectInformation}
			</div>
		);
	}
}
