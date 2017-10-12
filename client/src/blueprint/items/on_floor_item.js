import FloorItem from "./floor_item";

export default (
  model,
  metadata,
  geometry,
  material,
  position,
  rotation,
  scale
) => {
  let service = new FloorItem(
    model,
    metadata,
    geometry,
    material,
    position,
    rotation,
    scale
  );

  service.obstructFloorMoves = false;
  service.receiveShadow = true;

  return service;
};
