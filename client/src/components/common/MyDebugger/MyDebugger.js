/**
 * Created by msaeed on 2017-10-07.
 */
import React, {Component} from 'react'
import Inspector from "./Inspector/Inspector";
import Hierarchy from "./Hierarchy/Hierarchy";
import './MyDebugger.css'


export default class MyDebugger extends Component {
    constructor(props) {
        super(props);
        this.state = {
            root:this.props.root,
            activeObject:null
        }

    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.root !== this.state.root){
            this.setState({root:nextProps.root,activeObject:nextProps.root});
        }
    }


    setActiveDisplayObject(object){
        this.setState({activeObject:object});
    }

    resetActiveObject(){
        this.setActiveDisplayObject(this.props.root);
    }

    renderHierarchy(){
        return (
            <div className=" Flex-2 Flex-Container-col">
                <h3>Hierarchy</h3>
                <Hierarchy root={this.state.root}
                           activeObject={this.state.activeObject}
                           onItemSelected={this.setActiveDisplayObject.bind(this)}/>
            </div>
        )
    }

    renderAddObjectSection(){
        return (
            <div className="Flex-1 Flex-Container-col">
                <h3>Add Objects</h3>
                <div className="AddingContainer D_Widget"/>
            </div>
        );
    }

    renderInspector(){
        let targetObject = this.state.activeObject;
        return (
            <div className="Flex-3 Flex-Container-col" >
                <h3>Inspector</h3>
                <Inspector item={targetObject}
                           onRequestReset={this.resetActiveObject.bind(this)}/>
                <br/>
            </div>
        );
    }


    render() {
        if(!this.props.enabled) return null;
        return (
            <div className="MyDebugger">
                <div className="PanelContainer left ">
                    {this.renderInspector()}
                </div>

                <div className="PanelContainer right">
                    {this.renderHierarchy()}
                    {this.renderAddObjectSection()}
                </div>
            </div>
        );
    }
}
