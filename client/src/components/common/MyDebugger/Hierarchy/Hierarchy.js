/**
 * Created by msaeed on 2017-10-07.
 */
import React, {Component} from 'react'
import './Hierarchy.css'
import * as _ from 'lodash';
import HierarchyItem from "./HierarchyItem/HierarchyItem";


export default class Hierarchy extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    onItemSelected(item){
      console.log('selected',item)
        this.props.onItemSelected(item);
    }

    renderHierarchyItem(parent){
        let children =null;
        let noChildren = !parent.children.length;
        if(!noChildren)
            children = _.map(parent.children,(item,index)=>{
                return this.renderHierarchyItem(item);
            });

        return (
            <HierarchyItem key={parent.uuid}
                           item={parent}
                           activeObject={this.props.activeObject}
                           onItemSelected={this.onItemSelected.bind(this)}
            >
                {children}
            </HierarchyItem>
        );

    }


    render(){
        return (
            <div className="Hierarchy">
                <div className="Hierarchy D_Widget">
                    {this.renderHierarchyItem(this.props.root)}
                </div>
            </div>
        );
    }


}
