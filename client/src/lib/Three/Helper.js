/**
 * Created by msaeed on 2017-10-05.
 */
import * as THREE from 'three'
import * as _ from 'lodash';


export default class Helper {

    static createCamera(parent,options=null){
        const aspectRatio = options.aspectRatio || 1;
        let camera = new THREE.PerspectiveCamera(75,aspectRatio,0.1,100);
        camera.position.set(0,3,10);
        camera.rotation.z=THREE.Math.degToRad(0);
        parent.add(camera);
        //parent.add( new THREE.CameraHelper(camera));
        return camera;
    }

    static createPlane(parent){
        let geometry = new THREE.PlaneGeometry(10,10,32,32);
        let material = new THREE.MeshLambertMaterial({color:0xffffff, side:THREE.DoubleSide});
        let mesh = new THREE.Mesh(geometry,material);
        mesh.position.set(0,0,0);
        mesh.rotation.x = THREE.Math.degToRad(90);
        parent.add(mesh);
        return mesh;
    }

    static createDirectionalLight(parent){
        let light = new THREE.DirectionalLight({color:0xFFFFFF,intensity:1.3});
        light.position.set(0,5,0);
        light.rotation.z = THREE.Math.degToRad(30);
        parent.add(light);
        parent.add(new THREE.DirectionalLightHelper(light));
        return light;
    }

    static createSpotLight(parent){
        let light = new THREE.SpotLight({color:0xFFFFFF});
        parent.add(light);
        parent.add(new THREE.SpotLightHelper(light));
        return light;
    }

    static createCube(parent) {
        let geometry = new THREE.CubeGeometry(1, 1, 1);
        let material = new THREE.MeshLambertMaterial({color: 0xffffff});
        let cube = new THREE.Mesh(geometry, material);
        cube.name = "cube";
        cube.position.set(0,0.5,0);
        parent.add(cube);
        return cube;
    }

    static changeObjectRotation(target,value){
        let d2r = THREE.Math.degToRad;
        target.rotation.set(value.x,value.y,value.z);
    }

    static changeObjectPosition(target,value){
        target.position.set(value.x,value.y,value.z);
    }

    static changeObjectScale(target,value){
        target.scale.set(value.x,value.y,value.z);
    }

    static setObjectKeyValue(target,key,value){
        if(!target.hasOwnProperty(key) || typeof target[key]==='object') return;
        if(typeof target[key]!==typeof value) return;

        target[key]= value;
    }

   static deleteObject(target){
        let parent = target.parent;
        if(parent)
            parent.remove(target);
   }

    static getChildByUUID(parent,uuid){
        if(!parent || !uuid) return null;
        return _.find(parent.children,item=>item.uuid === uuid);
    }
}
