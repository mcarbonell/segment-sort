# 3-Way Partitioning for Block Merge Segment Sort

## Problem Statement

Current implementation: 0.54× vs qsort when >50% duplicates

## Solution: 3-Way Partitioning (Dutch National Flag)

Dijkstra's 3-way partitioning splits array into:
- `[< pivot]` - elements less than pivot
- `[= pivot]` - elements equal to pivot  
- `[> pivot]` - elements greater than pivot

## Implementation Strategy

During segment merge, detect high-duplicate regions and apply 3-way split:

```c
// Pseudocode for mergeWith3Way
function merge3Way(arr, lo, mid, hi):
    pivot = arr[mid]
    
    // Three pointers: lt (< pivot), gt (> pivot), i (scanning)
    lt = lo      // last element < pivot
    gt = hi      // first element > pivot
    i = lo       // current scanning position
    
    while i <= gt:
        if arr[i] < pivot:
            swap(arr, i, lt)
            lt++, i++
        else if arr[i] > pivot:
            swap(arr, i, gt)
            gt--
        else:  // equal
            i++
    
    // Result: [lo..lt-1] < pivot, [lt..gt] = pivot, [gt+1..hi] > pivot
    return lt, gt
```

## When to Apply

- During merge, if `min(lenA, lenB)` > threshold AND duplicate ratio > 50%
- After detecting segment with many equal elements
- Use hash map to find frequent values in segments

## Complexity Impact

- Best case O(N) when all elements equal
- No worse than standard 2-way merge
- Reduces comparisons significantly for duplicate-heavy data

## Integration with Block Merge

1. Add "duplicate detection" phase during segment identification
2. In `bufferedMerge`, check if segment has high duplicate count
3. If high duplicates → use 3-way merge instead of standard merge
4. Falls back to standard merge if 3-way shows no benefit

## Expected Improvement

- Current: 0.54× vs qsort on duplicates
- Target: Match or beat qsort on duplicates (1.0×+)
- Maintain existing performance on other data patterns