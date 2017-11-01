/**
 * Created by msaeed on 2017-10-04.
 */
import React, {Component} from 'react'
import "./Vector3Widget.css"

export default class Vector3Widget extends Component {

    constructor(props){
        super(props);
        this.state = {
            values:this._toVectorFormat(this.props.values)
        };
    }

    componentDidMount(){

    }

    componentWillReceiveProps(nextProps){
        this.setState({values:this._toVectorFormat(nextProps.values)});
    }

    _toVectorFormat(values) {
       return (values.hasOwnProperty('_x') ) ? {x: values._x, y: values._y, z: values._z} : values;
    }


    onValueChanged(evt, axis){
      console.log('changed',evt)
      evt.stopPropagation();
      let value = evt.target.value;
        let retVector = Object.assign({},this.state.values);
        retVector[axis] = value;
        this.props.onValueChanged(retVector);
    }

    render() {
        return (
            <div className="Widget D_Widget" key={this.props.uuid}>
              <div className="Flex-1">
                <h4>{this.props.title}</h4>
              </div>
                <div className="inputsContainer">
                    <div className = "controlItem">
                        <span>x</span>
                        <input className="D_Widget"  type="number" value={this.state.values.x} step={0.1}  onChange={(evt)=>this.onValueChanged(evt,'x')}/>
                    </div>
                    <div  className = "controlItem">
                        <span>y</span>
                        <input className="D_Widget"   type="number" value={this.state.values.y} step={0.1}  onChange={(evt)=>this.onValueChanged(evt,'y')}/>
                    </div>
                    <div className = "controlItem">
                        <span>z</span>
                        <input className="D_Widget"  type="number" value={this.state.values.z}  step={0.1}  onChange={(evt)=>this.onValueChanged(evt.target.value,'z')}/>
                    </div>
                </div>
            </div>
        );
    }
}
