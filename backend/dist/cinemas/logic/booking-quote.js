"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBookingQuote = getBookingQuote;
function getBookingQuote(bundleSizes, groupSize) {
    if (!Number.isInteger(groupSize) || groupSize < 0) {
        return {
            possible: false,
            message: 'Group size must be a non-negative integar.',
        };
    }
    if (groupSize === 0) {
        return {
            possible: true,
            bundleCount: 0,
            bundles: [],
        };
    }
    const impossible = Infinity;
    const best = Array(groupSize + 1).fill(impossible);
    const lastSize = Array(groupSize + 1).fill(null);
    best[0] = 0;
    for (let n = 1; n <= groupSize; n++) {
        for (const s of bundleSizes) {
            if (s <= n && best[n - s] !== impossible) {
                const candidateCount = best[n - s] + 1;
                if (candidateCount < best[n]) {
                    best[n] = candidateCount;
                    lastSize[n] = s;
                }
            }
        }
    }
    if (best[groupSize] === impossible) {
        return {
            possible: false,
            message: `No combination of bundles can sum to a group size of ${groupSize}.`,
        };
    }
    const counts = {};
    let remaining = groupSize;
    while (remaining > 0) {
        const chosen = lastSize[remaining];
        if (chosen === null) {
            return {
                possible: false,
                message: `Unable to reconstruct bundle breakdown.`,
            };
        }
        counts[chosen] = (counts[chosen] ?? 0) + 1;
        remaining -= chosen;
    }
    const bundles = [];
    for (const s of bundleSizes) {
        if (counts[s])
            bundles.push({ size: s, count: counts[s] });
    }
    return {
        possible: true,
        bundleCount: best[groupSize],
        bundles,
    };
}
//# sourceMappingURL=booking-quote.js.map