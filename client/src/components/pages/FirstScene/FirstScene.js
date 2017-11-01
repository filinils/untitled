/**
 * Created by msaeed on 2017-09-01.
 */
import React, {Component} from 'react'
import * as THREE from 'three'
import './FirstScene.css';
import Helper from "../../../lib/Three/Helper";
import MyDebugger from "../../common/MyDebugger/MyDebugger";
 import * as  OrbitControls from '../../../lib/Three/Controls/OrbitControls';
 import * as  TransformControls from '../../../lib/Three/Controls/TransformControls';

const SCENE_WIDTH = window.innerWidth;
const SCENE_HEIGHT = window.innerHeight;

export default class FirstScene extends Component {

    deltaTime;

    constructor(props) {
        super(props);
        this.state = {
            sceneReady:false,
        }

        this.animate = this.animate.bind(this);
    }

    componentDidMount() {
       this.initStage();
        this.animate();
    }

    componentWillUnmount(){
      //this.scene.removeAll();
      this.renderer = null;
    }

    initStage(){

        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor(0x2727272);
        this.renderer.setSize(SCENE_WIDTH,SCENE_HEIGHT);
        this.refs.threeDom.appendChild(this.renderer.domElement);
        this.camera = Helper.createCamera(this.scene,{aspectRatio:SCENE_WIDTH/SCENE_HEIGHT});
        this.control = new (OrbitControls(THREE))(this.camera);


        this.tControl = new (TransformControls(THREE))( this.camera, this.renderer.domElement );

        this.mainLight = Helper.createDirectionalLight(this.scene);
        this.spotLight1 = Helper.createSpotLight(this.scene);
        this.spotLight1.position.set(2,7,2);
        this.scene.add( new THREE.GridHelper( 1000, 10 ) );
        this.plane = Helper.createPlane(this.scene);
        this.cube = Helper.createCube(this.scene);

        this.tControl.attach(this.cube);
        this.scene.add(this.tControl);

        window.addEventListener( 'keydown', ( event ) =>{
            if(!this.tControl)return;
            switch ( event.keyCode ) {

                case 81: // Q
                    this.tControl.setSpace( this.tControl.space === "local" ? "world" : "local" );
                    break;

                case 17: // Ctrl
                    this.tControl.setTranslationSnap( 100 );
                    this.tControl.setRotationSnap( THREE.Math.degToRad( 15 ) );
                    break;

                case 87: // W
                    this.tControl.setMode( "translate" );
                    break;

                case 69: // E
                    this.tControl.setMode( "rotate" );
                    break;

                case 82: // R
                    this.tControl.setMode( "scale" );
                    break;

                case 187:
                case 107: // +, =, num+
                    this.tControl.setSize(  this.tControl.size + 0.1 );
                    break;

                case 189:
                case 109: // -, _, num-
                    this.tControl.setSize( Math.max(  this.tControl.size - 0.1, 0.1 ) );
                    break;

            }

        });

        window.addEventListener( 'keyup', function ( event ) {

            switch ( event.keyCode ) {

                case 17: // Ctrl
                    this.tControl.setTranslationSnap( null );
                    this.tControl.setRotationSnap( null );
                    break;

            }

        });
        this.deltaTime = 0;

        this.setState({sceneReady:true,root:this.scene});
    }


    animate(){
        this.deltaTime += 0.02;
        this.cube.position.y = 0.5*Math.sin(2*this.deltaTime) +1;
        //this.plane.rotation.y = this.deltaTime;
        this.tControl.update();

        if(!this.renderer)return;

        this.renderer.render(this.scene,this.camera);
        this.forceUpdate();
        requestAnimationFrame(this.animate);
    }

    render() {
        return (
            <div  className="FirstScene">
              <div ref={'threeDom'}/>
                <MyDebugger root={this.scene}
                            enabled={this.state.sceneReady}/>
            </div>

        );
    }
}
