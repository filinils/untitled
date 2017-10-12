import InWallItem from "./in_wall_item";

export default (
  model,
  metadata,
  geometry,
  material,
  position,
  rotation,
  scale
) => {
  let service = new InWallItem(
    model,
    metadata,
    geometry,
    material,
    position,
    rotation,
    scale
  );

  service.boundToFloor = true;

  return service;
};
