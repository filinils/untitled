import WallItem from "./wall_item";

/** */
export default ((
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

  service.boundToFloor = true;

  return service;
})();
