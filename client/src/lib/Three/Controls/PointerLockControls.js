/**
 * @author mrdoob / http://mrdoob.com/
 */
import * as THREE from "three";

const PI_2 = Math.PI / 2;

export default class PointerLockControls  {
  cameraHeight;
  camera;
  enabled;

  yawObject;
  pitchObject;

  constructor(camera){
    this.camera = camera;
    this.init();
  }

  init(){
    this.cameraHeight=20;
    this.camera.rotation.set( 0, 0, 0 );

    this.pitchObject = new THREE.Object3D();
    this.pitchObject.add( this.camera );

    this.yawObject = new THREE.Object3D();
    this.yawObject.position.x = 773;
    this.yawObject.position.y = this.cameraHeight;
    this.yawObject.position.z = -123;
    this.yawObject.add( this.pitchObject );

    this.enabled = false;
    document.addEventListener( 'mousemove', this.onMouseMove.bind(this), false );
    this.getDirection();

  }


  onMouseMove  ( event ) {

    if ( this.enabled === false ) return;

    let movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    let movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

    this.yawObject.rotation.y -= movementX * 0.002;
    this.pitchObject.rotation.x -= movementY * 0.002;

    this.pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, this.pitchObject.rotation.x ) );

  };

  dispose () {

    document.removeEventListener( 'mousemove', this.onMouseMove.bind(this), false );

  };


  getObject () {

    return this.yawObject;

  };

  getDirection () {

    // assumes the camera itself is not rotated

    let direction = new THREE.Vector3( 0, 0, - 1 );
    let rotation = new THREE.Euler( 0, 0, 0, "YXZ" );

    return ( v )=> {

      rotation.set( this.pitchObject.rotation.x, this.yawObject.rotation.y, 0 );

      v.copy( direction ).applyEuler( rotation );

      return v;

    };

  };

};
