import React from "react";

export default class ObjectActions extends React.Component {
    constructor(props) {
		super(props);
		
        this.state = {
            brightness: this.props.optionalProps.brightness || 0
		};
		this.handleChange = this.handleChange.bind(this);
    }
	
    handleChange(event) {
        this.setState({ brightness: event.target.value });
        this.props.optionalProps.adjustLight(event.target.value);
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
                    {this.props.optionalProps.adjustLight && (
                        <input
                            type="range"
                            min="0.01"
                            max="1"
                            value={this.state.brightness}
                            step="0.01"
                            onChange={this.handleChange}
                        />
                    )}
                    {this.props.optionalProps.toggleLight && (
                        <a
                            href="#"
                            className="fa fa-lightbulb-o"
                            onClick={this.props.optionalProps.toggleLight}
                        />
                    )}
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
