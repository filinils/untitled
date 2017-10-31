/**
 * Created by msaeed on 2017-10-07.
 */
import React, {Component} from 'react'
import "./ConfirmWidget.css"


export default class ConfirmWidget extends Component {

    render() {
        if(!this.props.visible) return null;
        return (
            <div className="ConfirmWidget D_Widget">
                <div className="Flex-1">
                    <p>{this.props.message}</p>
                </div>
                <div className="Flex-1">
                    <button className=" btn btn-danger" onClick={()=>this.props.answer(true)}>Yes</button>
                    <button className=" btn btn-default" onClick={()=>this.props.answer(false)}>Cancel</button>
                </div>
            </div>
        );
    }
}




