export interface BookingQuote {
  possible: boolean;
  bundleCount?: number;
  bundles?: { size: number; count: number }[];
  message?: string;
}

export function getBookingQuote(bundleSizes: number[], groupSize: number): BookingQuote {
  if (!Number.isInteger(groupSize) || groupSize < 0) {
    return {
      possible:false,
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
  const best: number[] = Array(groupSize + 1).fill(impossible);
  const lastSize: (number | null)[] = Array(groupSize + 1).fill(null);

  best[0] = 0;

  for (let n = 1; n <= groupSize; n++){
    for(const s of bundleSizes){
      if (s <= n && best[n -s] !== impossible) {
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

  const counts : Record<number, number> = {};
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

  
  const bundles : { size: number; count : number }[] = [];
  for (const s of bundleSizes) {
  if (counts[s]) bundles.push({ size: s, count: counts[s] });
    }
  
   
    return {
      possible: true,
      bundleCount: best[groupSize],
      bundles,
    };
}