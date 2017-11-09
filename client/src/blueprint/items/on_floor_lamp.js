import * as THREE from "three";
import FloorItem from "./floor_item";

export default class OnFloorLamp extends FloorItem {
    constructor(
        model,
        metadata,
        geometry,
        material,
        position,
        rotation,
        scale,
        options
    ) {
        super(
            model,
            metadata,
            geometry,
            material,
            position,
            rotation,
            scale,
            options
        );

        this.toggleable = true;
        this.toggledOn = this.options.toggledOn || true;

        this.dimmable = true;
        this.brightness = 1;

        // Lamp contains a light
        let light = new THREE.PointLight(0xffffff, this.brightness, 400, 2);
        light.castShadow = true;
        this.light = light;

        this.castShadow = false;
        this.receiveShadow = false;

        this.add(light);
    }

    toggleLight() {
        this.toggledOn = !this.toggledOn;

        var hex = this.toggledOn
            ? this.material.emissive.multiplyScalar(this.brightness)
            : 0x000000;
        this.material.needsUpdate = true;

        this.light.intensity = this.toggledOn ? this.brightness : 0;
        this.scene.needsUpdate = true;
    }

    updateBrightness(brightness) {
        this.brightness = brightness;

        this.material.emissive = this.defaultEmissiveness
            .clone()
            .multiplyScalar(this.brightness);
        this.material.needsUpdate = true;

        this.light.intensity = brightness;
        this.scene.needsUpdate = true;
    }

    /* Overrides updateHightlight in item.js */
    updateHighlight() {
        var on = this.hover || this.selected;
        this.highlighted = on;
        if (on) {
            this.material.emissive = this.defaultEmissiveness;
        } else {
            this.material.emissive = this.defaultEmissiveness
                .clone()
                .multiplyScalar(this.brightness);
            this.material.needsUpdate = true;
        }
    }
}
