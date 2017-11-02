import React from "react";

export default class AddItemBar extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const showAddItemBar =
			"add-item-bar" + (this.props.showing ? "" : " hidden");

		return (
			<div className={showAddItemBar}>
				<a onClick={this.props.close} className="close" href="#">
					<span className="fa fa-close" />
				</a>
				<ul>
					<li>Item1</li>
					<li>Item2</li>
				</ul>
			</div>
		);
	}
}
