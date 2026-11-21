export function getRewatchOrder(
  targetId: number,
  graph: Record<number, number[]>,
): number[] {
   const visited: Record<number, boolean> = {};
   const order: number[] = [];

   function visit(id: number): void {
    if (visited[id]) {
      return;
    }
    visited[id] = true;

    const prerequisites = graph[id] ?? [];
    for (const prereqId of prerequisites) {
      visit(prereqId);
    }

    order.push(id);
   }

   visit(targetId);
   order.pop();
  return order;
}