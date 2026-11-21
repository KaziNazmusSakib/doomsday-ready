"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wouldCreateCycle = wouldCreateCycle;
function wouldCreateCycle(movieId, newPrerequisiteIds, graph) {
    for (const start of newPrerequisiteIds) {
        const stack = [start];
        const visited = {};
        while (stack.length > 0) {
            const id = stack.pop();
            if (id === movieId) {
                return true;
            }
            if (visited[id]) {
                continue;
            }
            visited[id] = true;
            for (const prereqId of graph[id] ?? []) {
                {
                    stack.push(prereqId);
                }
            }
        }
    }
    return false;
}
//# sourceMappingURL=circular-check.js.map