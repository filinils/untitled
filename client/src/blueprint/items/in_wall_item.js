import WallItem from "./wall_item";

/** */

export default (
  model,
  metadata,
  geometry,
  material,
  position,
  rotation,
  scale
) => {
  let service = new WallItem(
    model,
    metadata,
    geometry,
    material,
    position,
    rotation,
    scale
  );

  service.prototype.getWallOffset = () => {
    // fudge factor so it saves to the right wall
    return -this.currentWallEdge.offset + 0.5;
  };

  return service;
};
