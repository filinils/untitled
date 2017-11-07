/**
 * Created by msaeed on 2017-10-07.
 */
import React, {Component} from 'react'
import "./InputWidget.css"
import * as _ from 'lodash'

export default class InputWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value :this.props.value
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState({value:nextProps.value});
    }

    onChange(evt){
        let value;
        switch (this.props.type){
            case 'checkbox':
                value = evt.target.checked;
                break;
            case 'number':
                value = parseFloat(evt.target.value);
                break;
            default:
                value = evt.target.value;
        }
        this.props.onChange(value);
    }

    renderCheckbox(){
        return (
            <input className="Flex-2"
                   type={this.props.type}
                   checked={this.state.value}
                   onChange={this.onChange.bind(this)}/>
        );
    }

    renderNormalInput(){
        return (
            <input className="Flex-2"
                   type={this.props.type}
                   step={0.1}
                   value={this.state.value}
                   onChange={this.onChange.bind(this)}/>
        );
    }

    renderInput(){
        return (this.props.type==='checkbox')?this.renderCheckbox():this.renderNormalInput();
    }

    render() {
        return (
            <div className="InputWidget D_Widget">
                <p className="Flex-1">{_.startCase(this.props.title)}</p>
                <div className="inputContainer">
                    {this.renderInput()}
                </div>

            </div>
        );
    }
}