/**
 * graph: movieId -> ids of its current prerequisites
 * Returns true if giving `movieId` the prerequisites `newPrerequisiteIds`
 * would create a cycle (including a movie depending on itself).
 */
export function wouldCreateCycle(
  movieId: number,
  newPrerequisiteIds: number[],
  graph: Map<number, number[]>,
): boolean {
  // TODO: write this yourself
  return false;
}