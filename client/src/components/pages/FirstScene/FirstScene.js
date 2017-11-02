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

    time;
    cameras;
    camerasCount;
    activeCameraIndex;

    cameraToTarget;
    rotate;

    constructor(props) {
        super(props);
        this.state = {
            sceneReady:false,
        }

      this.cameras = [];
      this.camerasCount = 3;
      this.activeCameraIndex=0;

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
        this.sun = Helper.createDirectionalLight(this.scene);
        this.scene.add( new THREE.GridHelper( 1000, 10 ) );
        this.plane = Helper.createPlane(this.scene);
        this.cube = Helper.createCube(this.scene);

        this.tControl.attach(this.cube);
        this.scene.add(this.tControl);

        this.cameras = this.createCameras(this.camerasCount);
        this.rotate = false;

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

                case 32: //space
                  this.changeCamera();
                  break;
              case 96:
                this.toggleRotating(this.cube);
                break;
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
        this.time = 0;

        this.setState({sceneReady:true,root:this.scene});
    }

    createCameras(count){
      let cameras = [];
      for(let i=0; i<count;i++){
        let camera = Helper.createCamera(this.scene,{aspectRatio:SCENE_WIDTH/SCENE_HEIGHT});
        camera.zoom = (Math.random()*4);
        camera.position.x = Math.random()*10;
        camera.position.z = Math.random()*10;
        camera.position.y = Math.random()*7;
        cameras.push(camera);
      }
      return cameras;
    }

    changeCamera(){
      console.log('change camera');
      this.activeCameraIndex +=1;
      if(this.activeCameraIndex>=this.cameras.length)
        this.activeCameraIndex=0;
      let activeCamera = this.cameras[this.activeCameraIndex];
      activeCamera.lookAt(this.cube.position);
    }

    toggleRotating(target){
      this.rotate = !this.rotate;
      let camera = this.cameras[this.activeCameraIndex];
      this.cameraToTarget = camera.position.distanceTo(target.position);
    }

    rotateCamera(){
      let r = this.time;
      let camera = this.cameras[this.activeCameraIndex];
      camera.position.x = this.cameraToTarget *Math.cos( 2 * r );
      camera.position.z = this.cameraToTarget *Math.sin( 2 * r );
    }

    updateCamera(){
      if(this.rotate)
        this.rotateCamera();
      this.cameras[this.activeCameraIndex].lookAt(this.cube.position);

    }

    updateCube(){
      this.cube.position.y = 0.5*Math.sin(2*this.time) +1;
    }

    animate(){
        if(!this.renderer)return;

        this.time += 0.02;
        this.updateCube();
        this.tControl.update();
        this.updateCamera();

        this.renderer.clear();
        this.renderer.setViewport( 0,0, SCENE_WIDTH, SCENE_HEIGHT );
        this.renderer.render(this.scene,this.cameras[this.activeCameraIndex]);

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
