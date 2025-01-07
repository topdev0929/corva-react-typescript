export function getBHASchematic(components, isDrillout = false) {
  const schematic = [];

  components.forEach(component => {
    const { family, material, stabilizer } = component;
    if (['bit', 'pdm', 'rss', 'stabilizer', 'ur'].includes(family)) {
      schematic.push({
        family,
        hasStabilizer: !!stabilizer,
        bitType: component.bit_type,
      });
    } else if (
      (isDrillout && ['dp', 'sub'].includes(family)) ||
      (material === 'Non Magnetic' &&
        (schematic.length === 0 || schematic.slice(-1)[0].material !== material))
    ) {
      schematic.push({
        family: 'other',
        material,
      });
    }
  });

  return schematic;
}
