/**
 * Created by msaeed on 2017-10-07.
 */
import React, {Component} from 'react'
import './HierarchyItem.css'
import Collapsible from "react-collapsible";
import * as _ from 'lodash'

export default class HierarchyItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open:false
        }
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
    }

    toggle(){
        this.setState({open:!this.state.open});
    }

    onItemSelected(){
        this.props.onItemSelected(this.props.item)
    }

    render() {
        let item = this.props.item;
        let activeUUID = (this.props.activeObject)?this.props.activeObject.uuid:0;
        let marker=(item.children.length)?'chevron_right':'';
        let rotateClass = (this.state.open)?'rotate':'';

        const active =(item.uuid === activeUUID)?'active':'';
        const triggerName = (item.name.length)?item.name:item.constructor.name;
        const disabled = (!item.visible)?'disabled':'';
        return (
           <div className={`HierarchyItem`}>
               <a className="markerContainer"
                   onClick={this.toggle.bind(this)}>
                 <i className={`material-icons ${rotateClass}`}>{marker}</i>
               </a>
               <Collapsible open={this.state.open}
                            transitionTime ={100}
                            trigger={_.startCase(triggerName)}
                            className={`listItem`}
                            openedClassName={`listItem opened`}
                            triggerClassName={`${active} ${disabled}`}
                            triggerOpenedClassName={`${active} ${disabled}`}
                            handleTriggerClick={this.onItemSelected.bind(this)}>
                   {this.props.children}
               </Collapsible>
           </div>
        );
    }
}
