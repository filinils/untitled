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
					<button className="square">
						<span className="fa fa-trash" />
					</button>
				</div>
			);
		} else {
			return <div />;
		}
	}
}
