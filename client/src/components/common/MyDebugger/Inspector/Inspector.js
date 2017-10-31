/**
 * Created by msaeed on 2017-10-07.
 */
import React, {Component} from 'react'
import "./Inspector.css"
import Vector3Widget from "../Widgets/Vector3Widget/Vector3Widget";
import Helper from "../Helper";
import * as _ from 'lodash'
import InputWidget from "../Widgets/InputWidget/InputWidget";
import ConfirmWidget from "../Widgets/ConfirmWidget/ConfirmWidget";

export default class Inspector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deleteConfirmPopupVisibility:false
        }
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
    }

    checkType(type){
        switch (type){
            case 'string':
                return 'text';
            case 'boolean':
                return 'checkbox';
            case 'number':
                return 'number';
            default:
                return false;
        }
    }

    changeValue(key,value){
        let item = this.props.item;
        Helper.setObjectKeyValue(item,key,value);
    }

    onDeleteConfirm(value){
        if(value===true)
            this.deleteObject(this.props.item);
        this.setState({deleteConfirmPopupVisibility:false})

    }

    deleteObject(target){
        Helper.deleteObject(target);
        this.props.onRequestReset();
    }

    renderProperties(){
        let item = this.props.item;
        let keys = Object.keys(item);
        return _.map(keys,(mKey,index)=>{
            let type = this.checkType(typeof item[mKey]);
            if(type){
                return <InputWidget
                    key={index}
                    value={item[mKey]}
                    title={mKey}
                    type={type}
                    onChange={(value)=>this.changeValue(mKey,value)}/>
            }

        });
    }

    render() {
        let targetObject = this.props.item;
        if(!targetObject) return null;
        return (
            <div className="Inspector">

                <h5>{`Constructor <${targetObject.constructor.name}>`} </h5>
                <Vector3Widget
                    values={targetObject.position}
                    title="Position"
                    onValueChanged ={(retVector)=>Helper.changeObjectPosition(targetObject,retVector)}/>

                <Vector3Widget
                    values={targetObject.rotation}
                    title="Rotation"
                    onValueChanged ={(retVector)=>Helper.changeObjectRotation(targetObject,retVector)}/>
                <Vector3Widget
                    values={targetObject.scale}
                    title="Scale"
                    onValueChanged ={(retVector)=>Helper.changeObjectScale(targetObject,retVector)}/>

                <div className="D_Widget">
                    <ConfirmWidget  message="Arr you sure??"
                                    visible={this.state.deleteConfirmPopupVisibility}
                                    answer={this.onDeleteConfirm.bind(this)}/>
                    <button className="btn btn-danger btn-block"
                            onClick={()=>this.setState({deleteConfirmPopupVisibility:true})}>
                        Delete
                    </button>
                </div>

                {this.renderProperties()}
            </div>
        );
    }
}
