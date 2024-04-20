export const isInSameRow = (
  prevCoord: number,
  currentCoord: number,
  diff = 12
): boolean => {
  return Math.abs(currentCoord - prevCoord) <= diff;
};
