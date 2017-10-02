
import * as d3 from 'd3';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';
import * as skillActions from '../../../actions/skillActions';



class SkillViewer extends React.Component {

    constructor(props) {
        super(props);
        this.svg = {};
        this.init = this.init.bind(this);
        this.zoomTo = this.zoomTo.bind(this);
        this.zoom = this.zoom.bind(this);







    }

    componentDidMount() {
        this.init();
    }

    init() {
        this.svg = d3.select("svg");
        
        this.margin = 20;
        this.diameter = +this.refs.svgParent.offsetHeight;
        this.g = this.svg.append("g").attr("transform", "translate(" + this.diameter / 2 + "," + this.diameter / 2 + ")");
        this.color = d3.scaleLinear()
            .domain([-1, 5])
            .range(["hsl(179,100%,100%)", "hsl(3,96%,65%)"])
            .interpolate(d3.interpolateHcl);

        this.pack = d3.pack()
            .size([this.diameter - this.margin, this.diameter - this.margin])
            .padding(2);

        let self = this;

        d3.json("http://localhost:3000/api/example", function (error, root) {
            if (error) throw error;

            root = d3.hierarchy(root)
                .sum(function (d) { return d.size; })
                .sort(function (a, b) { return b.value - a.value; });


            self.focus = root;
            self.nodes = self.pack(root).descendants();
            self.view;


            self.circle = self.g.selectAll("circle")
                .data(self.nodes)
                .enter().append("circle")
                .attr("class", function (d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
                .style("fill", function (d) { return d.children ? self.color(d.depth) : null; })
                .on("click", function (d) { if (focus !== d) self.zoom(d), d3.event.stopPropagation(); });

            self.text = self.g.selectAll("text")
                .data(self.nodes)
                .enter().append("text")
                .attr("class", "label")
                .style("fill-opacity", function (d) { return d.parent === root ? 1 : 0; })
                .style("display", function (d) { return d.parent === root ? "inline" : "none"; })
                .text(function (d) { return d.data.name; });

            self.node = self.g.selectAll("circle,text");

            self.svg
                .style("background", self.color(-1))
                .on("click", function () { self.zoom(root); });

            self.zoomTo([root.x, root.y, root.r * 2 + self.margin]);

        }
        );
    }

    zoom(d) {

        let self = this;
        this.focus0 = focus;
        this.focus = d;

        this.transition = d3.transition()
            .duration(d3.event.altKey ? 7500 : 750)
            .tween("zoom", function (d) {
                let i = d3.interpolateZoom(self.view, [self.focus.x, self.focus.y, self.focus.r * 2 + self.margin]);
                return function (t) {
                   
                     self.zoomTo(i(t)); };
            });

        this.transition.selectAll("text")
            .filter(function (d) { return d.parent === self.focus || this.style.display === "inline"; })
            .style("fill-opacity", function (d) { return d.parent === self.focus ? 1 : 0; })
            .on("start", function (d) { if (d.parent === self.focus) this.style.display = "inline"; })
            .on("end", function (d) { if (d.parent !== self.focus) this.style.display = "none"; });
    }

    zoomTo(v) {
        let self = this;
        self.k = self.diameter / v[2];
        self.view = v;
        self.node.attr("transform", function (d) { 
      
            return "translate(" + (d.x - self.view[0]) * self.k + "," + (d.y - self.view[1]) * self.k + ")"; });
            this.circle.attr("r", function (d) { return d.r * self.k; });
    }


    render() {
        return (
           
            <div className="_layout-diagram">
            
            <div ref="svgParent" className="_component-diagram">
                <svg width="100%" height="100%" ></svg>
            </div>
            
            </div>
            
        );
    }
}
SkillViewer.propTypes = {

};
function mapStateToProps(state, ownProps) {
    return {
        skills: state.skills
    };
}


export default connect(mapStateToProps)(SkillViewer);
