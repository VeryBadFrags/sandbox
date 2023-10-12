export function getDistance(a1: number, b1: number, a2: number, b2: number) {
  return Math.sqrt((a2 - a1) ** 2 + (b2 - b1) ** 2);
}

export function createIntermediatePoints(
  a1: number,
  b1: number,
  a2: number,
  b2: number,
) {
  const points = [];
  const aDistance = Math.abs(a2 - a1);
  const bDistance = Math.abs(b2 - b1);
  if (aDistance > bDistance) {
    const leftToRight = a1 < a2;
    for (let i = a1; leftToRight ? i <= a2 : i >= a2; leftToRight ? i++ : i--) {
      const progress = (i - Math.min(a1, a2)) / aDistance;
      let j: number;
      if (leftToRight) {
        j = Math.round((b2 - b1) * progress + b1);
      } else {
        j = Math.round((b1 - b2) * progress + b2);
      }
      points.push([i, j]);
    }
  } else {
    const upToDown = b1 < b2;
    for (
      let j = upToDown ? b1 + 1 : b1 - 1;
      upToDown ? j < b2 : j > b2;
      upToDown ? j++ : j--
    ) {
      const progress = (j - Math.min(b1, b2)) / bDistance;
      let i: number;
      if (upToDown) {
        i = Math.round((a2 - a1) * progress + a1);
      } else {
        i = Math.round((a1 - a2) * progress + a2);
      }
      points.push([i, j]);
    }
  }
  return points;
}
