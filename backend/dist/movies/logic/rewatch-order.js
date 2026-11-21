"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRewatchOrder = getRewatchOrder;
function getRewatchOrder(targetId, graph) {
    const visited = {};
    const order = [];
    function visit(id) {
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
//# sourceMappingURL=rewatch-order.js.map