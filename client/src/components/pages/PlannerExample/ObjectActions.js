import React from "react";

export default class ObjectActions extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		if (this.props.showing) {
			return (
				<div
					className="object-actions"
					style={{
						top: this.props.position.y,
						left: this.props.position.x
					}}
				>
					<a
						href="#"
						className="fa fa-trash"
						onClick={this.props.removeSelectedObject}
					/>
					<span className="divider"> </span>
					<a
						href="#"
						className="fa fa-info-circle"
						onClick={this.props.openInfo}
					/>
				</div>
			);
		} else {
			return <div />;
		}
	}
}
