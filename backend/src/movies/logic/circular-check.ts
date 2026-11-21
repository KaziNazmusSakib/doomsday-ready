 
export function wouldCreateCycle(
  movieId: number,
  newPrerequisiteIds: number[],
  graph: Record<number, number[]>,
): boolean {
   for (const start of newPrerequisiteIds){
    const stack: number[] = [start];
    const visited: Record<number, boolean>= {};

    while (stack.length > 0) {
        const id = stack.pop()!;
    
    if (id === movieId) {
       return true;
    }

    if (visited[id]) {
      continue;
    }
    visited[id] = true;

    for (const prereqId of graph[id] ?? []) { {
      stack.push(prereqId);
    }
   }
  }
 }
 
   return false;
}