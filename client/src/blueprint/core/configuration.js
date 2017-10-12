// GENERAL:

import * as Dimensioning from "./dimensioning";

/** The dimensioning unit for 2D floorplan measurements. */
export const configDimUnit = "dimUnit";

// WALL:

/** The initial wall height in cm. */
export const configWallHeight = "wallHeight";

/** The initial wall thickness in cm. */
export const configWallThickness = "wallThickness";

/** Global configuration to customize the whole system.  */
export default (() => {
  /** Configuration data loaded from/stored to extern. */
  const data = {
    dimUnit: Dimensioning.dimInch,

    wallHeight: 250,
    wallThickness: 10
  };

  /** Set a configuration parameter. */
  function setValue(key, value) {
    this.data[key] = value;
  }

  /** Get a string configuration parameter. */
  function getStringValue(key) {
    switch (key) {
      case configDimUnit:
        return this.data[key];
      default:
        throw new Error("Invalid string configuration parameter: " + key);
    }
  }

  /** Get a numeric configuration parameter. */
  function getNumericValue(key) {
    switch (key) {
      case configWallHeight:
      case configWallThickness:
        return data[key];
      default:
        throw new Error("Invalid numeric configuration parameter: " + key);
    }
  }
  return {

    getNumericValue,
    getStringValue,
    


  }
})();
