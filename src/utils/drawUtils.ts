export function getPointsDistance(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

/**
 * Returns an array of points located between the start and end points
 * @param x1 x coordinate of the start point
 * @param y1 y coordinate of the start point
 * @param x2 x coordinate of the end point
 * @param y2 y coordinate of the end point
 * @returns
 */
export function createIntermediatePoints(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number[][] {
  const points = [];
  const aDistance = Math.abs(x2 - x1);
  const bDistance = Math.abs(y2 - y1);
  if (aDistance > bDistance) {
    const leftToRight = x1 < x2;
    for (let i = x1; leftToRight ? i <= x2 : i >= x2; leftToRight ? i++ : i--) {
      const progress = (i - Math.min(x1, x2)) / aDistance;
      let j: number;
      if (leftToRight) {
        j = Math.round((y2 - y1) * progress + y1);
      } else {
        j = Math.round((y1 - y2) * progress + y2);
      }
      points.push([i, j]);
    }
  } else {
    const upToDown = y1 < y2;
    for (
      let j = upToDown ? y1 + 1 : y1 - 1;
      upToDown ? j < y2 : j > y2;
      upToDown ? j++ : j--
    ) {
      const progress = (j - Math.min(y1, y2)) / bDistance;
      let i: number;
      if (upToDown) {
        i = Math.round((x2 - x1) * progress + x1);
      } else {
        i = Math.round((x1 - x2) * progress + x2);
      }
      points.push([i, j]);
    }
  }
  return points;
}
