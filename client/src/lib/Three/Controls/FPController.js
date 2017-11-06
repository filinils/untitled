/**
 * Created by msaeed on 2017-11-06.
 */
import PointerLockControl from './PointerLockControls';
import * as THREE from "three";

export default class FPController {

  camera;
  controls;
  scene;
  renderer;

  moveForward;
  moveLeft;
  moveBackward;
  moveRight;
  canJump;
  velocity;
  direction;
  raycaster;
  enabled;
  objects;
  prevTime;

  floorplan;

  constructor(renderer,scene,floorplan) {
    this.scene = scene;
    this.renderer = renderer;
    this.floorplan = floorplan;
    this.camera = new THREE.PerspectiveCamera(75, 1.4, 1, 1000);
    this.controls = new PointerLockControl(this.camera);
    this.scene.add(this.controls.getObject());

    this.moveForward=false;
    this.moveLeft=false;
    this.moveBackward=false;
    this.moveRight=false;
    this.canJump=false;
    this.enabled=false;
    this.objects=[];

    this.velocity = new THREE.Vector3();
    this.direction= new THREE.Vector3();
    this.raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 100 );
    this.prevTime = Date.now();
    document.addEventListener('keydown', this.onKeyDown.bind(this), false);
    document.addEventListener('keyup', this.onKeyUp.bind(this), false);
  }

  keepInBounds(){
    let target = this.controls.getObject();
    let corners = this.floorplan.corners;
    target.position.x=THREE.Math.clamp(target.position.x , 1.15*corners[0].x,0.95*corners[1].x);
    target.position.z=THREE.Math.clamp(target.position.z , 1.15*corners[2].y,0.95*corners[1].y);
  }


  onKeyDown(event) {

    switch (event.keyCode) {

      case 38: // up
      case 87: // w
        this.moveForward = true;
        break;

      case 37: // left
      case 65: // a
        this.moveLeft = true;
        break;

      case 40: // down
      case 83: // s
        this.moveBackward = true;
        break;

      case 39: // right
      case 68: // d
        this.moveRight = true;
        break;

      // case 32: // space
      //   if (this.canJump === true) this.velocity.y += 350;
      //   this.canJump = false;
      //   break;

    }

  };

  onKeyUp(event) {

    switch (event.keyCode) {

      case 38: // up
      case 87: // w
        this.moveForward = false;
        break;

      case 37: // left
      case 65: // a
        this.moveLeft = false;
        break;

      case 40: // down
      case 83: // s
        this.moveBackward = false;
        break;

      case 39: // right
      case 68: // d
        this.moveRight = false;
        break;

    }


  }

  setEnable(value){
    this.enabled = value;
    this.controls.enabled=value;

    if(value){
      let element = document.body;
      element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
      element.requestPointerLock();
    }else{
      document.exitPointerLock();
    }
  }

  render() {
    if (this.enabled === true) {

      this.raycaster.ray.origin.copy(this.controls.getObject().position);
      this.raycaster.ray.origin.y -= 100;

      let intersections = this.raycaster.intersectObjects(this.objects);

      let onObject = intersections.length > 0;

      let time = Date.now();
      let delta = ( time - this.prevTime ) / 1000;

      // this.velocity.x -= this.velocity.x * 10.0 * delta;
      // this.velocity.z -= this.velocity.z * 10.0 * delta;


      this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
      this.direction.x = Number(this.moveLeft) - Number(this.moveRight);
      this.direction.normalize(); // this ensures consistent movements in all directions
      if(this.direction.length()){
        this.velocity = this.direction.multiplyScalar(-400 * delta);
        this.velocity.y -= 9.8 * 200.0 * delta; // 100.0 = mass
      }

      if (onObject === true) {

        this.velocity.y = Math.max(0, this.velocity.y);
        this.canJump = true;

      }

      this.controls.getObject().translateX(this.velocity.x );
      this.controls.getObject().translateY(this.velocity.y );
      this.controls.getObject().translateZ(this.velocity.z );

      this.keepInBounds();

      if (this.controls.getObject().position.y < 100) {

        this.velocity.y = 0;
        this.controls.getObject().position.y = 100;

        this.canJump = true;

      }
      this.prevTime = time;
      this.renderer.clear();
      this.renderer.render(this.scene, this.camera);
      this.renderer.clearDepth();
    }
  }
}
